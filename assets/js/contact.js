// Sistema de contacto y formularios

class ContactManager {
    constructor() {
        this.form = null;
        this.whatsappButtons = null;
        this.init();
    }

    init() {
        this.setupForm();
        this.setupWhatsAppButtons();
        this.setupContactInfo();
        this.setupEmergencyButton();
    }

    // Configurar formulario de contacto
    setupForm() {
        this.form = document.getElementById('contact-form');
        if (!this.form) return;

        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit();
        });

        // Validación en tiempo real
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    // Manejar envío del formulario
    handleFormSubmit() {
        const formData = new FormData(this.form);
        const data = this.validateFormData(formData);

        if (!data.isValid) {
            this.showFormErrors(data.errors);
            return;
        }

        // Mostrar estado de carga
        this.showLoadingState();

        // Simular envío del formulario
        setTimeout(() => {
            this.sendFormData(data);
        }, 1500);
    }

    // Validar datos del formulario
    validateFormData(formData) {
        const data = {
            name: formData.get('name')?.trim(),
            email: formData.get('email')?.trim(),
            phone: formData.get('phone')?.trim(),
            message: formData.get('message')?.trim(),
            errors: {},
            isValid: true
        };

        // Validar nombre
        if (!data.name || data.name.length < 2) {
            data.errors.name = 'El nombre debe tener al menos 2 caracteres';
            data.isValid = false;
        }

        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!data.email || !emailRegex.test(data.email)) {
            data.errors.email = 'Por favor, ingresa un email válido';
            data.isValid = false;
        }

        // Validar teléfono (opcional pero si se ingresa debe ser válido)
        if (data.phone && !this.isValidPhone(data.phone)) {
            data.errors.phone = 'Por favor, ingresa un número de teléfono válido';
            data.isValid = false;
        }

        // Validar mensaje
        if (!data.message || data.message.length < 10) {
            data.errors.message = 'El mensaje debe tener al menos 10 caracteres';
            data.isValid = false;
        }

        return data;
    }

    // Validar número de teléfono chileno
    isValidPhone(phone) {
        // Acepta formatos: +56912345678, 912345678, 22123456
        const phoneRegex = /^(\+569|9|2)\d{8}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    }

    // Validar campo individual
    validateField(field) {
        const fieldName = field.name;
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        switch (fieldName) {
            case 'name':
                if (!value || value.length < 2) {
                    errorMessage = 'El nombre debe tener al menos 2 caracteres';
                    isValid = false;
                }
                break;
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!value || !emailRegex.test(value)) {
                    errorMessage = 'Por favor, ingresa un email válido';
                    isValid = false;
                }
                break;
            case 'phone':
                if (value && !this.isValidPhone(value)) {
                    errorMessage = 'Por favor, ingresa un número de teléfono válido';
                    isValid = false;
                }
                break;
            case 'message':
                if (!value || value.length < 10) {
                    errorMessage = 'El mensaje debe tener al menos 10 caracteres';
                    isValid = false;
                }
                break;
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        } else {
            this.clearFieldError(field);
        }

        return isValid;
    }

    // Mostrar error en campo
    showFieldError(field, message) {
        this.clearFieldError(field);
        
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        
        field.parentNode.appendChild(errorElement);
        field.classList.add('error');
    }

    // Limpiar error del campo
    clearFieldError(field) {
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        field.classList.remove('error');
    }

    // Mostrar errores del formulario
    showFormErrors(errors) {
        Object.keys(errors).forEach(fieldName => {
            const field = this.form.querySelector(`[name="${fieldName}"]`);
            if (field) {
                this.showFieldError(field, errors[fieldName]);
            }
        });
    }

    // Mostrar estado de carga
    showLoadingState() {
        const submitButton = this.form.querySelector('button[type="submit"]');
        const originalHTML = submitButton.innerHTML;
        
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitButton.disabled = true;
        submitButton.setAttribute('data-original-html', originalHTML);
    }

    // Restablecer botón de envío
    resetSubmitButton() {
        const submitButton = this.form.querySelector('button[type="submit"]');
        const originalHTML = submitButton.getAttribute('data-original-html');
        
        if (originalHTML) {
            submitButton.innerHTML = originalHTML;
            submitButton.disabled = false;
            submitButton.removeAttribute('data-original-html');
        }
    }

    // Enviar datos del formulario
    sendFormData(data) {
        // En este caso, enviaremos por WhatsApp
        const whatsappMessage = this.createWhatsAppMessage(data);
        const whatsappUrl = `https://wa.me/56982283541?text=${encodeURIComponent(whatsappMessage)}`;
        
        // Abrir WhatsApp
        window.open(whatsappUrl, '_blank');
        
        // Restablecer formulario
        this.form.reset();
        this.resetSubmitButton();
        
        // Mostrar mensaje de éxito
        this.showSuccessMessage('¡Mensaje enviado! Nos pondremos en contacto contigo pronto.');
    }

    // Crear mensaje para WhatsApp
    createWhatsAppMessage(data) {
        let message = `¡Hola! Tengo una consulta:\n\n`;
        message += `*Nombre:* ${data.name}\n`;
        message += `*Email:* ${data.email}\n`;
        
        if (data.phone) {
            message += `*Teléfono:* ${data.phone}\n`;
        }
        
        message += `*Mensaje:* ${data.message}\n\n`;
        message += `Por favor contáctenme lo antes posible. ¡Gracias!`;
        
        return message;
    }

    // Configurar botones de WhatsApp
    setupWhatsAppButtons() {
        this.whatsappButtons = document.querySelectorAll('.btn-whatsapp');
        
        this.whatsappButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleWhatsAppClick(button);
            });
        });
    }

    // Manejar clic en botón de WhatsApp
    handleWhatsAppClick(button) {
        const service = button.closest('.service-card');
        let message = 'Hola, estoy interesado en sus servicios';
        
        if (service) {
            const serviceTitle = service.querySelector('.service-title').textContent;
            message = `Hola, estoy interesado en el servicio de ${serviceTitle}. ¿Podrían darme más información?`;
        }
        
        const whatsappUrl = `https://wa.me/56982283541?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    }

    // Configurar información de contacto
    setupContactInfo() {
        // Agregar funcionalidad de copiar al portapapeles
        const contactItems = document.querySelectorAll('.contact-item');
        
        contactItems.forEach(item => {
            const clickableElements = item.querySelectorAll('p');
            clickableElements.forEach(element => {
                element.style.cursor = 'pointer';
                element.title = 'Haz clic para copiar';
                
                element.addEventListener('click', () => {
                    this.copyToClipboard(element.textContent);
                });
            });
        });
    }

    // Configurar botón de emergencia
    setupEmergencyButton() {
        const emergencyButton = document.querySelector('.btn-primary[href*="emergencia"]');
        
        if (emergencyButton) {
            emergencyButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleEmergencyClick();
            });
        }
    }

    // Manejar clic de emergencia
    handleEmergencyClick() {
        const message = '🚨 EMERGENCIA: Tengo un problema urgente con gas/calefacción. Por favor, necesito atención inmediata.';
        const whatsappUrl = `https://wa.me/56982283541?text=${encodeURIComponent(message)}`;
        
        if (confirm('¿Estás seguro de que es una emergencia? Se enviará un mensaje urgente.')) {
            window.open(whatsappUrl, '_blank');
        }
    }

    // Copiar al portapapeles
    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            this.showSuccessMessage(`Copiado: ${text}`);
        }).catch(() => {
            // Fallback para navegadores antiguos
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showSuccessMessage(`Copiado: ${text}`);
        });
    }

    // Mostrar mensaje de éxito
    showSuccessMessage(message) {
        const notification = document.createElement('div');
        notification.className = 'contact-notification success';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-check-circle"></i>
                <span>${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        document.body.appendChild(notification);

        // Auto-eliminar después de 3 segundos
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 3000);
    }

    // Configurar botón flotante de WhatsApp
    setupFloatingWhatsApp() {
        const floatingBtn = document.querySelector('.whatsapp-float');
        
        if (floatingBtn) {
            // Mostrar/ocultar según scroll
            let lastScrollTop = 0;
            
            window.addEventListener('scroll', () => {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                
                if (scrollTop > lastScrollTop && scrollTop > 200) {
                    floatingBtn.style.transform = 'scale(0.8)';
                    floatingBtn.style.opacity = '0.7';
                } else {
                    floatingBtn.style.transform = 'scale(1)';
                    floatingBtn.style.opacity = '1';
                }
                
                lastScrollTop = scrollTop;
            });
            
            // Agregar tooltip
            floatingBtn.title = '¿Tienes dudas? Escríbenos por WhatsApp';
        }
    }
}

// Inicializar el sistema de contacto
document.addEventListener('DOMContentLoaded', function() {
    window.contactManager = new ContactManager();
});

// Agregar estilos CSS para el sistema de contacto
const contactStyles = `
    <style>
        /* Estilos para errores de campo */
        .field-error {
            color: #dc3545;
            font-size: 0.875rem;
            margin-top: 0.25rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .field-error::before {
            content: '\f071';
            font-family: 'Font Awesome 6 Free';
            font-weight: 900;
        }
        
        input.error, textarea.error {
            border-color: #dc3545 !important;
            box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25) !important;
        }
        
        /* Notificaciones de contacto */
        .contact-notification {
            position: fixed;
            top: 100px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            max-width: 300px;
            animation: slideInRight 0.3s ease-out;
        }
        
        .contact-notification.success {
            background: #28a745;
        }
        
        .contact-notification.error {
            background: #dc3545;
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            margin-left: auto;
            padding: 0.25rem;
            border-radius: 4px;
            transition: background-color 0.2s;
        }
        
        .notification-close:hover {
            background: rgba(255,255,255,0.2);
        }
        
        /* Animación de entrada */
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
        
        /* Efecto hover en elementos copiables */
        .contact-item p:hover {
            background: rgba(255, 107, 53, 0.1);
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            transition: background-color 0.2s;
        }
        
        /* Estado de carga del botón */
        button[disabled] {
            opacity: 0.7;
            cursor: not-allowed;
        }
        
        /* Mejoras visuales para el formulario */
        .form-group {
            position: relative;
        }
        
        .form-group label {
            position: absolute;
            top: -0.5rem;
            left: 0.75rem;
            background: white;
            padding: 0 0.25rem;
            font-size: 0.875rem;
            color: #666;
            transition: all 0.2s;
        }
        
        .form-group input:focus + label,
        .form-group textarea:focus + label {
            color: var(--primary-color);
            transform: translateY(-0.25rem);
        }
    </style>
`;

// Agregar estilos al documento
document.head.insertAdjacentHTML('beforeend', contactStyles);