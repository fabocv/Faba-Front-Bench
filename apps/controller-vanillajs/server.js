const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const puppeteer = require('puppeteer');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
    socket.on('start-test', async (data) => {
        const { url, type } = data;
        const iterations = 20;
        let results = [];

        // 1. Lanzamos el navegador una sola vez para la sesión de pruebas
        const browser = await puppeteer.launch({ headless: "new" });

        try {
            for (let i = 0; i < iterations; i++) {
                // 2. CREAMOS LA PÁGINA (Aquí estaba el error anterior)
                const context = await browser.createBrowserContext();
                const page = await context.newPage();

                // 3. Navegamos a la URL de Angular (puerto 4200)
                await page.goto(url, { waitUntil: 'networkidle0' });

                // 4. Esperamos a que el Harness de Angular termine
                await page.waitForFunction(() => window.fabaRawMetrics !== undefined, { timeout: 30000 });
                
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
            console.error("Error durante el test:", error);
            socket.emit('test-error', { message: error.message });
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