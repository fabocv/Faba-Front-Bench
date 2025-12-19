const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const puppeteer = require('puppeteer');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public'))); 

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

io.on('connection', (socket) => {
    socket.on('start-test', async (data) => {
        const { url, type } = data;
        const iterations = 20;
        let results = [];
        let browser;

        // Solo permitir localhost o 127.0.0.1
        if (!url.startsWith('http://localhost') && !url.startsWith('http://127.0.0.1')) {
            return socket.emit('test-error', { 
                message: "Seguridad: Solo se permiten pruebas en entornos locales (localhost)." 
            });
        }

        try {
            // 1. Lanzamos el navegador una sola vez para la sesión de pruebas
            browser = await puppeteer.launch({ headless: "new" });

            for (let i = 0; i < iterations; i++) {
                // 2. CREAMOS LA PÁGINA (Aquí estaba el error anterior)
                const context = await browser.createBrowserContext();
                const page = await context.newPage();

                // Seguridad: Solo localhost
                if (!url.startsWith('http://localhost') && !url.startsWith('http://127.0.0.1')) {
                    throw new Error("Seguridad: Solo se permiten pruebas en entornos locales.");
                }

                // 3. Navegamos a la URL de Angular (puerto 4200)
                try {
                    await page.goto(url, { waitUntil: 'networkidle0', timeout: 20000 });
                } catch (e) {
                    throw new Error(`No se pudo acceder a ${url}. ¿Está Angular corriendo?`);
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
                // 5. Esperamos a que el Harness de Angular termine
                // Error común: El Harness no carga o tarda demasiado
                try {
                    await page.waitForFunction(() => window.fabaRawMetrics !== undefined, { timeout: 15000 });
                } catch (e) {
                    throw new Error("El Harness de auditoría no respondió. Revisa la consola de Angular.");
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
            socket.emit('test-complete', { type, metrics: finalMetrics });

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