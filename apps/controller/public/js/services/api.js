export async function fetchHistory() {
    try {
        const response = await fetch('/api/last-results');
        const lastData = await response.json();

        if (lastData && lastData.length > 0) {
            console.log("datos obtenidos")
            return lastData;
        } else {
            console.log("ℹ️ No hay historial previo.");
        }
    } catch (error) {
        console.error("Error cargando historial:", error);
        return null
    }
    return null
}