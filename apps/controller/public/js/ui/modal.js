
export function openModal() {
    const modal = document.getElementById('details-modal');
    const overlay = document.getElementById('overlay');
    if (modal && overlay) {
        modal.style.display = 'block';
        overlay.style.display = 'block';
    }
}

export function closeModal() {
    const modal = document.getElementById('details-modal');
    const overlay = document.getElementById('overlay');
    if (modal && overlay) {
        modal.style.display = 'none';
        overlay.style.display = 'none';
    }
}

// Inicializar escuchas de cierre (tecla ESC o clic en overlay)
export function initModalEvents() {
    const overlay = document.getElementById('overlay');
    const closeBtn = document.querySelector('.close-modal'); // Asegúrate de tener esta clase

    if (overlay) overlay.addEventListener('click', closeModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
}