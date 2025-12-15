// Funciones principales del sitio web

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar funciones principales
    initNavigation();
    initScrollAnimations();
    initHeroAnimations();
    initNavbarScroll();
    initSmoothScroll();
    initFormValidation();
    initLazyLoading();
});

// Navegación móvil
function initNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Cerrar menú al hacer clic en un enlace
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', function(event) {
            if (!hamburger.contains(event.target) && !navMenu.contains(event.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
}

// Animaciones al hacer scroll
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observar elementos con animaciones
    const animatedElements = document.querySelectorAll(
        '.animate-fade-in-up, .animate-fade-in-left, .animate-fade-in-right, .animate-scale'
    );

    animatedElements.forEach(element => {
        observer.observe(element);
    });

    // Observar secciones completas
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        observer.observe(section);
    });
}

// Animaciones del hero
function initHeroAnimations() {
    const heroContent = document.querySelector('.hero-content');
    const heroFeatures = document.querySelector('.hero-features');

    if (heroContent) {
        setTimeout(() => {
            heroContent.classList.add('visible');
        }, 300);
    }

    if (heroFeatures) {
        setTimeout(() => {
            heroFeatures.classList.add('visible');
        }, 600);
    }
}

// Navbar scroll effect - Versión ultra-estable con debounce
function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    let lastScrollY = window.scrollY;
    let isHidden = false;
    let scrollTimeout;
    let lastActionScrollY = window.scrollY; // Referencia para evitar cambios consecutivos
    
    if (navbar) {
        window.addEventListener('scroll', function() {
            const currentScrollY = window.scrollY;
            
            // Evitar scroll negativo (rubber banding)
            if (currentScrollY < 0) return;

            // Efecto de fondo (transparencia/sombra) - siempre actualizar
            if (currentScrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            
            // Limpiar timeout anterior
            clearTimeout(scrollTimeout);
            
            // Debounce: esperar a que el scroll se detenga
            scrollTimeout = setTimeout(() => {
                // Obtener altura del hero (viewport menos padding del navbar)
                const heroHeight = window.innerHeight - 110; // 110px es el padding-top del body
                
                // Si estamos en la zona hero, siempre mostrar
                if (currentScrollY < heroHeight) {
                    navbar.style.transform = 'translateY(0)';
                    isHidden = false;
                    lastScrollY = currentScrollY;
                    lastActionScrollY = currentScrollY;
                    return;
                }
                
                const diff = currentScrollY - lastScrollY;
                
                // Umbral muy alto para prevenir cualquier rebote
                const threshold = 50; // 50px de movimiento mínimo
                
                // Prevenir cambios consecutivos rápidos
                const actionDiff = Math.abs(currentScrollY - lastActionScrollY);
                if (actionDiff < 100) return; // No actuar si no nos hemos movido suficiente desde la última acción
                
                if (Math.abs(diff) > threshold) {
                    if (diff > 0 && !isHidden) {
                        // Bajando: Ocultar
                        navbar.style.transform = 'translateY(-100%)';
                        isHidden = true;
                        lastActionScrollY = currentScrollY;
                    } else if (diff < 0 && isHidden && currentScrollY < heroHeight) {
                        // Subiendo: Solo mostrar si estamos en la zona hero
                        navbar.style.transform = 'translateY(0)';
                        isHidden = false;
                        lastActionScrollY = currentScrollY;
                    }
                    // Actualizar la referencia solo cuando actuamos
                    lastScrollY = currentScrollY;
                }
            }, 150); // Esperar 150ms a que el scroll se detenga
        });
    }
}

// Smooth scroll para enlaces internos
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Validación de formularios
function initFormValidation() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const phone = formData.get('phone');
            const message = formData.get('message');
            
            // Validación básica
            if (!name || !email || !message) {
                showNotification('Por favor, completa todos los campos obligatorios.', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Por favor, ingresa un email válido.', 'error');
                return;
            }
            
            // Enviar formulario (simulado)
            sendForm(this, { name, email, phone, message });
        });
    }
}

// Validación de email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Enviar formulario (simulado)
function sendForm(form, data) {
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    // Mostrar estado de carga
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    submitButton.disabled = true;
    
    // Simular envío
    setTimeout(() => {
        // Restaurar botón
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
        
        // Limpiar formulario
        form.reset();
        
        // Mostrar notificación de éxito
        showNotification('¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.', 'success');
        
        // Enviar a WhatsApp (opcional)
        sendWhatsAppMessage(data);
    }, 2000);
}

// Enviar mensaje a WhatsApp
function sendWhatsAppMessage(data) {
    const message = `Hola, soy ${data.name}.\nEmail: ${data.email}\n${data.phone ? `Teléfono: ${data.phone}\n` : ''}Mensaje: ${data.message}`;
    const whatsappUrl = `https://wa.me/56982283541?text=${encodeURIComponent(message)}`;
    
    // Abrir WhatsApp en nueva pestaña
    window.open(whatsappUrl, '_blank');
}

// Sistema de notificaciones
function showNotification(message, type = 'info') {
    // Eliminar notificaciones anteriores
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Crear nueva notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Estilos de notificación
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        max-width: 300px;
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Auto-eliminar después de 5 segundos
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Obtener icono según tipo de notificación
function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

// Obtener color según tipo de notificación
function getNotificationColor(type) {
    const colors = {
        success: '#28a745',
        error: '#dc3545',
        warning: '#ffc107',
        info: '#17a2b8'
    };
    return colors[type] || '#17a2b8';
}

// Lazy loading para imágenes
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback para navegadores que no soportan IntersectionObserver
        images.forEach(img => {
            img.src = img.dataset.src;
            img.classList.add('loaded');
        });
    }
}

// Animación de slide in para notificaciones
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// Función para obtener información del dispositivo
function getDeviceInfo() {
    return {
        width: window.innerWidth,
        height: window.innerHeight,
        isMobile: window.innerWidth <= 768,
        isTablet: window.innerWidth > 768 && window.innerWidth <= 1024,
        isDesktop: window.innerWidth > 1024
    };
}

// Función para ajustar elementos según el dispositivo
function adjustForDevice() {
    const deviceInfo = getDeviceInfo();
    
    if (deviceInfo.isMobile) {
        // Ajustes específicos para móviles
        document.body.classList.add('mobile-device');
    } else {
        document.body.classList.remove('mobile-device');
    }
}

// Event listeners
window.addEventListener('resize', adjustForDevice);
window.addEventListener('load', adjustForDevice);

// Función para cargar scripts dinámicamente
function loadScript(src, callback) {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    
    if (callback) {
        script.onload = callback;
    }
    
    document.head.appendChild(script);
}

// Función para cargar CSS dinámicamente
function loadCSS(href) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
}

// Utilidades adicionales
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Exportar funciones útiles para otros módulos
window.utils = {
    debounce,
    throttle,
    showNotification,
    isValidEmail,
    getDeviceInfo,
    loadScript,
    loadCSS
};