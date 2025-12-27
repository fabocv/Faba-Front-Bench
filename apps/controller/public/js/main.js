import { state } from './core/state.js';
import { initSockets } from './core/socket-manager.js';
import { fetchHistory } from './services/api.js';
import { renderDashboard, setupUIIntent } from './ui/dashboard.js';
import { initModalEvents } from './ui/modal.js';

async function bootstrap() {
    try {
        // 1. Obtener historial previo
        const history = await fetchHistory();
        
        // 2. Poblar el estado con los resultados previos
        history.forEach(async test => {
            const [fwId, variant] = test.type.split('-');
            await state.updateMetrics(fwId, variant, test.metrics, test.timestamp, test.environment);
            
            // Lógica para determinar la fase inicial (ej: si tiene ambos, fase 4)
            const data = state.getFrameworkData(fwId);
        });

        // 3. Renderizar la interfaz por primera vez
        renderDashboard();

        // 4. Configurar interacciones (clics en botones)
        setupUIIntent();

        // 5. Encender la escucha de eventos de red
        initSockets();

        initModalEvents();

        console.log("🚀 Benchmark App inicializada correctamente");
    } catch (error) {
        console.error("💥 Error crítico al iniciar:", error);
    }
}

// Arrancar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', bootstrap);