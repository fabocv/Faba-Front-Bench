const socket = io();

STATE_FRW = ['NOT ALLOWED','TEST PENDING', 'TESTING [1/2]', 'TESTING [2/2]', 'SELECT', 'SELECTED', ]
STATE_PILL = ['pill-not-allowed', 'pill-pending', 'pill-testing', 'pill-testing', 'pill-select', 'pill-selected']
STATE_COMPARISON = {
    fw1: null,
    fw2: null
} 

let CURRENT_VERSUS_MODE = 'light'; // Por defecto comienza en Light

const metricsConfig = [
    { label: 'Estabilidad (σ)', key: 'performance', subKey: 'stdDev' },
    { label: 'JS Bundle (KB)', key: 'network', subKey: 'jsBundleKB' },
    { label: 'FCP (ms)', key: 'performance', subKey: 'FCPms' },
    { label: 'FTTS (ms)', key: 'performance', subKey: 'FTTSms' },
    { label: 'Memoria (MB)', key: 'memory', subKey: 'jsHeapUsedMB' }
];

FRAMEWORKS = {
    UI: [
        { 
            id: 'angular', 
            name: 'Angular', 
            version: 'v21 / Zoneless', 
            desc: 'CSS vs MUI',
            color: '#3b82f6' 
        },
        { 
            id: 'react', 
            name: 'React', 
            version: '18 / SWC', 
            desc: 'DOM  vs MUI',
            color: '#3b82f6' 
        },
        { 
            id: 'vue', 
            name: 'Vue.js', 
            version: 'v3', 
            desc: 'Reactivity API + Vuetify',
            color: '#3b82f6' 
        },
    ],
    state:
    {
        'angular': 
            {
                phase: 1,
                light: null,
                heavy: null,
                lightPort: 4201,
                heavyPort: 4202,
                timestamp: null,
                environment: null,
            },
        'react':
            {
                phase: 1,
                light: null,
                heavy: null,
                lightPort: 3001,
                heavyPort: 3002,
                timestamp: null,
                environment: null,
            },
        'vue':
            {
                phase: 1,
                light: null,
                heavy: null,
                lightPort: 3003,
                heavyPort: 3004,
                timestamp: null,
                environment: null,
            },
    }
}


let isRunning = false;

function toggleAllButtons(disabled) {
    const buttons = document.querySelectorAll('.btn'); 
    
    buttons.forEach(btn => {
        btn.disabled = disabled;
        btn.style.opacity = disabled ? '0.4' : '1';
        btn.style.cursor = disabled ? 'not-allowed' : 'pointer';
        
        // Evitamos que el usuario haga clic aunque el CSS falle
        if (disabled) {
            btn.style.pointerEvents = 'none';
        } else {
            btn.style.pointerEvents = 'auto';
        }
    });
    isRunning = disabled;
}

window.addEventListener('DOMContentLoaded', async () => {
    await obtenerHistorialJson();
});


async function obtenerHistorialJson() {
    try {
        const response = await fetch('/api/last-results');
        const lastData = await response.json();

        if (lastData && lastData.length > 0) {
            lastData.forEach(test => {
                const [framework, version] = test.type.split('-');
                
                // Guardar en estado
                if('light' === version) FRAMEWORKS.state[framework].light = test.metrics;
                if('heavy' === version) FRAMEWORKS.state[framework].heavy = test.metrics;

                const light = FRAMEWORKS.state[framework].light;
                const heavy = FRAMEWORKS.state[framework].heavy;
                FRAMEWORKS.state[framework].phase = light && heavy ? 4 : 1;

                FRAMEWORKS.state[framework].timestamp = test.timestamp;

                FRAMEWORKS.state[framework].environment = test.environment;

            });

        } else {
            console.log("ℹ️ No hay historial previo.");
        }
    } catch (error) {
        console.error("Error cargando historial:", error);
    }
    loadDashboard();
}

async function loadDashboard() {

    try {
        await new Promise(r => setTimeout(r, 600));
        const grid = document.getElementById('main-grid');
        grid.innerHTML = ''; // Limpiar skeletons

        FRAMEWORKS.UI.forEach(fw => {
            // Lógica de estado v1.2
            const hasLight = FRAMEWORKS.state[fw.id].light;
            const hasHeavy = FRAMEWORKS.state[fw.id].heavy;
            const isReady = hasLight && hasHeavy;
            
            // Obtener fecha del último test (si existe)
            const fecha = formatTimestamp(FRAMEWORKS.state[fw.id].timestamp);
            const lastRun = hasHeavy ? fecha : 'N/A';

            // HTML de la Card Real
            const cardHTML = `
                <div id="card-${fw.id}" class="fw-card ${isReady ? 'ready' : ''}">
                    <span class="status-pill ${STATE_PILL[FRAMEWORKS.state[fw.id].phase]}" onclick="seleccionarFrw('${fw.id}')">
                        ${STATE_FRW[FRAMEWORKS.state[fw.id].phase]}
                    </span>
                    
                    <h2 class="fw-name" style="color: ${fw.color}">
                        ${fw.name} <sub style="font-size:0.6em; color:var(--text-dim)">${fw.version}</sub>
                    </h2>
                    
                    <div class="card-actions" id="actions-${fw.id}">
                        ${isReady 
                            ? `<button class="btn btn-retest"  " onclick="runCycle('${fw.id}')">Re-Run test</button>
                                <button class="btn btn-compare" onclick="showComparison('${fw.id}')">Show Report</button>`
                            : `<button class="btn btn-run" onclick="runCycle('${fw.id}')">Run Test</button>`
                        }
                    </div>

                    <fw-footer id="footer-${fw.id}" class="last-run">
                        <div id="date-${fw.id}" style="transition: opacity 0.3s;">
                            Último test: <strong>${lastRun}</strong>
                        </div>

                        <div hidden id="run-test-${fw.id}" class="running-status">
                            <p id="status-text-${fw.id}" style="margin:0 0 5px 0; font-size:0.85rem; color:var(--accent-blue)">
                                [1/2] Iniciando Light...
                            </p>
                            <div id="progreso-test-${fw.id}" class="progreso-test">
                                <p style="margin:0; font-size:0.7rem; text-align:right">0%</p> 
                                <progress value="0" max="100" style="width:100%"></progress>
                            </div>
                        </div>
                    </fw-footer>
                </div>
            `;
            grid.innerHTML += cardHTML;
        });

    } catch (error) {
        console.error("Error cargando dashboard:", error);
        document.getElementById('main-grid').innerHTML = `<p style="color:red">Error de conexión con el controlador.</p>`;
    }
}


function runCycle(fwId) {
    toggleAllButtons(true);
    // 2. Ocultar la fecha del último test
    const dateDiv = document.getElementById(`date-${fwId}`);
    dateDiv.style.display = 'none';

    // 3. Mostrar la zona de progreso (Sacarle el hidden)
    const runContainer = document.getElementById(`run-test-${fwId}`);
    runContainer.removeAttribute('hidden');
    
    const port = FRAMEWORKS.state[fwId].lightPort;
    const type = `${fwId}-light`;
    
    FRAMEWORKS.state[fwId].phase = 2;

    socket.emit('start-test', { url: `http://localhost:${port}`, type: type });
    FRAMEWORKS.state[fwId].phase = 2;

}


function showComparison(fwId) {
    const data = FRAMEWORKS.state[fwId];
    if (!data.light || !data.heavy) return alert("Datos incompletos para generar reporte.");

    const container = document.getElementById('comparison-container');
    
    // Limpiamos el dashboard de versus para que no se mezclen
    document.getElementById('versus-dashboard').innerHTML = '';
    document.getElementById('versus-scoreboard').innerHTML = '';

    const env = data.environment;

    const tableHTML = `
        <div class="report-header">
            <h2><span style="color:var(--text-dim)">Performance Audit:</span> ${fwId.toUpperCase()}</h2>
            <p>Comparativa de escalabilidad entre versión base y carga pesada.</p>
            
            <div class="system-specs">
                <span>💻 <strong>OS:</strong> ${env.platform} (${env.os.arch})</span> | 
                <span>🚀 <strong>CPU:</strong> ${env.cpuModel}</span> | 
                <span>🧠 <strong>RAM Total:</strong> ${env.totalMemoryGB}GB</span>
            </div>
            <div class="system-specs-secondary">
                <span>🌐 <strong>Browser:</strong> ${env.browser}</span> | 
                <span>📶 <strong>Net:</strong> ${env.networkSpeed}</span>
            </div>
        </div>
        
        <div class="table-wrapper">
            <table class="modern-table">
                <thead>
                    <tr>
                        <th>Métrica</th>
                        <th>Optimizado (Light)</th>
                        <th>Carga (Heavy)</th>
                        <th class="text-right">Impuesto de Carga</th>
                    </tr>
                </thead>
                <tbody>
                    ${metricsConfig.map(m => {
                        const valL = data.light[m.key][m.subKey];
                        const valH = data.heavy[m.key][m.subKey];
                        const diff = ((valH - valL) / valL * 100).toFixed(1);
                        const isBad = diff > 40; // Umbral de "peligro"

                        return `
                            <tr>
                                <td>
                                    <div class="metric-name">${m.label}</div>
                                </td>
                                <td><span class="val-pill">${valL.toFixed(2)}</span></td>
                                <td><span class="val-pill pill-heavy">${valH.toFixed(2)}</span></td>
                                <td class="text-right">
                                    <span class="diff-tag ${isBad ? 'tag-bad' : 'tag-good'}">
                                        ${isBad ? '⚠️' : '✅'} +${diff}%
                                    </span>
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;

    container.innerHTML = tableHTML;
    openModal(); 
}

function resetDatabase() {
    if(confirm('¿Borrar todos los JSON de resultados?')) {
        // fetch('/api/reset')
        location.reload();
    }
}

function seleccionarFrw(fwId) {
    const fwState = FRAMEWORKS.state[fwId];

    // Solo permitimos seleccionar si el test está completo (Fase 4 o 5)
    if (fwState.phase < 4) {
        console.warn("El test debe estar finalizado para comparar.");
        return;
    }

    if (fwState.phase === 4) {
        // --- ACTIVAR SELECCIÓN ---
        if (!STATE_COMPARISON.fw1) {
            STATE_COMPARISON.fw1 = fwId;
            fwState.phase = 5;
        } else if (!STATE_COMPARISON.fw2) {
            STATE_COMPARISON.fw2 = fwId;
            fwState.phase = 5;
        } else {
            alert("Ya tienes 2 seleccionados. Deselecciona uno para cambiar.");
            return;
        }
    } else if (fwState.phase === 5) {
        // --- DESACTIVAR SELECCIÓN ---
        if (STATE_COMPARISON.fw1 === fwId) STATE_COMPARISON.fw1 = null;
        else if (STATE_COMPARISON.fw2 === fwId) STATE_COMPARISON.fw2 = null;
        fwState.phase = 4;
    }

    // 1. Actualizar visualmente la Card/Pill
    updateCardUI(fwId);

    // 2. Refrescar el Versus (Mostrar si hay 2, esconder si hay < 2)
    gestionarVersus();
}

function gestionarVersus() {
    const section = document.getElementById('versus-section');
    
    // Si tenemos los dos frameworks seleccionados
    if (STATE_COMPARISON.fw1 && STATE_COMPARISON.fw2) {
        section.style.display = 'block';
        renderVersusDashboard(); 
        
        if (!section.dataset.active) {
            section.scrollTo({y:2000})
            section.scrollIntoView({ behavior: 'smooth' });
            section.dataset.active = "true";
        }
    } else {
        section.style.display = 'none';
        section.dataset.active = "";
    }
}

function updateTimestamp(fwId) {
    // update timestamp
    const fwState = FRAMEWORKS.state[fwId];
    const timestamp = formatTimestamp(fwState.timestamp);
    const timestampHTML = document.getElementById(`date-${fwId}`);
    timestampHTML.innerHTML = `Último test: <strong>${timestamp}</strong>`;
    timestampHTML.style.display = 'block';
    timestampHTML.style.opacity = '1';
}

function updateCardUI(fwId) {
    const fwState = FRAMEWORKS.state[fwId];
    
    // 1. Actualizar el PILL (Color y Texto)
    const pill = document.querySelector(`#card-${fwId} .status-pill`);
    if (pill) {
        pill.className = `status-pill ${fwState.phase === 5 ? 'selected' : STATE_PILL[fwState.phase]}`;
        pill.innerText = fwState.phase === 5 ? `⚔️ ${fwId.toUpperCase()}` : STATE_FRW[fwState.phase];
    }

    // Resaltar la card completa si está seleccionada
    const cardfw = document.getElementById(`card-${fwId}`);
    if (cardfw) {
        if (fwState.phase === 5) cardfw.classList.add('card-selected');
        else cardfw.classList.remove('card-selected');
    }

    // 2. Actualizar los BOTONES (Actions)
    const actionsContainer = document.getElementById(`actions-${fwId}`);
    if (actionsContainer) {
        const isReady = fwState.phase === 4; // Fase SELECT / READY
        
        actionsContainer.innerHTML = isReady 
            ? `<button class="btn btn-retest" onclick="runCycle('${fwId}')">Re-Run test</button>
               <button class="btn btn-compare" onclick="showComparison('${fwId}')">Show Report</button>`
            : fwState.phase < 4 ?
                `<button class="btn btn-run" onclick="runCycle('${fwId}')">Run Test</button>`
                :`<button class="btn btn-compare" onclick="showComparison('${fwId}')">Show Report</button>`;
    }

    // 3. Actualizar la Card completa (Borde verde si está ready)
    const card = document.getElementById(`card-${fwId}`);
    if (card) {
        if (fwState.phase === 4) card.classList.add('ready');
        else card.classList.remove('ready');
    }
}

// Escuchar progreso y mover la barra
socket.on('test-progress', (data) => {
    // data.type viene como 'react-light' o 'angular-heavy'
    // 1. Extraemos el ID del framework y la variante
    const lastDashIndex = data.type.lastIndexOf('-');
    const fwId = data.type.substring(0, lastDashIndex); // ej: 'react'
    const variant = data.type.substring(lastDashIndex + 1); // ej: 'light' o 'heavy'

    // 2. Buscamos los contenedores dinámicos usando el ID extraído
    const progressContainer = document.getElementById(`progreso-test-${fwId}`);
    const statusText = document.getElementById(`status-text-${fwId}`);

    if (progressContainer) {
        // Seleccionamos la P y la PROGRESS dentro de ese contenedor específico
        const textP = progressContainer.querySelector('p');
        const progressBar = progressContainer.querySelector('progress');
        
        // 3. Calculamos porcentaje
        const porcentaje = (data.current / data.total) * 100;

        // 4. Actualizamos la Barra y el Contador numérico
        if (textP) textP.innerText = `${Math.round(porcentaje)}% (${data.current}/${data.total})`;
        if (progressBar) progressBar.value = porcentaje;

        // 5. Actualizamos el texto de estado (Paso 1 o 2)
        if (statusText) {
            const step = variant === 'light' ? '[1/2]' : '[2/2]';
            const cleanVariant = variant.charAt(0).toUpperCase() + variant.slice(1); // 'Light'
            const port = 'light' === variant ? FRAMEWORKS.state[fwId].lightPort : FRAMEWORKS.state[fwId].heavyPort;
            statusText.innerText = `${step} TEST LIGHT VERSION  ${cleanVariant} (PORT ${port})`;
            
            // Opcional: Cambiar color si es heavy para dar feedback visual
            statusText.style.color = variant === 'heavy' ? 'var(--accent-red)' : 'var(--accent-blue)';
        }
    }
});

socket.on('test-complete', (data) => {
    const lastDash = data.type.lastIndexOf('-');
    const fwId = data.type.substring(0, lastDash);
    const variant = data.type.substring(lastDash + 1);

    if (FRAMEWORKS.state[fwId]) {
        // 1. Guardamos los datos en el estado global (Memoria RAM)
        // No los renderizamos aún, se quedan esperando al "Show Report"
        FRAMEWORKS.state[fwId][variant] = data.metrics;

        if (variant === 'light') {
            // TRANSICIÓN INTERNA: Light -> Heavy
            FRAMEWORKS.state[fwId].phase = 3;
            updateCardUI(fwId);
            toggleAllButtons(true);
            
            // UI: Actualización directa de la barra de estado
            const step = variant === 'light' ? '[1/2]' : '[2/2]';
            const statusText = document.getElementById(`status-text-${fwId}`);
            const port = 'light' === variant ? FRAMEWORKS.state[fwId].lightPort : FRAMEWORKS.state[fwId].heavyPort;
            statusText.innerText = `${step} TEST HEAVY VERSION (PORT ${port})`;

            // Disparar automáticamente
            socket.emit('start-test', { 
                url: `http://localhost:${FRAMEWORKS.state[fwId].heavyPort}`, 
                type: `${fwId}-heavy` 
            });
        } else {
            // FIN DEL CICLO
            FRAMEWORKS.state[fwId].phase = 4;
            FRAMEWORKS.state[fwId].timestamp = data.timestamp
            FRAMEWORKS.state[fwId].environment = data.environment;
            toggleAllButtons(false); 
            updateCardUI(fwId);
            updateTimestamp(fwId);

            // UI: Limpiar la card y habilitar botones finales
            document.getElementById(`run-test-${fwId}`).hidden = true;
        }
    }
});

// Escuchar errores críticos del servidor
socket.on('test-error', (data) => {
    // 1. Liberar botones globales inmediatamente
    toggleAllButtons(false);

    // 2. Intentar identificar qué framework falló para limpiar su UI
    let fwId = "";
    if (data.detectedType || data.requestedType) {
        const type = data.detectedType || data.requestedType;
        fwId = type.substring(0, type.lastIndexOf('-'));
    }

    if (fwId) {
        const progressContainer = document.getElementById(`progreso-test-${fwId}`);
        const statusText = document.getElementById(`status-text-${fwId}`);
        
        if (statusText) statusText.innerText = "❌ Error en el test";
        if (progressContainer) {
            const progressBar = progressContainer.querySelector('progress');
            if (progressBar) progressBar.value = 0;
        }
    }

    // 3. Lógica de re-dirección automática (Tu Feature de seguridad)
    if (data.detectedType && FRAMEWORKS.state[fwId]) {
        alert(`⚠️ ¡Error de selección! Detectamos '${data.detectedType}'. Re-intentando en el puerto correcto...`);
        
        // Re-bloqueamos y disparamos
        toggleAllButtons(true);
        socket.emit('start-test', { 
            url: `http://localhost:${data.port}`, 
            type: data.detectedType 
        });
        return;
    }

    // 4. Alerta general si no es un error de redirección
    alert(`🚨 Error Crítico: ${data.message}`);
});

// Manejar desconexión total del servidor Node
socket.on('disconnect', () => {
    console.error("Se perdió la conexión con el servidor de control.");
    alert("Servidor de control desconectado. Reinicia 'node server.js'.");
});


//OLD VERSION
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


function formatTimestamp(dateValue) {
    if (!dateValue || dateValue === 'N/A') return 'N/A';

    // 1. Intentar crear el objeto Date
    const fecha = new Date(dateValue);

    // 2. Si la fecha no es válida (RangeError), devolvemos el valor original o N/A
    if (isNaN(fecha.getTime())) {
        console.warn("Timestamp inválido detectado:", dateValue);
        return dateValue; 
    }

    // 3. Extraer componentes manualmente para asegurar el formato DD-MM-YYYY HH:mm:ss
    // Usamos métodos localizados o manuales para evitar sorpresas de Intl
    const d = String(fecha.getDate()).padStart(2, '0');
    const m = String(fecha.getMonth() + 1).padStart(2, '0');
    const y = fecha.getFullYear();
    
    const h = String(fecha.getHours()).padStart(2, '0');
    const min = String(fecha.getMinutes()).padStart(2, '0');
    const s = String(fecha.getSeconds()).padStart(2, '0');

    return `${d}-${m}-${y} ${h}:${min}:${s}`;
}


function openVersusReport() {
    const section = document.getElementById('versus-section');
    section.style.display = 'block';
    
    // Renderizamos el contenido que ya teníamos
    renderVersusDashboard();

    // Scroll suave hacia la sección
    section.scrollIntoView({ behavior: 'smooth' });
}

function closeVersus() {
    document.getElementById('versus-section').style.display = 'none';
}

function setVersusMode(mode) {
    CURRENT_VERSUS_MODE = mode;
    
    // Actualizar UI de los botones
    document.getElementById('btn-mode-light').classList.toggle('active', mode === 'light');
    document.getElementById('btn-mode-heavy').classList.toggle('active', mode === 'heavy');
    
    // Re-renderizar todo con los nuevos datos
    gestionarVersus();
}

function renderVersusDashboard() {
    const fw1 = STATE_COMPARISON.fw1;
    const fw2 = STATE_COMPARISON.fw2;

    if (!fw1 || !fw2) return;
    
    let winsFw1 = 0;
    let winsFw2 = 0;

    const metrics = [
        { id: 'bundle', label: 'Bundle JS (KB)', path: ['network', 'jsBundleKB'], subtitle: 'Peso: Qué tanto debe descargar el usuario' },
        { id: 'fcp', label: 'FCP (ms)', path: ['performance', 'FCPms'], subtitle: 'Percepción: Cuánto tarda en aparecer algo en pantalla.' },
        { id: 'ftts', label: 'FTTS (ms)', path: ['performance', 'FTTSms'] , subtitle: 'Interactividad: Cuándo el sitio deja de estar congelado.'},
        { id: 'memory', label: 'Memory (MB)', path: ['memory', 'jsHeapUsedMB'], subtitle: 'Memoria: Qué tanto esfuerzo le exige al PC/Móvil.'}
    ];

    // 1. Calcular victorias antes de renderizar
    metrics.forEach(m => {
        const val1 = FRAMEWORKS.state[fw1][CURRENT_VERSUS_MODE][m.path[0]][m.path[1]];
        const val2 = FRAMEWORKS.state[fw2][CURRENT_VERSUS_MODE][m.path[0]][m.path[1]];
        if (val1 < val2) winsFw1++; else winsFw2++;
    });

    // 2. Inyectar el Scoreboard
    const scoreboard = document.getElementById('versus-scoreboard');
    scoreboard.innerHTML = `
        <div class="score-item">
            <div class="score-name">${fw1}</div>
            <div class="score-number">${winsFw1}</div>
        </div>
        <div class="score-vs">VS</div>
        <div class="score-item">
            <div class="score-name">${fw2}</div>
            <div class="score-number">${winsFw2}</div>
        </div>
    `;

    // 3. Inyectar contenedores de gráficos
    const grid = document.getElementById('versus-dashboard');
    grid.innerHTML = metrics.map(m => `<div class="chart-box" id="chart-${m.id}"></div>`).join('');

    const variant = "HEAVY (MUI)"

    // 4. Renderizar ApexCharts (con un pequeño delay para el DOM)
    setTimeout(() => {
        metrics.forEach(m => {
            const val1 = FRAMEWORKS.state[fw1][CURRENT_VERSUS_MODE][m.path[0]][m.path[1]];
            const val2 = FRAMEWORKS.state[fw2][CURRENT_VERSUS_MODE][m.path[0]][m.path[1]];
            const winner = val1 < val2 ? fw1 : fw2;

            new ApexCharts(document.querySelector(`#chart-${m.id}`), {
                series: [{
                    name: m.label,
                    data: [
                        { x: fw1.toUpperCase(), y: Number(val1.toFixed(2)) },
                        { x: fw2.toUpperCase(), y: Number(val2.toFixed(2)) }
                    ]
                }],
                chart: { type: 'bar', height: 160, toolbar: { show: false } },
                plotOptions: { bar: { horizontal: true, distributed: true, barHeight: '50%' } },
                colors: [winner === fw1 ? '#10b981' : '#4b5563', winner === fw2 ? '#10b981' : '#4b5563'],
                legend: { show: false },
                title: { text: `${m.label} Winner: ${winner.toUpperCase()}`, style: { color: '#8b949e' } },
                subtitle: { text: m.subtitle, style: { color: '#8b949e' } },
                tooltip: { theme: 'dark' }
            }).render();
        });
    }, 50);
}


function renderVersusChart() {
    const fw1Id = STATE_COMPARISON.fw1;
    const fw2Id = STATE_COMPARISON.fw2;

    // 1. Extraer métricas de interés (puedes usar tu metricsConfig)
    const metricsLabels = ['FCP (ms)', 'Bundle (KB)', 'FTTS (ms)', 'Memory (MB)'];
    
    // Función helper para sacar los valores del estado
    const getDataset = (fwId, variant) => {
        const data = FRAMEWORKS.state[fwId][variant];
        return [
            data.performance.FCPms,
            data.network.jsBundleKB,
            data.performance.FTTSms,
            data.memory.jsHeapUsedMB
        ];
    };

    const options = {
        series: [
            { name: `${fw1Id.toUpperCase()} Light`, data: getDataset(fw1Id, 'light') },
            { name: `${fw1Id.toUpperCase()} Heavy`, data: getDataset(fw1Id, 'heavy') },
            { name: `${fw2Id.toUpperCase()} Light`, data: getDataset(fw2Id, 'light') },
            { name: `${fw2Id.toUpperCase()} Heavy`, data: getDataset(fw2Id, 'heavy') }
        ],
        chart: {
            type: 'bar',
            height: 350,
            background: 'transparent',
            toolbar: { show: false }
        },
        // COLORES: Azul (L), Rojo (H), Cian (L), Naranja (H)
        colors: ['#3b82f6', '#ef4444', '#06b6d4', '#f59e0b'],
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '55%',
                endingShape: 'rounded'
            },
        },
        dataLabels: { enabled: false },
        stroke: { show: true, width: 2, colors: ['transparent'] },
        xaxis: {
            categories: metricsLabels,
            labels: { style: { colors: '#8b949e' } } // Color de texto dim
        },
        yaxis: {
            title: { text: 'Valor Métrica', style: { color: '#8b949e' } },
            labels: { style: { colors: '#8b949e' } }
        },
        legend: {
            position: 'top',
            labels: { colors: '#c9d1d9' } // Color de texto principal
        },
        fill: { opacity: 1 },
        tooltip: {
            theme: 'dark',
            y: { formatter: (val) => val.toFixed(2) }
        },
        grid: { borderColor: '#030608' } // Color de los bordes de la UI
    };

    // Destruir gráfico previo si existe para evitar duplicados
    const chartContainer = document.querySelector("#chart-versus");
    chartContainer.innerHTML = ''; 
    
    const chart = new ApexCharts(chartContainer, options);
    chart.render();
}

function closeModal() {
    document.getElementById('details-modal').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
}

function openModal() {
    document.getElementById('details-modal').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
}