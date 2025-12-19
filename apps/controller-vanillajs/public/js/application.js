const socket = io();

let globalResults = {
    'angular-light': null,
    'angular-heavy': null
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
        renderResults(data.type, data.metrics);

        globalResults[data.type] = data.metrics;
    
        // Si ambos (angular) ya terminaron, mostrar tabla
        if (globalResults['angular-light'] && globalResults['angular-heavy']) {
            generarTablaComparativa();
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

function renderResults(type, m) {
    if (!resultsDiv) return;

    const config = tests[type];
    if (!config.results) return;
    
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

function generarTablaComparativa() {
    const l = globalResults['angular-light'];
    const h = globalResults['angular-heavy'];
    const tbody = document.getElementById('tbody-comparativa');
    document.getElementById('comparativa-final').classList.remove('hidden');

    const metricsToCompare = [
        { label: 'JS Bundle (KB)', valL: l.network.jsBundleKB, valH: h.network.jsBundleKB },
        { label: 'FCP (ms)', valL: l.performance.FCPms, valH: h.performance.FCPms },
        { label: 'FTTS (ms)', valL: l.performance.FTTSms, valH: h.performance.FTTSms },
        { label: 'Memoria (MB)', valL: l.memory.jsHeapUsedMB, valH: h.memory.jsHeapUsedMB }
    ];

    tbody.innerHTML = metricsToCompare.map(m => {
        const diff = ((m.valH - m.valL) / m.valL * 100).toFixed(1);
        const colorClass = m.valH > m.valL ? 'impacto-negativo' : 'impacto-positivo';
        const sign = m.valH > m.valL ? '+' : '';

        return `
            <tr>
                <td>${m.label}</td>
                <td>${m.valL.toFixed(2)}</td>
                <td>${m.valH.toFixed(2)}</td>
                <td class="${colorClass}">${sign}${diff}%</td>
            </tr>
        `;
    }).join('');
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