import { state } from "../core/state.js";
import { formatTimestamp } from "../utils/date.js";
import { runCycle, showComparison, seleccionarFrw, setVersusMode } from "../core/actions.js"

export async function renderDashboard() {

    try {
        await new Promise(r => setTimeout(r, 600));
        const grid = document.getElementById('main-grid');
        grid.innerHTML = ''; // Limpiar skeletons

        state.getFrameworkInfo().forEach(fw => {
            // Lógica de estado v1.2
            const frw = state.getFrameworkData(fw.id);
            const isReady = frw.light && frw.heavy;
            
            // Obtener fecha del último test (si existe)
            const fecha = formatTimestamp(frw.timestamp);
            const lastRun = frw.heavy ? fecha : 'N/A';
            const phaseData = state.getPhaseData(fw.id);

            // HTML de la Card Real
            const cardHTML = `
                <div id="card-${fw.id}" class="fw-card ${isReady ? 'ready' : ''}">
                    <span class="status-pill ${phaseData.pill}">
                        ${phaseData.text}
                    </span>
                    
                    <h2 class="fw-name" style="color: ${fw.color}">
                        ${fw.name} <sub style="font-size:0.6em; color:var(--text-dim)">${fw.version}</sub>
                    </h2>
                    
                    <div class="card-actions" id="actions-${fw.id}">
                        ${isReady 
                            ? `<button class="btn btn-retest" >Restart test</button>
                                <button class="btn btn-compare" >Show Report</button>`
                            : `<button class="btn btn-run" >Run Test</button>`
                        }
                    </div>

                    <fw-footer id="footer-${fw.id}" class="last-run">
                        <div id="date-${fw.id}" style="transition: opacity 0.3s;">
                            Last Test: <strong>${lastRun}</strong>
                        </div>

                        <div hidden id="run-test-${fw.id}" class="running-status">
                            <p id="status-text-${fw.id}" style="margin:0 0 5px 0; font-size:0.85rem; color:var(--accent-blue)">
                                [1/2] Start Light Test...
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


export function updateCardUI(fwId) {
    const phaseData = state.getPhaseData(fwId);
    
    // 1. Actualizar el PILL (Color y Texto)
    const pill = document.querySelector(`#card-${fwId} .status-pill`);
    if (pill) {
        pill.className = `status-pill ${phaseData.pill}`;
        pill.innerText = phaseData.phase === 5 ? `⚔️ ${fwId.toUpperCase()}` : phaseData.text;
    }

    // Resaltar la card completa si está seleccionada
    const cardfw = document.getElementById(`card-${fwId}`);
    if (cardfw) {
        if (phaseData.phase === 5) cardfw.classList.add('card-selected');
        else cardfw.classList.remove('card-selected');
    }

    // 2. Actualizar los BOTONES (Actions)
    const actionsContainer = document.getElementById(`actions-${fwId}`);
    if (actionsContainer) {
        const isReady = phaseData.phase === 4; // Fase SELECT / READY
        
        actionsContainer.innerHTML = isReady 
            ? `<button class="btn btn-retest" >Restart test</button>
               <button class="btn btn-compare" >Show Report</button>`
            : phaseData.phase < 4 ?
                `<button class="btn btn-run" >Run Test</button>`
                :`<button class="btn btn-compare" >Show Report</button>`;
    }

    // 3. Actualizar la Card completa (Borde verde si está ready)
    const card = document.getElementById(`card-${fwId}`);
    if (card) {
        if (phaseData.phase === 4) card.classList.add('ready');
        else card.classList.remove('ready');
    }
}

export function updateTimestamp(fwId) {
    // update timestamp
    const fwState = state.getFrameworkData(fwId);
    const timestamp = formatTimestamp(fwState.timestamp);
    const timestampHTML = document.getElementById(`date-${fwId}`);
    timestampHTML.innerHTML = `Last Test: <strong>${timestamp}</strong>`;
    timestampHTML.style.display = 'block';
    timestampHTML.style.opacity = '1';
}

export function setupUIIntent() {
    const grid = document.getElementById('main-grid');

    grid.addEventListener('click', (e) => {
        // 1. Detectar qué elemento se clickeó
        const target = e.target;
        
        // 2. Buscar el ID del framework en el ancestro más cercano (la card)
        const card = target.closest('.fw-card');
        if (!card) return;
        
        const fwId = card.id.replace('card-', '');

        // 3. Ejecutar acción según la clase del botón
        if (target.classList.contains('btn-run') || target.classList.contains('btn-retest')) {
            runCycle(fwId);
        }
        
        else if (target.classList.contains('btn-compare')) {
            showComparison(fwId);
        }

        else if (target.classList.contains('status-pill')) {
            const card = target.closest('.fw-card');
            const fwId = card.id.replace('card-', '');
            seleccionarFrw(fwId);
        } 
    });
}

window.addEventListener('state:togglebuttons', (toggle) =>{
    toggleAllButtons(toggle);
});

window.addEventListener('state:updated', (e) => {
    updateCardUI(e.detail['fwId'])
});

window.addEventListener('test:progress', (e) => {
    // Extraemos todo del detail del evento
    const { fwId, porcentaje, step, variant, current, total } = e.detail;

    const progressContainer = document.getElementById(`progreso-test-${fwId}`);
    const statusText = document.getElementById(`status-text-${fwId}`);

    if (progressContainer) {
        const textP = progressContainer.querySelector('p');
        const progressBar = progressContainer.querySelector('progress');
        
        // Actualizamos la barra y el texto con los datos reales
        if (textP) textP.innerText = `${Math.round(porcentaje)}% (${current}/${total})`;
        if (progressBar) progressBar.value = porcentaje;

        if (statusText) {
            const cleanVariant = variant.toUpperCase();
            // Buscamos el puerto en el estado si es necesario
            statusText.innerText = `${step} TESTING VERSION ${cleanVariant}`;
            statusText.style.color = variant === 'heavy' ? 'var(--accent-red)' : 'var(--accent-blue)';
        }
    }
});

window.addEventListener('test:complete', (e) => {

});