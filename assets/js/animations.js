// Sistema de animaciones avanzadas

class AnimationManager {
    constructor() {
        this.animations = new Map();
        this.observers = new Map();
        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.setupParallaxEffect();
        this.setupCounterAnimations();
        this.setupProgressBars();
        this.setupTypingEffect();
        this.setupParticleSystem();
    }

    // Configurar animaciones de scroll
    setupScrollAnimations() {
        const animatedElements = document.querySelectorAll('[data-animation]');
        
        animatedElements.forEach(element => {
            const animationType = element.dataset.animation;
            const delay = parseInt(element.dataset.animationDelay) || 0;
            const duration = parseInt(element.dataset.animationDuration) || 600;
            
            this.setupElementAnimation(element, animationType, delay, duration);
        });
    }

    // Configurar animación de elemento individual
    setupElementAnimation(element, type, delay, duration) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        this.applyAnimation(entry.target, type, duration);
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        observer.observe(element);
        this.observers.set(element, observer);
    }

    // Aplicar animación específica
    applyAnimation(element, type, duration) {
        element.style.animationDuration = `${duration}ms`;
        element.classList.add(`animate-${type}`);
        
        // Agregar a mapa de animaciones activas
        this.animations.set(element, {
            type: type,
            startTime: Date.now(),
            duration: duration
        });
    }

    // Configurar efecto parallax
    setupParallaxEffect() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        if (parallaxElements.length === 0) return;

        const handleParallax = throttle(() => {
            const scrolled = window.pageYOffset;
            const windowHeight = window.innerHeight;

            parallaxElements.forEach(element => {
                const speed = parseFloat(element.dataset.parallax) || 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        }, 16); // ~60fps

        window.addEventListener('scroll', handleParallax);
    }

    // Configurar animaciones de contador
    setupCounterAnimations() {
        const counters = document.querySelectorAll('[data-counter]');
        
        counters.forEach(counter => {
            const target = parseInt(counter.dataset.counter);
            const duration = parseInt(counter.dataset.duration) || 2000;
            const suffix = counter.dataset.suffix || '';
            const prefix = counter.dataset.prefix || '';
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateCounter(entry.target, target, duration, prefix, suffix);
                        observer.unobserve(entry.target);
                    }
                });
            });
            
            observer.observe(counter);
        });
    }

    // Animar contador
    animateCounter(element, target, duration, prefix, suffix) {
        let start = 0;
        const increment = target / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                start = target;
                clearInterval(timer);
            }
            element.textContent = prefix + Math.floor(start) + suffix;
        }, 16);
    }

    // Configurar barras de progreso
    setupProgressBars() {
        const progressBars = document.querySelectorAll('[data-progress]');
        
        progressBars.forEach(bar => {
            const progress = parseInt(bar.dataset.progress);
            const duration = parseInt(bar.dataset.duration) || 1000;
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateProgressBar(entry.target, progress, duration);
                        observer.unobserve(entry.target);
                    }
                });
            });
            
            observer.observe(bar);
        });
    }

    // Animar barra de progreso
    animateProgressBar(element, progress, duration) {
        const bar = element.querySelector('.progress-bar-fill') || element;
        bar.style.width = '0%';
        
        setTimeout(() => {
            bar.style.transition = `width ${duration}ms ease-out`;
            bar.style.width = `${progress}%`;
        }, 100);
    }

    // Configurar efecto de escritura
    setupTypingEffect() {
        const typingElements = document.querySelectorAll('[data-typing]');
        
        typingElements.forEach(element => {
            const text = element.textContent;
            const speed = parseInt(element.dataset.typing) || 100;
            
            element.textContent = '';
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.typeText(entry.target, text, speed);
                        observer.unobserve(entry.target);
                    }
                });
            });
            
            observer.observe(element);
        });
    }

    // Efecto de escritura
    typeText(element, text, speed) {
        let index = 0;
        const timer = setInterval(() => {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
            } else {
                clearInterval(timer);
            }
        }, speed);
    }

    // Configurar sistema de partículas
    setupParticleSystem() {
        const particleContainers = document.querySelectorAll('[data-particles]');
        
        particleContainers.forEach(container => {
            this.createParticleSystem(container);
        });
    }

    // Crear sistema de partículas
    createParticleSystem(container) {
        const particleCount = parseInt(container.dataset.particles) || 50;
        const particleColor = container.dataset.particleColor || '#ffffff';
        const particleSize = parseInt(container.dataset.particleSize) || 2;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: ${particleSize}px;
                height: ${particleSize}px;
                background: ${particleColor};
                border-radius: 50%;
                opacity: ${Math.random() * 0.5 + 0.2};
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: float ${Math.random() * 10 + 5}s infinite ease-in-out;
                animation-delay: ${Math.random() * 5}s;
            `;
            container.appendChild(particle);
        }
    }

    // Configurar animaciones de entrada
    setupEntryAnimations() {
        const entryAnimations = [
            'fade-in-up',
            'fade-in-down',
            'fade-in-left',
            'fade-in-right',
            'scale-in',
            'rotate-in',
            'slide-in-up',
            'slide-in-down',
            'slide-in-left',
            'slide-in-right'
        ];

        entryAnimations.forEach(animation => {
            const elements = document.querySelectorAll(`.animate-${animation}`);
            elements.forEach(element => {
                element.style.opacity = '0';
                element.style.transform = this.getInitialTransform(animation);
            });
        });
    }

    // Obtener transformación inicial según animación
    getInitialTransform(animation) {
        const transforms = {
            'fade-in-up': 'translateY(30px)',
            'fade-in-down': 'translateY(-30px)',
            'fade-in-left': 'translateX(-30px)',
            'fade-in-right': 'translateX(30px)',
            'scale-in': 'scale(0.9)',
            'rotate-in': 'rotate(-5deg)',
            'slide-in-up': 'translateY(50px)',
            'slide-in-down': 'translateY(-50px)',
            'slide-in-left': 'translateX(-50px)',
            'slide-in-right': 'translateX(50px)'
        };
        return transforms[animation] || 'translateY(30px)';
    }

    // Configurar animaciones de salida
    setupExitAnimations() {
        // Implementar animaciones de salida si es necesario
    }

    // Método para pausar todas las animaciones
    pauseAll() {
        this.animations.forEach((data, element) => {
            element.style.animationPlayState = 'paused';
        });
    }

    // Método para reanudar todas las animaciones
    resumeAll() {
        this.animations.forEach((data, element) => {
            element.style.animationPlayState = 'running';
        });
    }

    // Método para detener animación específica
    stopAnimation(element) {
        if (this.animations.has(element)) {
            element.style.animation = 'none';
            element.style.transform = '';
            element.style.opacity = '';
            this.animations.delete(element);
        }
    }

    // Método para reiniciar animación específica
    restartAnimation(element) {
        this.stopAnimation(element);
        setTimeout(() => {
            const animationType = element.dataset.animation;
            if (animationType) {
                this.applyAnimation(element, animationType, 600);
            }
        }, 100);
    }

    // Limpiar todos los observadores
    destroy() {
        this.observers.forEach((observer, element) => {
            observer.disconnect();
        });
        this.observers.clear();
        this.animations.clear();
    }
}

// Función throttle para optimizar rendimiento
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

// Inicializar el gestor de animaciones
document.addEventListener('DOMContentLoaded', function() {
    window.animationManager = new AnimationManager();
});

// Agregar estilos CSS para animaciones adicionales
const animationStyles = `
    <style>
        /* Animaciones de entrada */
        @keyframes fade-in-up {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes fade-in-down {
            from {
                opacity: 0;
                transform: translateY(-30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes fade-in-left {
            from {
                opacity: 0;
                transform: translateX(-30px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes fade-in-right {
            from {
                opacity: 0;
                transform: translateX(30px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes scale-in {
            from {
                opacity: 0;
                transform: scale(0.9);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }
        
        @keyframes rotate-in {
            from {
                opacity: 0;
                transform: rotate(-5deg);
            }
            to {
                opacity: 1;
                transform: rotate(0deg);
            }
        }
        
        @keyframes slide-in-up {
            from {
                opacity: 0;
                transform: translateY(50px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes slide-in-down {
            from {
                opacity: 0;
                transform: translateY(-50px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes slide-in-left {
            from {
                opacity: 0;
                transform: translateX(-50px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes slide-in-right {
            from {
                opacity: 0;
                transform: translateX(50px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        /* Clases de animación */
        .animate-fade-in-up {
            animation: fade-in-up 0.6s ease-out forwards;
        }
        
        .animate-fade-in-down {
            animation: fade-in-down 0.6s ease-out forwards;
        }
        
        .animate-fade-in-left {
            animation: fade-in-left 0.6s ease-out forwards;
        }
        
        .animate-fade-in-right {
            animation: fade-in-right 0.6s ease-out forwards;
        }
        
        .animate-scale-in {
            animation: scale-in 0.6s ease-out forwards;
        }
        
        .animate-rotate-in {
            animation: rotate-in 0.6s ease-out forwards;
        }
        
        .animate-slide-in-up {
            animation: slide-in-up 0.6s ease-out forwards;
        }
        
        .animate-slide-in-down {
            animation: slide-in-down 0.6s ease-out forwards;
        }
        
        .animate-slide-in-left {
            animation: slide-in-left 0.6s ease-out forwards;
        }
        
        .animate-slide-in-right {
            animation: slide-in-right 0.6s ease-out forwards;
        }
        
        /* Animación de flotación para partículas */
        @keyframes float {
            0%, 100% {
                transform: translateY(0px) rotate(0deg);
            }
            25% {
                transform: translateY(-20px) rotate(90deg);
            }
            50% {
                transform: translateY(0px) rotate(180deg);
            }
            75% {
                transform: translateY(20px) rotate(270deg);
            }
        }
        
        /* Estilos para partículas */
        .particle {
            pointer-events: none;
            z-index: 1;
        }
        
        /* Contenedor de partículas */
        [data-particles] {
            position: relative;
            overflow: hidden;
        }
        
        /* Animación de pulso mejorada */
        @keyframes pulse-strong {
            0% {
                transform: scale(1);
                box-shadow: 0 0 0 0 rgba(255, 107, 53, 0.7);
            }
            70% {
                transform: scale(1.05);
                box-shadow: 0 0 0 10px rgba(255, 107, 53, 0);
            }
            100% {
                transform: scale(1);
                box-shadow: 0 0 0 0 rgba(255, 107, 53, 0);
            }
        }
        
        .animate-pulse-strong {
            animation: pulse-strong 2s infinite;
        }
    </style>
`;

// Agregar estilos al documento
document.head.insertAdjacentHTML('beforeend', animationStyles);