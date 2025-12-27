export function formatTimestamp(dateValue) {
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