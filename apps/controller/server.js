const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const puppeteer = require('puppeteer');
const path = require('path');

const fs = require('fs');
const RateLimit = require('express-rate-limit');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const lastResultsLimiter = RateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
});

const indexLimiter = RateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
});

const FABAVERSION = "1.2.0";
const os = require('os');


app.use(express.static(path.join(__dirname, 'public'))); 

app.get('/', indexLimiter, (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Asegurar que la carpeta existe al arrancar el servidor
const resultsDir = path.join(__dirname, 'results');
if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir);
    console.log("[Faba] Carpeta /results creada automáticamente.");
}

// 1. Ruta para que el Controlador recupere los últimos datos al cargar
app.get('/api/last-results', lastResultsLimiter, (req, res) => {
    const directoryPath = path.join(__dirname, 'results');
    
    if (!fs.existsSync(directoryPath)) {
        return res.json([]);
    }

    const files = fs.readdirSync(directoryPath);
    const results = [];

    files.filter(file => file.endsWith('.json')).forEach(file => {
        try {
            const filePath = path.join(directoryPath, file);
            const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            results.push(content);
        } catch (error) {
            console.error(`Error leyendo archivo ${file}:`, error);
        }
    });

    res.json(results);
});


io.on('connection', (socket) => {
    socket.on('start-test', async (data) => {
        const { url, type } = data;
        const iterations = 20;
        let results = [];
        let browser;

        const osInfo = {
            platform: os.platform(),     // win32, linux, darwin
            release: os.release(),       // Versión del kernel/OS
            arch: os.arch(),             // x64, arm
            cpus: os.cpus()[0].model     // Modelo del procesador
        };

        // Solo permitir localhost o 127.0.0.1
        if (!url.startsWith('http://localhost') && !url.startsWith('http://127.0.0.1')) {
            return socket.emit('test-error', { 
                message: "Seguridad: Solo se permiten pruebas en entornos locales (localhost)." 
            });
        }

        let networkSpeed = "Unknown";
        let browserVersion = "Unknown";

        try {
            // 1. Lanzamos el navegador una sola vez para la sesión de pruebas
            browser = await puppeteer.launch({ headless: "new" });

            browserVersion = await browser.version();

            for (let i = 0; i < iterations; i++) {
                // 2. CREAMOS LA PÁGINA (Aquí estaba el error anterior)
                const context = await browser.createBrowserContext();
                const page = await context.newPage();

                // Seguridad: Solo localhost
                if (!url.startsWith('http://localhost') && !url.startsWith('http://127.0.0.1')) {
                    throw new Error("Seguridad: Solo se permiten pruebas en entornos locales.");
                }

                // 3. Navegamos a la URL del framework
                try {
                    await page.goto(url, { waitUntil: 'networkidle0', timeout: 20000 });
                    networkSpeed = await page.evaluate(() => {
                        // Intentamos obtener la velocidad estimada de la API de red del navegador
                        return navigator.connection ? navigator.connection.downlink + " Mbps" : "N/A";
                    });
                } catch (e) {
                    throw new Error(`No se pudo acceder a ${url}. ¿Está ${data.type} corriendo?`);
                }

                // 4. VALIDACIÓN DE HANDSHAKE ---
                // Validar el tipo de App mediante Handshake
                const detectedType = await page.evaluate(() => window.fabaAppType);

                // Si no hay variable, o es diferente a la solicitada
                if (!detectedType || detectedType !== type) {
                    const errorMsg = detectedType 
                        ? `MISMATCH:${detectedType}` 
                        : "ERROR: No se detectó variable fabaAppType en la App";
                    throw new Error(errorMsg);
                }
                // 5. Esperamos a que el Harness del framework termine
                // Error común: El Harness no carga o tarda demasiado
                try {
                    await page.waitForFunction(() => window.fabaRawMetrics !== undefined, { timeout: 15000 });
                } catch (e) {
                    throw new Error(`El Harness de auditoría no respondió. Revisa la consola de ${data.type}.`);
                }
                
                const metrics = await page.evaluate(() => window.fabaRawMetrics);
                results.push(metrics);

                // Notificar progreso al controlador
                socket.emit('test-progress', { 
                    current: i + 1, 
                    total: iterations, 
                    type: type 
                });

                await context.close();
            }

            // 5. Procesar y enviar resultados finales
            const finalMetrics = processMetrics(results);

            // CREAMOS EL OBJETO DE RESULTADO
            const testResult = {
                fabaVersion: FABAVERSION,
                type: data.type,
                headless: true,
                timestamp: new Date().toISOString(),
                environment: {
                    browser: await browser.version(),
                    os: osInfo,
                    networkSpeed: networkSpeed,
                    cpuModel: os.cpus()[0].model,
                    logicalCores: os.cpus().length,
                    totalMemoryGB: Math.round(os.totalmem() / (1024 ** 3)),
                    freeMemoryBeforeTest: Math.round(os.freemem() / (1024 ** 3)),
                    platform: os.platform(), // 'win32', 'linux'
                    isPluggedIn: true
                },
                metrics: finalMetrics
            };

            // 1. GUARDAR EN DISCO (Sobrescribir)
            try {
                // 2. GUARDADO FÍSICO (Sobrescribe el anterior del mismo tipo)
                const fileName = `${type}.json`;
                const filePath = path.join(resultsDir, fileName);
                fs.writeFileSync(filePath, JSON.stringify(testResult, null, 2), 'utf8');
                console.log(`✅ [Faba] Archivo guardado/actualizado: ${fileName}`);
            } catch (fsError) {
                console.error("❌ Error escribiendo el archivo JSON:", fsError.message);
            }

            // 2. ENVIAR AL CONTROLADOR
            io.emit('test-complete', testResult);

            //socket.emit('test-complete', { type, metrics: finalMetrics });

        } catch (error) {
            console.error("❌ Error en el test:", error.message);
            socket.emit('test-error', { 
                requestedType: type, 
                detectedType: error.message.includes('MISMATCH:') ? error.message.split(':')[1] : null,
                message: error.message 
            });
        } finally {
            await browser.close();
        }
    });

});

function processMetrics(data) {
    const avg = (key, subKey) => data.reduce((a, b) => a + b[key][subKey], 0) / data.length;
    // Cálculo de desviación estándar para el FTTS
    const fttsMean = avg('performance', 'FTTSms');
    const fttsVariance = data.reduce((acc, curr) => acc + Math.pow(curr.performance.FTTSms - fttsMean, 2), 0) / data.length;
    
    return {
        network: {
            jsBundleKB: avg('network', 'jsBundleKB'),
            totalTransferredKB: avg('network', 'totalTransferredKB')
        },
        performance: {
            FCPms: avg('performance', 'FCPms'),
            FTTSms: fttsMean,
            stdDev: Math.sqrt(fttsVariance)
        },
        memory: {
            jsHeapUsedMB: avg('memory', 'jsHeapUsedMB')
        }
    };
}

server.listen(3000, () => console.log('🚀 Controlador Faba en http://localhost:3000'));