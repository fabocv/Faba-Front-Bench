import { FRAMEWORKS, STATE_PILL, STATE_FRW } from '../config/constants.js';

class StateManager {
    // Campos privados para evitar acceso directo desde fuera
    #frameworksState = { ...FRAMEWORKS.state }; 
    #comparison = { fw1: null, fw2: null };
    #versusMode = 'light';
    #isRunning = false;

    constructor() {
        this.frameworksInfo = FRAMEWORKS.UI;
    }

    // --- GETTERS ---

    getIsRunning() { return this.#isRunning; }
    getVersusMode() { return this.#versusMode; }

    getFrameworkData(id) { return this.#frameworksState[id] || null; }

    getFrameworkInfo() { return this.frameworksInfo; }

    getPhaseData(id) {
        const data = this.getFrameworkData(id);
        if (!data) return { text: 'UNKNOWN', pill: 'pill-error' };
        
        return {
            text: STATE_FRW[data.phase],
            pill: STATE_PILL[data.phase],
            phase: data.phase
        };
    }

    getComparison() {
        return { ...this.#comparison }; // Devolvemos copia para evitar mutación
    }

    // --- SETTERS / ACTIONS ---
    async updateMetrics(id, variant, metrics, timestamp, environment, params = null) {
        const fw = this.#frameworksState[id];
        if (!fw) return;

        fw[variant] = metrics;
        
        // Si tenemos timestamp y environment, los actualizamos también
        if (timestamp) fw.timestamp = timestamp;
        if (environment) fw.environment = environment;

        if (fw.light && fw.heavy) {
            fw.phase = 4; // Fase 'SELECT'
            this.#isRunning = false;
        } else if (fw.light && !fw.heavy) {
            fw.phase = 3; // Fase  'TEST 2/2
        } else {
            fw.phase = 1
        }

        if (params && params.phase) fw.phase = params.phase; // Si fase es 2 -> TEST 1/2
        
        return fw.phase;
    }


    setRunningTest( running ) { this.#isRunning = running;  }
    

    setPhase(id, newPhase) {
        const frw = this.#frameworksState[id];
        if (frw) {
            frw.phase = newPhase ?
             newPhase: 
                frw.light && frw.heavy ?
                    newPhase : 1;
        }
    }

    setVersusMode(mode) {
        if (!['light', 'heavy'].includes(mode)) return
        this.#versusMode = mode
    }

    toggleComparison(id) {
        // Lógica inteligente: si ya está, lo quita; si no, lo pone en el slot libre
        if (this.#comparison.fw1 === id) this.#comparison.fw1 = null;
        else if (this.#comparison.fw2 === id) this.#comparison.fw2 = null;
        else if (!this.#comparison.fw1) this.#comparison.fw1 = id;
        else if (!this.#comparison.fw2) this.#comparison.fw2 = id;
        return this.#comparison;
    }

    toggleAllButtons(value) {
        window.dispatchEvent(new CustomEvent('state:togglebutton', {
            detail: { toggle: value }
        }));
    }
}

// Exportamos una única instancia
export const state = new StateManager();