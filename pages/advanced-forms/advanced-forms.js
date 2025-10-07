// Advanced Forms JavaScript Implementation
// Demonstrating HTML5 form features, validation, and file handling

class AdvancedForms {
    constructor() {
        this.init();
    }

    init() {
        this.setupValidation();
        this.setupInteractiveControls();
        this.setupFileHandling();
        this.setupFormCollection();
    }

    // Real-time form validation
    setupValidation() {
        // Email validation
        const emailInput = document.getElementById('email');
        if (emailInput) {
            emailInput.addEventListener('input', this.validateEmail);
            emailInput.addEventListener('blur', this.validateEmail);
        }

        // URL validation
        const urlInput = document.getElementById('url');
        if (urlInput) {
            urlInput.addEventListener('input', this.validateURL);
            urlInput.addEventListener('blur', this.validateURL);
        }

        // Phone validation
        const telInput = document.getElementById('tel');
        if (telInput) {
            telInput.addEventListener('input', this.formatPhoneNumber);
        }

        // Password validation
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirmPassword');

        if (passwordInput) {
            passwordInput.addEventListener('input', this.validatePassword);
        }

        if (confirmPasswordInput) {
            confirmPasswordInput.addEventListener('input', () => {
                this.validatePasswordMatch(passwordInput.value, confirmPasswordInput.value);
            });
        }

        // Credit card validation
        const creditCardInput = document.getElementById('creditCard');
        if (creditCardInput) {
            creditCardInput.addEventListener('input', this.formatCreditCard);
        }
    }

    validateEmail(event) {
        const input = event.target;
        const errorMsg = input.parentElement.querySelector('.validation-message:not(.success)');
        const successMsg = input.parentElement.querySelector('.validation-message.success');

        if (input.validity.valid && input.value) {
            errorMsg.classList.remove('show');
            successMsg.classList.add('show');
        } else if (input.value) {
            errorMsg.classList.add('show');
            successMsg.classList.remove('show');
        } else {
            errorMsg.classList.remove('show');
            successMsg.classList.remove('show');
        }
    }

    validateURL(event) {
        const input = event.target;
        const errorMsg = input.parentElement.querySelector('.validation-message:not(.success)');
        const successMsg = input.parentElement.querySelector('.validation-message.success');

        if (input.validity.valid && input.value) {
            errorMsg.classList.remove('show');
            successMsg.classList.add('show');
        } else if (input.value) {
            errorMsg.classList.add('show');
            successMsg.classList.remove('show');
        } else {
            errorMsg.classList.remove('show');
            successMsg.classList.remove('show');
        }
    }

    formatPhoneNumber(event) {
        const input = event.target;
        let value = input.value.replace(/\D/g, '');

        if (value.length >= 6) {
            value = value.substring(0, 3) + '-' + value.substring(3, 6) + '-' + value.substring(6, 10);
        } else if (value.length >= 3) {
            value = value.substring(0, 3) + '-' + value.substring(3);
        }

        input.value = value;
    }

    validatePassword(event) {
        const input = event.target;
        const errorMsg = document.getElementById('passwordError');
        const password = input.value;

        const hasLength = password.length >= 8;
        const hasUpper = /[A-Z]/.test(password);
        const hasLower = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);

        if (password && (!hasLength || !hasUpper || !hasLower || !hasNumber)) {
            errorMsg.classList.add('show');
            let message = 'Password must have: ';
            const requirements = [];

            if (!hasLength) requirements.push('8+ characters');
            if (!hasUpper) requirements.push('uppercase letter');
            if (!hasLower) requirements.push('lowercase letter');
            if (!hasNumber) requirements.push('number');

            errorMsg.textContent = message + requirements.join(', ');
        } else {
            errorMsg.classList.remove('show');
        }
    }

    validatePasswordMatch(password, confirmPassword) {
        const errorMsg = document.getElementById('confirmError');

        if (confirmPassword && password !== confirmPassword) {
            errorMsg.classList.add('show');
        } else {
            errorMsg.classList.remove('show');
        }
    }

    formatCreditCard(event) {
        const input = event.target;
        let value = input.value.replace(/\s/g, '').replace(/\D/g, '');

        // Add spaces every 4 digits
        value = value.match(/.{1,4}/g)?.join(' ') || value;

        input.value = value;

        // Validate using Luhn algorithm
        const isValid = this.luhnCheck(value.replace(/\s/g, ''));
        const errorMsg = document.getElementById('cardError');

        if (value && !isValid) {
            errorMsg.classList.add('show');
        } else {
            errorMsg.classList.remove('show');
        }
    }

    // Luhn algorithm for credit card validation
    luhnCheck(cardNumber) {
        if (cardNumber.length < 13 || cardNumber.length > 19) return false;

        let sum = 0;
        let isEven = false;

        for (let i = cardNumber.length - 1; i >= 0; i--) {
            let digit = parseInt(cardNumber.charAt(i));

            if (isEven) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }

            sum += digit;
            isEven = !isEven;
        }

        return sum % 10 === 0;
    }

    // Interactive controls
    setupInteractiveControls() {
        // Range sliders
        const volumeSlider = document.getElementById('volume');
        const volumeValue = document.getElementById('volumeValue');

        if (volumeSlider && volumeValue) {
            volumeSlider.addEventListener('input', (e) => {
                volumeValue.textContent = e.target.value;
                this.updateRangeBackground(e.target);
            });
            this.updateRangeBackground(volumeSlider);
        }

        const brightnessSlider = document.getElementById('brightness');
        const brightnessValue = document.getElementById('brightnessValue');

        if (brightnessSlider && brightnessValue) {
            brightnessSlider.addEventListener('input', (e) => {
                brightnessValue.textContent = e.target.value;
                this.updateRangeBackground(e.target);
            });
            this.updateRangeBackground(brightnessSlider);
        }

        // Color picker
        const colorPicker = document.getElementById('color');
        const colorPreview = document.getElementById('colorPreview');

        if (colorPicker && colorPreview) {
            colorPicker.addEventListener('input', (e) => {
                colorPreview.style.backgroundColor = e.target.value;
                this.updateThemeColor(e.target.value);
            });
        }

        // Search with datalist
        const searchInput = document.getElementById('search');
        if (searchInput) {
            searchInput.addEventListener('input', this.handleSearchInput);
        }
    }

    updateRangeBackground(slider) {
        const percentage = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
        slider.style.background = `linear-gradient(to right, #2196F3 0%, #2196F3 ${percentage}%, #e0e0e0 ${percentage}%, #e0e0e0 100%)`;
    }

    updateThemeColor(color) {
        // Update CSS custom property
        document.documentElement.style.setProperty('--primary-color', color);

        // Dispatch custom event
        document.dispatchEvent(new CustomEvent('themeColorChanged', {
            detail: { color }
        }));
    }

    handleSearchInput(event) {
        const query = event.target.value.toLowerCase();
        console.log('Search query:', query);

        // In a real application, this would trigger a search API call
        // Here we just demonstrate the functionality
    }

    // File handling
    setupFileHandling() {
        // Already handled by inline event handlers in HTML
        // This is where you would set up more complex file handling
    }

    setupFormCollection() {
        // Global function for collecting all form data
        window.collectAllFormData = () => {
            const formData = {};

            // Collect data from all forms
            const forms = document.querySelectorAll('form');
            forms.forEach((form, index) => {
                const formObject = {};
                const formData_native = new FormData(form);

                for (let [key, value] of formData_native.entries()) {
                    if (formObject[key]) {
                        // Handle multiple values (like checkboxes)
                        if (Array.isArray(formObject[key])) {
                            formObject[key].push(value);
                        } else {
                            formObject[key] = [formObject[key], value];
                        }
                    } else {
                        formObject[key] = value;
                    }
                }

                formData[`form_${index + 1}`] = formObject;
            });

            // Display the collected data
            document.getElementById('formOutput').textContent = JSON.stringify(formData, null, 2);
        };
    }
}

// File handling functions (global for inline event handlers)
window.handleFileSelect = (event) => {
    const file = event.target.files[0];
    const fileInfo = document.getElementById('fileInfo');
    const preview = document.getElementById('imagePreview');

    if (file) {
        // Display file information
        fileInfo.innerHTML = `
            <strong>File:</strong> ${file.name}<br>
            <strong>Size:</strong> ${formatFileSize(file.size)}<br>
            <strong>Type:</strong> ${file.type}<br>
            <strong>Last Modified:</strong> ${new Date(file.lastModified).toLocaleDateString()}
        `;

        // Preview image if it's an image file
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = preview;
                    const ctx = canvas.getContext('2d');

                    // Calculate dimensions to fit in 200x200
                    const maxSize = 200;
                    let { width, height } = img;

                    if (width > height) {
                        if (width > maxSize) {
                            height *= maxSize / width;
                            width = maxSize;
                        }
                    } else {
                        if (height > maxSize) {
                            width *= maxSize / height;
                            height = maxSize;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;

                    ctx.drawImage(img, 0, 0, width, height);
                    canvas.style.display = 'block';
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        } else {
            preview.style.display = 'none';
        }
    }
};

window.handleMultipleFiles = (event) => {
    const files = Array.from(event.target.files);
    const filesList = document.getElementById('filesList');

    if (files.length > 0) {
        const listHTML = files.map(file => `
            <div style="padding: 0.5rem; border: 1px solid #e0e0e0; border-radius: 4px; margin-bottom: 0.5rem;">
                <strong>${file.name}</strong> - ${formatFileSize(file.size)} - ${file.type}
            </div>
        `).join('');

        filesList.innerHTML = `<strong>Selected Files (${files.length}):</strong><br><br>${listHTML}`;
    }
};

window.simulateUpload = () => {
    const progressBar = document.getElementById('uploadProgress');
    let progress = 0;

    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
        }

        progressBar.style.width = progress + '%';

        if (progress === 100) {
            setTimeout(() => {
                progressBar.style.width = '0%';
            }, 2000);
        }
    }, 200);
};

// Utility functions
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AdvancedForms();
    console.log('Advanced Forms initialized');
});