document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('galleryModal');
    const modalImg = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    const closeBtn = document.querySelector('.close-modal');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (!modal) return;

    // Abrir modal al hacer clic en una imagen
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            if (img) {
                modal.style.display = 'flex';
                // Pequeño retardo para la animación
                setTimeout(() => {
                    modal.classList.add('active');
                }, 10);
                
                modalImg.src = img.src;
                modalImg.alt = img.alt;
                
                // Buscar título y descripción si existen
                const title = this.querySelector('.gallery-title');
                const desc = this.querySelector('.gallery-description');
                
                let captionText = '';
                if (title) captionText += `<h3>${title.innerText}</h3>`;
                if (desc) captionText += `<p>${desc.innerText}</p>`;
                
                // Si no hay info específica, usar el alt de la imagen
                if (!captionText) {
                    captionText = `<p>${img.alt}</p>`;
                }
                
                modalCaption.innerHTML = captionText;
            }
        });
    });

    // Cerrar modal
    function closeModal() {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300); // Esperar a que termine la transición
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    // Cerrar al hacer clic fuera de la imagen
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Cerrar con tecla ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
});