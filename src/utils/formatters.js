export function formatearGuaranies(numero) {
    if (!numero && numero !== 0) return '0';
    
    // Limpiar si viene como string
    if (typeof numero === 'string') {
        numero = parseInt(numero.replace(/[^\d]/g, ''));
    }
    
    // Formatear con puntos
    return new Intl.NumberFormat('es-PY').format(numero);
}