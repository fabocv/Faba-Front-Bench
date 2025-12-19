const socket = io();

const btnLight = document.getElementById('btn-angular-bsl-light');
const progressText = document.querySelector('#progreso-test p');
const progressBar = document.querySelector('#progreso-test progress');
const resultsDiv = document.getElementById('angular-light-results');

if (btnLight) {
    btnLight.addEventListener('click', () => {
        btnLight.disabled = true;
        // Reset visual antes de empezar
        if (progressBar) progressBar.value = 0;
        if (progressText) progressText.innerText = "0 / 20";
        
        socket.emit('start-test', { 
            url: 'http://localhost:4200', 
            type: 'angular-light' 
        });
    });
}

// Escuchar progreso y mover la barra
socket.on('test-progress', (data) => {
    if (data.type === 'angular-light') {
        const porcentaje = (data.current / data.total) * 100;
        
        if (progressText) {
            progressText.innerText = `${data.current} / ${data.total}`;
        }
        if (progressBar) {
            progressBar.value = porcentaje;
        }
    }
});

socket.on('test-complete', (data) => {
    if (data.type === 'angular-light') {
        const threshold = 150; // Tu umbral de estabilidad
        const sigma = data.metrics.performance.stdDev;

        if (sigma > threshold) {
            console.warn(`⚠️ Prueba inestable: σ=${sigma.toFixed(2)}ms. Recomendado repetir.`);
            // Opcional: Cambiar el color de fondo del resultado a naranja/rojo
            resultsDiv.style.border = "2px solid #ffcc00";
        } else {
            resultsDiv.style.border = "none";
        }

        btnLight.disabled = false;
        renderResults(data.metrics);
    }
});
function renderResults(m) {
    if (!resultsDiv) return;
    
    resultsDiv.classList.remove('hidden');
    resultsDiv.innerHTML = `
        <div class="accordion">
            <details open>
                <summary>📦 Red</summary>
                <p>JS Bundle: ${m.network.jsBundleKB.toFixed(2)} KB</p>
                <p>Total Transferred: ${m.network.totalTransferredKB.toFixed(2)} KB</p>
            </details>
            <details open>
                <summary>⚡ Rendimiento</summary>
                <p>FCP (Pintado): ${m.performance.FCPms.toFixed(2)} ms</p>
                <p>FTTS (Estable): ${m.performance.FTTSms.toFixed(2)} ms</p>
                <p>Estabilidad (σ): ±${m.performance.stdDev.toFixed(2)} ms</p>
            </details>
            <details open>
                <summary>💾 Memoria</summary>
                <p>Heap Used: ${m.memory.jsHeapUsedMB.toFixed(2)} MB</p>
            </details>
        </div>
    `;

    // Mostrar interpretación humana
    const infoBox = document.getElementById('interpretation-box');
    const infoText = document.getElementById('interpretation-text');
    if (infoBox && infoText) {
        infoBox.classList.remove('hidden');
        infoText.innerHTML = getHumanInterpretation(m);
    }
}

function getHumanInterpretation(m) {
    let html = "";

    // 1. Análisis de Velocidad (FTTS)
    if (m.performance.FTTSms < 500) {
        html += `<p>🚀 <strong>Rendimiento Instantáneo:</strong> La aplicación es excepcionalmente fluida. El usuario percibe una carga inmediata, lo que garantiza una retención máxima.</p>`;
    } else if (m.performance.FTTSms < 1000) {
        html += `<p>✅ <strong>Buen Rendimiento:</strong> La respuesta es rápida y cumple con los estándares modernos de usabilidad.</p>`;
    } else {
        html += `<p>⚠️ <strong>Carga Perceptible:</strong> El usuario nota una pequeña espera. Hay margen para optimizar el renderizado masivo.</p>`;
    }

    // 2. Análisis de Estabilidad (Sigma)
    if (m.performance.stdDev < 50) {
        html += `<p>💎 <strong>Consistencia de Élite:</strong> La variabilidad es mínima (σ=${m.performance.stdDev.toFixed(1)}ms), lo que indica que Angular gestiona los recursos de forma determinista y sin bloqueos.</p>`;
    } else if (m.performance.stdDev > 150) {
        html += `<p>🌪️ <strong>Inestabilidad Detectada:</strong> Se detectó ruido sistémico o picos de latencia durante las pruebas. Se recomienda cerrar otros procesos y repetir.</p>`;
    } else {
        html += `<p>⚖️ <strong>Estabilidad Normal:</strong> La variación es aceptable para un entorno de ejecución estándar.</p>`;
    }

    // 3. Análisis de Memoria
    const memoryStatus = m.memory.jsHeapUsedMB < 15 ? "muy eficiente" : "moderada";
    html += `<p>💾 <strong>Eficiencia de Memoria:</strong> El uso de <strong>${m.memory.jsHeapUsedMB.toFixed(1)} MB</strong> es ${memoryStatus} para procesar 1000 registros, demostrando un buen manejo del Garbage Collector.</p>`;

    return html;
}