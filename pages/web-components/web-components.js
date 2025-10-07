// Web Components Implementation
// Demonstrating Custom Elements, Shadow DOM, and HTML Templates

// 1. Custom Card Component
class CustomCard extends HTMLElement {
    constructor() {
        super();

        // Create shadow root
        this.attachShadow({ mode: 'open' });

        // Create template
        const template = document.createElement('template');
        template.innerHTML = `
            <style>
                :host {
                    display: block;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                }
                
                :host([theme="dark"]) .card {
                    background: #333;
                    color: white;
                }
                
                .card {
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                    max-width: 400px;
                    margin: 1rem 0;
                }
                
                .card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
                }
                
                .card-image {
                    width: 100%;
                    height: 200px;
                    object-fit: cover;
                    display: block;
                }
                
                .card-content {
                    padding: 1.5rem;
                }
                
                .card-title {
                    margin: 0 0 0.5rem 0;
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: #2196F3;
                }
                
                :host([theme="dark"]) .card-title {
                    color: #64B5F6;
                }
                
                .card-description {
                    margin: 0 0 1.5rem 0;
                    color: #666;
                    line-height: 1.6;
                }
                
                :host([theme="dark"]) .card-description {
                    color: #ccc;
                }
                
                .card-button {
                    background: #2196F3;
                    color: white;
                    border: none;
                    padding: 0.75rem 1.5rem;
                    border-radius: 6px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background 0.2s ease;
                }
                
                .card-button:hover {
                    background: #1976D2;
                }
                
                .card-button:focus {
                    outline: 2px solid #2196F3;
                    outline-offset: 2px;
                }
            </style>
            
            <div class="card">
                <img class="card-image" alt="" />
                <div class="card-content">
                    <h3 class="card-title"></h3>
                    <p class="card-description"></p>
                    <button class="card-button"></button>
                </div>
            </div>
        `;

        // Clone template content
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        // Get elements
        this.cardImage = this.shadowRoot.querySelector('.card-image');
        this.cardTitle = this.shadowRoot.querySelector('.card-title');
        this.cardDescription = this.shadowRoot.querySelector('.card-description');
        this.cardButton = this.shadowRoot.querySelector('.card-button');

        // Bind event handlers
        this.handleButtonClick = this.handleButtonClick.bind(this);
    }

    static get observedAttributes() {
        return ['title', 'description', 'image', 'button-text', 'theme'];
    }

    connectedCallback() {
        this.render();
        this.cardButton.addEventListener('click', this.handleButtonClick);
    }

    disconnectedCallback() {
        this.cardButton.removeEventListener('click', this.handleButtonClick);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.render();
        }
    }

    render() {
        this.cardTitle.textContent = this.getAttribute('title') || 'Card Title';
        this.cardDescription.textContent = this.getAttribute('description') || 'Card description goes here.';
        this.cardButton.textContent = this.getAttribute('button-text') || 'Click Me';

        const imageUrl = this.getAttribute('image');
        if (imageUrl) {
            this.cardImage.src = imageUrl;
            this.cardImage.style.display = 'block';
        } else {
            this.cardImage.style.display = 'none';
        }
    }

    handleButtonClick() {
        // Dispatch custom event
        this.dispatchEvent(new CustomEvent('card-clicked', {
            detail: {
                title: this.getAttribute('title'),
                description: this.getAttribute('description')
            },
            bubbles: true
        }));
    }
}

// 2. Progress Ring Component
class ProgressRing extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        const template = document.createElement('template');
        template.innerHTML = `
            <style>
                :host {
                    display: inline-block;
                }
                
                .progress-ring {
                    transform: rotate(-90deg);
                }
                
                .progress-ring__circle {
                    transition: stroke-dashoffset 0.35s ease;
                    transform-origin: 50% 50%;
                }
                
                .progress-ring__background {
                    fill: none;
                    stroke: #e6e6e6;
                }
                
                .progress-ring__progress {
                    fill: none;
                    stroke-linecap: round;
                }
                
                .progress-text {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    font-weight: 600;
                    text-anchor: middle;
                    dominant-baseline: central;
                    fill: #333;
                }
            </style>
            
            <svg class="progress-ring" width="120" height="120">
                <circle class="progress-ring__background progress-ring__circle" 
                        cx="60" cy="60" r="54" stroke-width="8"/>
                <circle class="progress-ring__progress progress-ring__circle" 
                        cx="60" cy="60" r="54" stroke-width="8"/>
                <text class="progress-text" x="60" y="60"></text>
            </svg>
        `;

        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.svg = this.shadowRoot.querySelector('.progress-ring');
        this.circle = this.shadowRoot.querySelector('.progress-ring__progress');
        this.text = this.shadowRoot.querySelector('.progress-text');
        this.backgroundCircle = this.shadowRoot.querySelector('.progress-ring__background');

        this._value = 0;
        this._size = 120;
        this._stroke = 8;
        this._color = '#2196F3';
    }

    static get observedAttributes() {
        return ['value', 'size', 'stroke', 'color'];
    }

    connectedCallback() {
        this.updateProperties();
        this.render();
    }

    attributeChangedCallback() {
        this.updateProperties();
        this.render();
    }

    updateProperties() {
        this._value = parseInt(this.getAttribute('value')) || 0;
        this._size = parseInt(this.getAttribute('size')) || 120;
        this._stroke = parseInt(this.getAttribute('stroke')) || 8;
        this._color = this.getAttribute('color') || '#2196F3';
    }

    render() {
        const radius = (this._size / 2) - (this._stroke / 2);
        const circumference = radius * 2 * Math.PI;
        const offset = circumference - (this._value / 100) * circumference;

        // Update SVG dimensions
        this.svg.setAttribute('width', this._size);
        this.svg.setAttribute('height', this._size);

        // Update circles
        const center = this._size / 2;
        this.circle.setAttribute('cx', center);
        this.circle.setAttribute('cy', center);
        this.circle.setAttribute('r', radius);
        this.circle.setAttribute('stroke-width', this._stroke);
        this.circle.setAttribute('stroke', this._color);

        this.backgroundCircle.setAttribute('cx', center);
        this.backgroundCircle.setAttribute('cy', center);
        this.backgroundCircle.setAttribute('r', radius);
        this.backgroundCircle.setAttribute('stroke-width', this._stroke);

        // Update progress
        this.circle.style.strokeDasharray = circumference;
        this.circle.style.strokeDashoffset = offset;

        // Update text
        this.text.setAttribute('x', center);
        this.text.setAttribute('y', center);
        this.text.textContent = `${this._value}%`;
    }

    animateTo(value) {
        const start = this._value;
        const end = Math.max(0, Math.min(100, value));
        const duration = 1000;
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function
            const easeOutCubic = 1 - Math.pow(1 - progress, 3);

            this._value = Math.round(start + (end - start) * easeOutCubic);
            this.setAttribute('value', this._value);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }
}

// 3. Color Picker Component
class ColorPicker extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        const template = document.createElement('template');
        template.innerHTML = `
            <style>
                :host {
                    display: inline-block;
                    margin: 0.5rem;
                }
                
                .color-picker {
                    border: 2px solid #ddd;
                    border-radius: 8px;
                    padding: 1rem;
                    background: white;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    min-width: 200px;
                }
                
                .color-preview {
                    width: 100%;
                    height: 60px;
                    border-radius: 4px;
                    margin-bottom: 1rem;
                    border: 1px solid #ddd;
                    transition: background-color 0.2s ease;
                }
                
                .controls {
                    display: grid;
                    gap: 0.5rem;
                }
                
                .control-group {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                
                label {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    font-size: 0.875rem;
                    font-weight: 500;
                    min-width: 20px;
                }
                
                input[type="range"] {
                    flex: 1;
                    margin: 0;
                }
                
                .value-display {
                    font-family: monospace;
                    font-size: 0.75rem;
                    min-width: 30px;
                    text-align: right;
                }
                
                .hex-display {
                    font-family: monospace;
                    text-align: center;
                    font-weight: 600;
                    margin-top: 0.5rem;
                    padding: 0.25rem;
                    background: #f5f5f5;
                    border-radius: 4px;
                }
            </style>
            
            <div class="color-picker">
                <div class="color-preview"></div>
                <div class="controls">
                    <div class="control-group">
                        <label>R</label>
                        <input type="range" class="red-slider" min="0" max="255" value="33">
                        <span class="red-value value-display">33</span>
                    </div>
                    <div class="control-group">
                        <label>G</label>
                        <input type="range" class="green-slider" min="0" max="255" value="150">
                        <span class="green-value value-display">150</span>
                    </div>
                    <div class="control-group">
                        <label>B</label>
                        <input type="range" class="blue-slider" min="0" max="255" value="243">
                        <span class="blue-value value-display">243</span>
                    </div>
                </div>
                <div class="hex-display">#2196F3</div>
            </div>
        `;

        this.shadowRoot.appendChild(template.content.cloneNode(true));

        // Get references
        this.preview = this.shadowRoot.querySelector('.color-preview');
        this.redSlider = this.shadowRoot.querySelector('.red-slider');
        this.greenSlider = this.shadowRoot.querySelector('.green-slider');
        this.blueSlider = this.shadowRoot.querySelector('.blue-slider');
        this.redValue = this.shadowRoot.querySelector('.red-value');
        this.greenValue = this.shadowRoot.querySelector('.green-value');
        this.blueValue = this.shadowRoot.querySelector('.blue-value');
        this.hexDisplay = this.shadowRoot.querySelector('.hex-display');

        // Bind event handlers
        this.handleSliderChange = this.handleSliderChange.bind(this);
    }

    static get observedAttributes() {
        return ['initial-color'];
    }

    connectedCallback() {
        const initialColor = this.getAttribute('initial-color');
        if (initialColor) {
            this.setColor(initialColor);
        }

        this.redSlider.addEventListener('input', this.handleSliderChange);
        this.greenSlider.addEventListener('input', this.handleSliderChange);
        this.blueSlider.addEventListener('input', this.handleSliderChange);

        this.updateDisplay();
    }

    disconnectedCallback() {
        this.redSlider.removeEventListener('input', this.handleSliderChange);
        this.greenSlider.removeEventListener('input', this.handleSliderChange);
        this.blueSlider.removeEventListener('input', this.handleSliderChange);
    }

    setColor(hexColor) {
        const rgb = this.hexToRgb(hexColor);
        if (rgb) {
            this.redSlider.value = rgb.r;
            this.greenSlider.value = rgb.g;
            this.blueSlider.value = rgb.b;
        }
    }

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    rgbToHex(r, g, b) {
        return "#" + [r, g, b].map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? "0" + hex : hex;
        }).join("");
    }

    handleSliderChange() {
        this.updateDisplay();

        const color = this.getCurrentColor();
        this.dispatchEvent(new CustomEvent('color-changed', {
            detail: { color },
            bubbles: true
        }));
    }

    getCurrentColor() {
        const r = parseInt(this.redSlider.value);
        const g = parseInt(this.greenSlider.value);
        const b = parseInt(this.blueSlider.value);
        return this.rgbToHex(r, g, b);
    }

    updateDisplay() {
        const r = parseInt(this.redSlider.value);
        const g = parseInt(this.greenSlider.value);
        const b = parseInt(this.blueSlider.value);

        this.redValue.textContent = r;
        this.greenValue.textContent = g;
        this.blueValue.textContent = b;

        const color = `rgb(${r}, ${g}, ${b})`;
        const hexColor = this.rgbToHex(r, g, b);

        this.preview.style.backgroundColor = color;
        this.hexDisplay.textContent = hexColor.toUpperCase();
    }
}

// 4. Content Wrapper Component with Slots
class ContentWrapper extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        const template = document.createElement('template');
        template.innerHTML = `
            <style>
                :host {
                    display: block;
                    margin: 1rem 0;
                }
                
                .wrapper {
                    border: 2px solid #e0e0e0;
                    border-radius: 12px;
                    overflow: hidden;
                    background: white;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                }
                
                .header {
                    background: linear-gradient(135deg, #2196F3, #1976D2);
                    color: white;
                    padding: 1.5rem;
                }
                
                .header ::slotted(*) {
                    margin: 0;
                    color: white;
                }
                
                .content {
                    padding: 1.5rem;
                    line-height: 1.6;
                }
                
                .content ::slotted(p) {
                    margin: 0 0 1rem 0;
                }
                
                .content ::slotted(p:last-child) {
                    margin-bottom: 0;
                }
                
                .footer {
                    background: #f5f5f5;
                    padding: 1rem 1.5rem;
                    border-top: 1px solid #e0e0e0;
                }
                
                .footer ::slotted(button) {
                    background: #2196F3;
                    color: white;
                    border: none;
                    padding: 0.5rem 1rem;
                    border-radius: 4px;
                    margin-right: 0.5rem;
                    cursor: pointer;
                    transition: background 0.2s ease;
                }
                
                .footer ::slotted(button:hover) {
                    background: #1976D2;
                }
            </style>
            
            <div class="wrapper">
                <div class="header">
                    <slot name="header"></slot>
                </div>
                <div class="content">
                    <slot></slot>
                </div>
                <div class="footer">
                    <slot name="footer"></slot>
                </div>
            </div>
        `;

        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
}

// Register custom elements
customElements.define('custom-card', CustomCard);
customElements.define('progress-ring', ProgressRing);
customElements.define('color-picker', ColorPicker);
customElements.define('content-wrapper', ContentWrapper);

console.log('Web Components loaded and registered');