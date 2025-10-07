// Main JavaScript for Advanced HTML Features Repository

class AdvancedHTMLApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupHeroCanvas();
        this.setupIntersectionObserver();
        this.setupCopyButtons();
        this.setupPerformanceMonitoring();
    }

    // Navigation functionality
    setupNavigation() {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');

        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
                navToggle.setAttribute('aria-expanded', !isExpanded);

                // Animate hamburger menu
                this.animateHamburger(navToggle, !isExpanded);
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                    navToggle.setAttribute('aria-expanded', 'false');
                    this.animateHamburger(navToggle, false);
                }
            });

            // Handle escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') {
                    navToggle.setAttribute('aria-expanded', 'false');
                    this.animateHamburger(navToggle, false);
                    navToggle.focus();
                }
            });
        }

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    animateHamburger(toggle, isOpen) {
        const hamburger = toggle.querySelector('.hamburger');
        if (hamburger) {
            if (isOpen) {
                hamburger.style.background = 'transparent';
                hamburger.style.transform = 'rotate(45deg)';
            } else {
                hamburger.style.background = '';
                hamburger.style.transform = '';
            }
        }
    }

    // Hero canvas animation
    setupHeroCanvas() {
        const canvas = document.getElementById('hero-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const particles = [];
        const particleCount = 50;

        // Set up canvas
        const resizeCanvas = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Particle class
        class Particle {
            constructor() {
                this.reset();
                this.y = Math.random() * canvas.height;
            }

            reset() {
                this.x = -20;
                this.y = Math.random() * canvas.height;
                this.speed = 0.5 + Math.random() * 2;
                this.size = 2 + Math.random() * 3;
                this.opacity = 0.3 + Math.random() * 0.7;
                this.color = `hsl(${200 + Math.random() * 60}, 70%, 60%)`;
            }

            update() {
                this.x += this.speed;
                this.y += Math.sin(this.x * 0.01) * 0.5;

                if (this.x > canvas.width + 20) {
                    this.reset();
                }
            }

            draw() {
                ctx.save();
                ctx.globalAlpha = this.opacity;
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }

        // Create particles
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        // Animation loop
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw connections
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.lineWidth = 1;

            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 100) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            // Update and draw particles
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });

            requestAnimationFrame(animate);
        };

        animate();
    }

    // Intersection Observer for animations
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                }
            });
        }, observerOptions);

        // Observe elements
        document.querySelectorAll('.feature-card, .demo-card').forEach(el => {
            observer.observe(el);
        });
    }

    // Copy to clipboard functionality
    setupCopyButtons() {
        document.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const codeBlock = btn.parentElement.querySelector('pre code');
                if (!codeBlock) return;

                try {
                    await navigator.clipboard.writeText(codeBlock.textContent);

                    // Visual feedback
                    const originalText = btn.innerHTML;
                    btn.innerHTML = `
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                        </svg>
                    `;

                    setTimeout(() => {
                        btn.innerHTML = originalText;
                    }, 2000);
                } catch (err) {
                    console.error('Failed to copy: ', err);
                }
            });
        });
    }

    // Performance monitoring
    setupPerformanceMonitoring() {
        // Monitor Core Web Vitals
        if ('web-vital' in window) {
            import('https://unpkg.com/web-vitals@3/dist/web-vitals.js').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
                getCLS(console.log);
                getFID(console.log);
                getFCP(console.log);
                getLCP(console.log);
                getTTFB(console.log);
            });
        }

        // Log performance metrics
        window.addEventListener('load', () => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Performance Metrics:', {
                domContentLoaded: perfData.domContentLoadedEventEnd - perfData.navigationStart,
                loadComplete: perfData.loadEventEnd - perfData.navigationStart,
                firstPaint: performance.getEntriesByType('paint')[0]?.startTime,
                firstContentfulPaint: performance.getEntriesByType('paint')[1]?.startTime
            });
        });
    }
}

// Utility functions
const utils = {
    // Debounce function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function
    throttle(func, limit) {
        let inThrottle;
        return function () {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    },

    // Check if element is in viewport
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    // Generate unique ID
    generateId() {
        return 'id-' + Math.random().toString(36).substr(2, 9);
    },

    // Format bytes
    formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }
};

// Feature detection
const features = {


    // Check if browser supports Web Workers
    supportsWebWorkers() {
        return typeof Worker !== 'undefined';
    },

    // Check if browser supports Service Workers
    supportsServiceWorkers() {
        return 'serviceWorker' in navigator;
    },

    // Check if browser supports WebAssembly
    supportsWebAssembly() {
        return typeof WebAssembly === 'object';
    },

    // Check if browser supports IndexedDB
    supportsIndexedDB() {
        return 'indexedDB' in window;
    },

    // Check if device has touch support
    supportsTouch() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }
};

// Error handling
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
});

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new AdvancedHTMLApp();

    // Make utils and features available globally for demo pages
    window.htmlFeatures = { utils, features, app };

    // Log browser capabilities
    console.log('Browser Capabilities:', {
        webWorkers: features.supportsWebWorkers(),
        serviceWorkers: features.supportsServiceWorkers(),
        webAssembly: features.supportsWebAssembly(),
        indexedDB: features.supportsIndexedDB(),
        touch: features.supportsTouch()
    });
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AdvancedHTMLApp, utils, features };
}