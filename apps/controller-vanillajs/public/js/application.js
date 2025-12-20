const socket = io();

let globalResults = {
    'angular-light': null,
    'angular-heavy': null,
    'react-light': null,
    'react-heavy': null
};

const state = {
    results: {
        angular: { light: null, heavy: null },
        react: { light: null, heavy: null }
    },
    isTesting: false
};

const UI = {
    updateProgress: (val) => { /* ... */ },
    toggleButtons: (disabled) => { /* ... */ },
    showComparison: () => {
        const section = document.getElementById('comparativa-final');
        section.classList.remove('hidden');
        section.scrollIntoView({ behavior: 'smooth' });
    }
};

const tests = {
    'angular-light': {
        port: 4201,
        btn: document.getElementById('btn-angular-bsl-light'),
        progressP: document.querySelector('#progreso-test p'),
        progressB: document.querySelector('#progreso-test progress'),
        results: document.getElementById('angular-light-results'),
        interBox: document.getElementById('interpretation-box'),
        interText: document.getElementById('interpretation-text')
    },
    'angular-heavy': {
        port: 4202,
        btn: document.getElementById('btn-angular-bsl-heavy'),
        progressP: document.querySelector('#progreso-test-ang-heavy p'),
        progressB: document.querySelector('#progreso-test-ang-heavy progress'),
        results: document.getElementById('angular-heavy-results'),
        interBox: document.getElementById('interpretation-box-angular-mui'),
        interText: document.getElementById('interpretation-text-angular-mui')
    },
    'react-light': {
        port: 3001, 
        btn: document.getElementById('btn-react-light'), 
        results: document.getElementById('react-light-results'),
        progressP: document.querySelector('#progreso-test-react-light p'),
        progressB: document.querySelector('#progreso-test-react-light progress')
    },
    'react-heavy': { 
        port: 3002, 
        btn: document.getElementById('btn-react-heavy'), 
        results: document.getElementById('react-heavy-results'),
        progressP: document.querySelector('#progreso-test-react-heavy p'),
        progressB: document.querySelector('#progreso-test-react-heavy progress')
    }
};

// Asignar eventos a ambos botones
Object.keys(tests).forEach(key => {
    const config = tests[key];
    if (config.btn) {
        config.btn.addEventListener('click', () => {
            config.btn.disabled = true;
            if (config.progressB) config.progressB.value = 0;
            if (config.progressP) config.progressP.innerText = "0 / 20";
            
            socket.emit('start-test', { 
                url: `http://localhost:${config.port}`,
                type: key 
            });
        });
    }
});

const btnLight = document.getElementById('btn-angular-bsl-light');
const progressText = document.querySelector('#progreso-test p');
const progressBar = document.querySelector('#progreso-test progress');
const resultsDiv = document.getElementById('angular-light-results');

let isRunning = false;

function toggleAllButtons(disabled) {
    const buttons = document.querySelectorAll('.btn-testing button');
    buttons.forEach(btn => btn.disabled = disabled);
    isRunning = disabled;
}

Object.keys(tests).forEach(key => {
    const config = tests[key];
    config.btn.addEventListener('click', () => {
        if (isRunning) return;
        
        toggleAllButtons(true); // Bloqueamos todo al empezar
        socket.emit('start-test', { url: `http://localhost:${config.port}`, type: key });
    });
});

window.addEventListener('DOMContentLoaded', async () => {
    console.log("📥 Obteniendo historial de resultados...");
    try {
        const response = await fetch('/api/last-results');
        const lastData = await response.json();

        if (lastData && lastData.length > 0) {
            lastData.forEach(test => {
                const [framework, version] = test.type.split('-');
                
                // Guardar en estado
                state.results[framework][version] = test.metrics;
                globalResults[test.type] = test.metrics; // Actualizar globalResults también

                // Pintar con FECHA recuperada
                renderResults(test.type, test.metrics, test.timestamp);
                
                // Si el test recuperado fue exitoso, deshabilitamos botones si quisiéramos
                // o simplemente mostramos el resultado visualmente.
            });

            checkAndGenerateTables(); 
        } else {
            console.log("ℹ️ No hay historial previo.");
        }
    } catch (error) {
        console.error("Error cargando historial:", error);
    }
});

async function init() {
    console.log("📥 Intentando obtener historial de resultados...");
    try {
        const response = await fetch('/api/last-results');
        const lastData = await response.json();
        console.log("📊 Datos recibidos del servidor:", lastData);

        if (lastData && lastData.length > 0) {
            lastData.forEach(test => {
                const [framework, version] = test.type.split('-');
                if (state.results[framework]) {
                    state.results[framework][version] = test.metrics;
                    renderResults(test.type, test.metrics, test.timestamp);
                }
            });
            checkAndGenerateTables();
        }
    } catch (error) {
        console.error("❌ Error en la carga inicial:", error);
    }
}

// Ejecutar inmediatamente
init();


//debiera eliminarse este codigo
if (btnLight) {
    btnLight.addEventListener('click', () => {
        btnLight.disabled = true;
        // Reset visual antes de empezar
        if (progressBar) progressBar.value = 0;
        if (progressText) progressText.innerText = "0 / 20";
        
        socket.emit('start-test', { 
            url: `http://localhost:${test['angular-light'].port}`,
            type: 'angular-light' 
        });
    });
}

// Escuchar progreso y mover la barra
socket.on('test-progress', (data) => {
    const config = tests[data.type];
    if (config) {
        const porcentaje = (data.current / data.total) * 100;
        if (config.progressP) config.progressP.innerText = `${data.current} / ${data.total}`;
        if (config.progressB) config.progressB.value = porcentaje;
    }
});


socket.on('test-complete', (data) => {
    const config = tests[data.type];
    const [framework, version] = data.type.split('-');
    state.results[framework][version] = data.metrics;

    if (config) {
        const threshold = 150; // Umbral de estabilidad
        const sigma = data.metrics.performance.stdDev;

        if (sigma > threshold) {
            console.warn(`⚠️ Prueba inestable: σ=${sigma.toFixed(2)}ms. Recomendado repetir.`);
            // Opcional: Cambiar el color de fondo del resultado a naranja/rojo
            resultsDiv.style.border = "2px solid #ffcc00";
        } else {
            resultsDiv.style.border = "none";
        }

        config.btn.disabled = false;
        console.log(data.metrics);
        toggleAllButtons(false); // Liberamos al finalizar
        UI.toggleButtons(false);
        renderResults(data.type, data.metrics, data.timestamp);

        globalResults[data.type] = data.metrics;
    
        // Si ambos (angular) ya terminaron, mostrar tabla
        if (state.results[framework].light && state.results[framework].heavy) {
            generateComparisonTable(framework);
        }
    }
});

// Escuchar errores críticos del servidor
socket.on('test-error', (data) => {
    toggleAllButtons(false); // Liberamos botones
    // 1. Resetear barra de progreso si es necesario
    if (progressText) progressText.innerText = "Error";
    if (progressBar) progressBar.value = 0;

    if (data.detectedType && tests[data.detectedType]) {
        alert(`⚠️ ¡Error de selección! Presionaste el botón de '${data.requestedType}', pero detectamos '${data.detectedType}'. Iniciando test en la card correcta...`);
        
        // Redirigimos el comando al tipo correcto automáticamente
        socket.emit('start-test', { url: `http://localhost:${data.port}`, type: data.detectedType });
        toggleAllButtons(true);
        return;
    }
    // 2. Mostrar alerta visual (puedes usar un modal o un simple alert)
    alert(`🚨 Error en el Benchmark: ${data.message}`);
    return;
});

// Manejar desconexión total del servidor Node
socket.on('disconnect', () => {
    console.error("Se perdió la conexión con el servidor de control.");
    alert("Servidor de control desconectado. Reinicia 'node server.js'.");
});

function renderResults(type, m, timestamp = null) {
    if (!resultsDiv) return;

    const config = tests[type];
    if (!config || !config.results) return;
    
    // Formatear fecha si existe
    const dateStr = timestamp 
        ? new Date(timestamp).toLocaleString('es-CL', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' }) 
        : 'Recién';

    config.results.innerHTML = `
        <div class="accordion">
            <details open><summary>📦 Red</summary>
                <p>JS Bundle: ${m.network.jsBundleKB.toFixed(2)} KB</p>
                <p>Total Transferred: ${m.network.totalTransferredKB.toFixed(2)} KB</p>
            </details>
            <details open><summary>⚡ Rendimiento</summary>
                <p>FCP: ${m.performance.FCPms.toFixed(2)} ms</p>
                <p>FTTS: ${m.performance.FTTSms.toFixed(2)} ms</p>
                <p>Estabilidad (σ): ±${m.performance.stdDev.toFixed(2)} ms</p>
            </details>
            <details open><summary>💾 Memoria</summary>
                <p>Heap Used: ${m.memory.jsHeapUsedMB.toFixed(2)} MB</p>
            </details>
            <div class="result-footer" style="margin-top: 10px; font-size: 0.8em; color: #666; text-align: right; border-top: 1px solid #eee; padding-top: 5px;">
                🕒 Test realizado: ${dateStr}
            </div>
        </div>
    `;

    // Inyectar interpretación humana
    if (config.interBox && config.interText) {
        config.interBox.classList.remove('hidden');
        config.interText.innerHTML = getHumanInterpretation(m);
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

function checkAndGenerateTables() {
    // Recorremos los frameworks definidos en nuestro estado
    Object.keys(state.results).forEach(framework => {
        const data = state.results[framework];
        
        // Verificamos si ambas pruebas ya existen en el estado (recuperadas o nuevas)
        if (data.light && data.heavy) {
            console.log(`[Faba] Generando tabla comparativa para: ${framework}`);
            generateComparisonTable(framework);
        }
    });
}

function generateComparisonTable(framework) {
    const light = state.results[framework].light;
    const heavy = state.results[framework].heavy;
    const tbody = document.getElementById('tbody-comparativa');
    
    // Títulos amigables para las métricas
    const metrics = [
        { label: 'Estabilidad test(σ)', key: 'performance', subKey: 'stdDev' },
        { label: 'JS Bundle (KB)', key: 'network', subKey: 'jsBundleKB' },
        { label: 'FCP (ms)', key: 'performance', subKey: 'FCPms' },
        { label: 'FTTS (ms)', key: 'performance', subKey: 'FTTSms' },
        { label: 'Memoria (MB)', key: 'memory', subKey: 'jsHeapUsedMB' }
    ];

    const html = metrics.map(m => {
        const valL = light[m.key][m.subKey];
        const valH = heavy[m.key][m.subKey];
        
        // Cálculo de impacto porcentual
        const diff = ((valH - valL) / valL * 100).toFixed(1);
        const isNegative = valH > valL; // En rendimiento, más alto suele ser peor
        const colorClass = isNegative ? 'impacto-negativo' : 'impacto-positivo';
        const sign = isNegative ? '+' : '';

        return `
            <tr>
                <td style="text-align: left; color: var(--text-muted)">${m.label}</td>
                <td>${valL.toFixed(2)}</td>
                <td>${valH.toFixed(2)}</td>
                <td class="${colorClass}">${sign}${diff}%</td>
            </tr>
        `;
    }).join('');

    tbody.innerHTML = html;
    
    // Actualizar el título de la tabla según el framework
    document.querySelector('#comparativa-final h3').innerText = 
        `📊 Comparativa: ${framework.toUpperCase()} (Light vs Heavy)`;
    
    UI.showComparison();
}

document.getElementById('btn-export-csv').addEventListener('click', () => {
    if (!globalResults['angular-light'] || !globalResults['angular-heavy']) {
        alert("Primero debes completar ambos tests.");
        return;
    }

    const light = globalResults['angular-light'];
    const heavy = globalResults['angular-heavy'];

    // Cabeceras y Filas
    const rows = [
        ["Metrica", "Angular Light", "Angular Material", "Impacto %"],
        ["JS Bundle (KB)", light.network.jsBundleKB.toFixed(2), heavy.network.jsBundleKB.toFixed(2), (((heavy.network.jsBundleKB - light.network.jsBundleKB)/light.network.jsBundleKB)*100).toFixed(1) + "%"],
        ["FCP (ms)", light.performance.FCPms.toFixed(2), heavy.performance.FCPms.toFixed(2), (((heavy.performance.FCPms - light.performance.FCPms)/light.performance.FCPms)*100).toFixed(1) + "%"],
        ["FTTS (ms)", light.performance.FTTSms.toFixed(2), heavy.performance.FTTSms.toFixed(2), (((heavy.performance.FTTSms - light.performance.FTTSms)/light.performance.FTTSms)*100).toFixed(1) + "%"],
        ["Memoria Heap (MB)", light.memory.jsHeapUsedMB.toFixed(2), heavy.memory.jsHeapUsedMB.toFixed(2), (((heavy.memory.jsHeapUsedMB - light.memory.jsHeapUsedMB)/light.memory.jsHeapUsedMB)*100).toFixed(1) + "%"]
    ];

    // Convertir array a formato CSV
    let csvContent = "data:text/csv;charset=utf-8," 
        + rows.map(e => e.join(",")).join("\n");

    // Crear link de descarga
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `faba_benchmark_${new Date().getTime()}.csv`);
    document.body.appendChild(link);

    link.click();
    document.body.removeChild(link);
});