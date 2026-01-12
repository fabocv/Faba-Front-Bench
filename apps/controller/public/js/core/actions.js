import { state } from "./state.js";
import { metricsConfig } from "../config/constants.js";
import { openModal } from "../ui/modal.js";
import { renderVersusDashboard } from "../ui/charts.js";
import { socket } from "../core/socket-manager.js";
import { formatTimestamp } from "../utils/date.js";

window.seleccionarFrw = seleccionarFrw;

export async function runCycle(fwId) {
        
    const frw = state.getFrameworkData(fwId);
    state.setRunningTest(true);
    frw.light = null;
    frw.heavy = null;    
    state.toggleAllButtons(true);
    
    
    const dateDiv = document.getElementById(`date-${fwId}`);
    dateDiv.hidden = true;

    const runContainer = document.getElementById(`run-test-${fwId}`);
    runContainer.removeAttribute('hidden');

    const port = frw.lightPort;
    const type = `${fwId}-light`;
    
    

    socket.emit('start-test', { url: `http://localhost:${port}`, type: type });
    await state.updateMetrics(fwId,type,null, null, null, {phase: 2});
}

export function hideProgressBarSection(fwId, timestamp) {

    const dateDiv = document.getElementById(`date-${fwId}`);
    dateDiv.innerHTML = `Last Test: <strong>${formatTimestamp(timestamp)}</strong>`;
    dateDiv.hidden = false;

    const runContainer = document.getElementById(`run-test-${fwId}`);
    runContainer.hidden = true;
    runContainer.classList.add("fade-out");
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
    if (state.getIsRunning()) {return;}
    
    const comp = state.getComparison();
    const fws = [comp.fw1, comp.fw2];

    if (comp.fw1 && comp.fw2 && !fws.includes(fwId)) {
        alert("Deseleccione un framework para continuar")
        return;
    }
    const fwState = state.getFrameworkData(fwId);

    if (fwState.phase < 4) {
        console.warn("El test debe estar finalizado para comparar.");
        return;
    }

    const nuevaFase = 4 === fwState.phase ? 5:4;

    state.setPhase(fwId, nuevaFase);

    state.toggleComparison(fwId);

    window.dispatchEvent(new CustomEvent('state:updated', { 
        detail: { fwId, phase: nuevaFase } 
    }));

    gestionarVersus();
}

function gestionarVersus() {
    const comparison = state.getComparison();
    if (!comparison || !comparison.fw1 || !comparison.fw2) return;

    const {fw1, fw2} = comparison;
    const section = document.getElementById('versus-section');

    document.getElementById('versus-dashboard').innerHTML = '';
    document.getElementById('versus-scoreboard').innerHTML = '';

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
    const header = `<h2> Comparison Section </h2>
                    <p>Head-to-head technical analysis between the selected frameworks. <br> Mean (20 runs) · Scenario-specific · Not a ranking</p>
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
        const target = e.target;
        
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


export function setVersusMode(mode) {
    state.setVersusMode(mode)
    // Actualizar UI de los botones
    document.getElementById('btn-mode-light').classList.toggle('active', mode === 'light');
    document.getElementById('btn-mode-heavy').classList.toggle('active', mode === 'heavy');
    
    gestionarVersus();
}





