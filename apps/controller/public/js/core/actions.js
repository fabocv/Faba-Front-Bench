import { state } from "./state.js";
import { metricsConfig } from "../config/constants.js";
import { openModal } from "../ui/modal.js";
import { renderVersusDashboard } from "../ui/charts.js";
import { socket } from "../core/socket-manager.js";

window.seleccionarFrw = seleccionarFrw;

export async function runCycle(fwId) {
    state.toggleAllButtons(true);
    // 2. Ocultar la fecha del último test
    const dateDiv = document.getElementById(`date-${fwId}`);
    dateDiv.style.display = 'none';

    // 3. Mostrar la zona de progreso (Sacarle el hidden)
    const runContainer = document.getElementById(`run-test-${fwId}`);
    runContainer.removeAttribute('hidden');
    
    const frw = state.getFrameworkData(fwId);
    const port = frw.lightPort;
    const type = `${fwId}-light`;
    
    frw.phase = 2;

    socket.emit('start-test', { url: `http://localhost:${port}`, type: type });
    await state.updateMetrics(fwId,type,null, null, null);

}


export function showComparison(fwId) {
    const data = state.getFrameworkData(fwId);
    if (!data.light || !data.heavy) return alert("Datos incompletos para generar reporte.");

    const container = document.getElementById('comparison-container');
    
    const env = data.environment;

    const tableHTML = `
        <div class="report-header">
            <h2><span style="color:var(--text-dim)">Performance Audit:</span> ${fwId.toUpperCase()}</h2>
            <p>Scalability comparison between base version and heavy load.</p>
            
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
                        <th>Metrics</th>
                        <th>Optimized (Light) </th>
                        <th>Load (Heavy)</th>
                        <th class="text-right">Load Tax</th>
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


export function seleccionarFrw(fwId) {
    const fwState = state.getFrameworkData(fwId);

    // Solo permitimos seleccionar si el test está completo (Fase 4 o 5)
    if (fwState.phase < 4) {
        console.warn("El test debe estar finalizado para comparar.");
        return;
    }

    const nuevaFase = 4 === fwState.phase ? 5:4;

    state.setPhase(fwId, nuevaFase);

    state.toggleComparison(fwId);

    // 1. Actualizar visualmente la Card/Pill
    window.dispatchEvent(new CustomEvent('state:updated', { 
        detail: { fwId, phase: nuevaFase } 
    }));

    // 2. Refrescar el Versus (Mostrar si hay 2, esconder si hay < 2)
    gestionarVersus();
}

function gestionarVersus() {
    const comparison = state.getComparison();
    if (!comparison || !comparison.fw1 || !comparison.fw2) return;

    const {fw1, fw2} = comparison;
    const section = document.getElementById('versus-section');

    // Limpiamos el dashboard de versus para que no se mezclen
    document.getElementById('versus-dashboard').innerHTML = '';
    document.getElementById('versus-scoreboard').innerHTML = '';

    // Si tenemos los dos frameworks seleccionados
    if (fw1 && fw2) {
        section.style.display = 'block';
        renderVersusDashboard(fw1, fw2);
         
        
        if (!section.dataset.active) {
            section.scrollTo({y:2000})
            section.scrollIntoView({ behavior: 'smooth' });
            section.dataset.active = "true";
        }
        mostrarHeaderVersus();
    } else {
        section.style.display = 'none';
        section.dataset.active = "";
    }
}

function mostrarHeaderVersus() {
    const headerContent = document.getElementById('header-content');
    const header = `<h2>⚔️ Comparison Arena</h2>
                    <p>Head-to-head technical analysis between the selected frameworks.</p>
                    <div class="versus-mode-selector">
                        <span class="mode-label">Mode:</span>
                        <div class="switch-group">
                            <button type="button" id="btn-mode-light" class="mode-btn active btn-mode-light" 
                                >Light</button>
                            <button type="button" id="btn-mode-heavy" class="mode-btn btn-mode-heavy" 
                                >Heavy</button>
                        </div>
                    </div>
                    `
    headerContent.innerHTML = header;

    headerContent.addEventListener('click', (e) => {
        // 1. Detectar qué elemento se clickeó
        const target = e.target;
        
        // 2. Buscar el ID del framework en el ancestro más cercano (la card)
        const card = target.closest('.switch-group');
        if (!card) return;
        if (target.classList.contains('btn-mode-light')) {
            setVersusMode('light')
        }

        else if (target.classList.contains('btn-mode-heavy')) {
            setVersusMode('heavy');
        }
    });
    
    const mode = state.getVersusMode();
    document.getElementById('btn-mode-light').classList.toggle('active', mode === 'light');
    document.getElementById('btn-mode-heavy').classList.toggle('active', mode === 'heavy');
}


function openVersusReport() {
    const section = document.getElementById('versus-section');
    section.style.display = 'block';
    
    // Renderizamos el contenido que ya teníamos
    const {fw1, fw2} = state.getComparison();
    renderVersusDashboard(fw1, fw2);

    // Scroll suave hacia la sección
    section.scrollIntoView({ behavior: 'smooth' });
}

function closeVersus() {
    document.getElementById('versus-section').style.display = 'none';
}

export function setVersusMode(mode) {
    state.setVersusMode(mode)
    // Actualizar UI de los botones
    document.getElementById('btn-mode-light').classList.toggle('active', mode === 'light');
    document.getElementById('btn-mode-heavy').classList.toggle('active', mode === 'heavy');
    
    gestionarVersus();
}





