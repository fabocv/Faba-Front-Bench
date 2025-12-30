import { updateCardUI } from "../ui/dashboard.js";
import { hideProgressBarSection } from "./actions.js";
import { state } from "./state.js";

export const socket = io();


socket.on('test-progress', (data) => {
    // 1. Extraer el ID del framework (ej: 'react-light' -> 'react')
    const lastDashIndex = data.type.lastIndexOf('-');
    const fwId = data.type.substring(0, lastDashIndex);
    const variant = data.type.substring(lastDashIndex + 1);

    // 2. Calcular porcentaje y paso
    const porcentaje = (data.current / data.total) * 100;
    const step = variant === 'light' ? '[1/2]' : '[2/2]';

    // 3. Lanzar evento con el detalle COMPLETO
    window.dispatchEvent(new CustomEvent('test:progress', { 
        detail: { 
            fwId, 
            porcentaje, 
            step, 
            variant,
            current: data.current,
            total: data.total
        } 
    }));
});

socket.on('test-complete', async (data) => {
    const [fwId, variant] = data.type.split('-'); 

    
    
    // Actualizar el State
    const nuevaFase = await state.updateMetrics(fwId, variant, data.metrics, data.timestamp, data.environment);

    // Notificar cambio de fase (esto actualizará la UI a "Testing [2/2]")
    window.dispatchEvent(new CustomEvent('state:updated', { 
        detail: { fwId, phase: nuevaFase } 
    }));

    // Si la fase es 3, significa que terminó Light y toca Heavy
    if (nuevaFase === 3) {
        const frw = state.getFrameworkData(fwId);
        const port = frw.heavyPort;
        
        const nextType = `${fwId}-heavy`; 
        
        state.toggleAllButtons(true);

        socket.emit('start-test', { 
            url: `http://localhost:${port}`, 
            type: nextType 
        });
    }

    if (4 === nuevaFase) {
        //si terminó, se esconde la seccion visual de progresion de tests
        hideProgressBarSection(fwId, data.timestamp);
        state.toggleAllButtons(false);
        return;
    }
    

    
});

// Escuchar errores críticos del servidor
socket.on('test-error', (data) => {
    // 1. Liberar botones globales inmediatamente via evento
    state.toggleAllButtons(false);

    // 2. Intentar identificar qué framework falló para limpiar la UI
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

    // 3. Lógica de re-dirección automática 
    if (data.detectedType && state.getFrameworkData(fwId)) {
        alert(`⚠️ ¡Error de selección! Detectamos '${data.detectedType}'. Re-intentando en el puerto correcto...`);
        
        state.toggleAllButtons(true);
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


export async function initSockets() {
    try {
        const response = await fetch('/api/last-results');
        const lastData = await response.json();

        if (lastData && lastData.length > 0) {
            lastData.forEach(async test => {
                const [framework, version] = test.type.split('-');
                
                // Guardar en estado
                await state.updateMetrics(framework,version,test.metrics,
                    test.timestamp, test.environment
                )
            });

        } else {
            console.log("ℹ️ No hay historial previo.");
        }
    } catch (error) {
        console.error("Error cargando historial:", error);
    }
}