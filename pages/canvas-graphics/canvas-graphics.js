// Canvas Graphics Implementation
// Comprehensive demonstrations of Canvas API features

class CanvasGraphics {
    constructor() {
        this.initializeCanvases();
        this.setupDrawing();
        this.setupParticleSystem();
        this.setupGame();
        this.setupChart();
        this.initializeImageProcessing();
    }

    initializeCanvases() {
        // Get all canvas elements and their contexts
        this.canvases = {
            drawing: document.getElementById('drawingCanvas'),
            particle: document.getElementById('particleCanvas'),
            fractal: document.getElementById('fractalCanvas'),
            image: document.getElementById('imageCanvas'),
            game: document.getElementById('gameCanvas'),
            chart: document.getElementById('chartCanvas')
        };

        this.contexts = {};
        Object.keys(this.canvases).forEach(key => {
            if (this.canvases[key]) {
                this.contexts[key] = this.canvases[key].getContext('2d');
            }
        });
    }

    // Drawing Canvas Implementation
    setupDrawing() {
        const canvas = this.canvases.drawing;
        const ctx = this.contexts.drawing;
        if (!canvas || !ctx) return;

        let isDrawing = false;
        let lastX = 0;
        let lastY = 0;

        const getMousePos = (e) => {
            const rect = canvas.getBoundingClientRect();
            return {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
        };

        const startDrawing = (e) => {
            isDrawing = true;
            const pos = getMousePos(e);
            lastX = pos.x;
            lastY = pos.y;
        };

        const draw = (e) => {
            if (!isDrawing) return;

            const pos = getMousePos(e);
            const brushColor = document.getElementById('brushColor').value;
            const brushSize = document.getElementById('brushSize').value;

            ctx.globalCompositeOperation = 'source-over';
            ctx.strokeStyle = brushColor;
            ctx.lineWidth = brushSize;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(pos.x, pos.y);
            ctx.stroke();

            lastX = pos.x;
            lastY = pos.y;
        };

        const stopDrawing = () => {
            isDrawing = false;
        };

        // Mouse events
        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseout', stopDrawing);

        // Touch events for mobile
        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousedown', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            canvas.dispatchEvent(mouseEvent);
        });

        canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousemove', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            canvas.dispatchEvent(mouseEvent);
        });

        canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            const mouseEvent = new MouseEvent('mouseup', {});
            canvas.dispatchEvent(mouseEvent);
        });
    }

    // Particle System Implementation
    setupParticleSystem() {
        const canvas = this.canvases.particle;
        const ctx = this.contexts.particle;
        if (!canvas || !ctx) return;

        const particles = [];
        let animationId;
        let isAnimating = false;
        let lastTime = 0;
        let fps = 0;

        class Particle {
            constructor(x, y, vx = 0, vy = 0) {
                this.x = x || Math.random() * canvas.width;
                this.y = y || Math.random() * canvas.height;
                this.vx = vx || (Math.random() - 0.5) * 4;
                this.vy = vy || (Math.random() - 0.5) * 4;
                this.life = 1.0;
                this.decay = Math.random() * 0.02 + 0.005;
                this.size = Math.random() * 3 + 1;
                this.color = {
                    r: Math.floor(Math.random() * 255),
                    g: Math.floor(Math.random() * 255),
                    b: Math.floor(Math.random() * 255)
                };
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.vy += 0.1; // gravity
                this.life -= this.decay;

                // Bounce off walls
                if (this.x <= 0 || this.x >= canvas.width) this.vx *= -0.8;
                if (this.y >= canvas.height) {
                    this.vy *= -0.8;
                    this.y = canvas.height;
                }
            }

            draw() {
                ctx.save();
                ctx.globalAlpha = this.life;
                ctx.fillStyle = `rgb(${this.color.r}, ${this.color.g}, ${this.color.b})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }

            isDead() {
                return this.life <= 0;
            }
        }

        const initParticles = () => {
            particles.length = 0;
            const count = document.getElementById('particleCount').value;
            for (let i = 0; i < count; i++) {
                particles.push(new Particle());
            }
        };

        const animate = (currentTime) => {
            if (!isAnimating) return;

            // Calculate FPS
            if (currentTime - lastTime >= 1000) {
                fps = Math.round(1000 / (currentTime - lastTime) * particles.length);
                document.getElementById('fps').textContent = fps;
                lastTime = currentTime;
            }

            // Clear canvas
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Update and draw particles
            for (let i = particles.length - 1; i >= 0; i--) {
                const particle = particles[i];
                particle.update();
                particle.draw();

                if (particle.isDead()) {
                    particles.splice(i, 1);
                    particles.push(new Particle());
                }
            }

            document.getElementById('particleCountDisplay').textContent = particles.length;
            animationId = requestAnimationFrame(animate);
        };

        // Initialize particles
        initParticles();

        // Event listeners
        document.getElementById('particleCount').addEventListener('input', initParticles);

        // Global functions for controls
        window.toggleParticles = () => {
            isAnimating = !isAnimating;
            if (isAnimating) {
                animate(performance.now());
            } else {
                cancelAnimationFrame(animationId);
            }
        };

        window.addBurst = () => {
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            for (let i = 0; i < 20; i++) {
                const angle = (i / 20) * Math.PI * 2;
                const speed = 5;
                particles.push(new Particle(
                    centerX,
                    centerY,
                    Math.cos(angle) * speed,
                    Math.sin(angle) * speed
                ));
            }
        };

        // Start animation
        window.toggleParticles();
    }

    // Game Implementation (Simple Pong-like game)
    setupGame() {
        const canvas = this.canvases.game;
        const ctx = this.contexts.game;
        if (!canvas || !ctx) return;

        let gameState = {
            running: false,
            score: 0,
            lives: 3,
            player: { x: canvas.width / 2 - 25, y: canvas.height - 30, width: 50, height: 10, speed: 5 },
            ball: { x: canvas.width / 2, y: canvas.height / 2, radius: 8, vx: 3, vy: -3 },
            blocks: []
        };

        const keys = {};

        // Initialize blocks
        const initBlocks = () => {
            gameState.blocks = [];
            const rows = 4;
            const cols = 8;
            const blockWidth = (canvas.width - 20) / cols;
            const blockHeight = 20;

            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    gameState.blocks.push({
                        x: col * blockWidth + 10,
                        y: row * blockHeight + 40,
                        width: blockWidth - 2,
                        height: blockHeight - 2,
                        color: `hsl(${row * 60}, 70%, 50%)`
                    });
                }
            }
        };

        const updateGame = () => {
            if (!gameState.running) return;

            // Move player
            if ((keys['ArrowLeft'] || keys['a'] || keys['A']) && gameState.player.x > 0) {
                gameState.player.x -= gameState.player.speed;
            }
            if ((keys['ArrowRight'] || keys['d'] || keys['D']) && gameState.player.x < canvas.width - gameState.player.width) {
                gameState.player.x += gameState.player.speed;
            }

            // Move ball
            gameState.ball.x += gameState.ball.vx;
            gameState.ball.y += gameState.ball.vy;

            // Ball collision with walls
            if (gameState.ball.x <= gameState.ball.radius || gameState.ball.x >= canvas.width - gameState.ball.radius) {
                gameState.ball.vx *= -1;
            }
            if (gameState.ball.y <= gameState.ball.radius) {
                gameState.ball.vy *= -1;
            }

            // Ball collision with player
            if (gameState.ball.y + gameState.ball.radius >= gameState.player.y &&
                gameState.ball.x >= gameState.player.x &&
                gameState.ball.x <= gameState.player.x + gameState.player.width) {
                gameState.ball.vy = -Math.abs(gameState.ball.vy);
                // Add angle based on hit position
                const hitPos = (gameState.ball.x - gameState.player.x) / gameState.player.width;
                gameState.ball.vx = (hitPos - 0.5) * 6;
            }

            // Ball collision with blocks
            gameState.blocks = gameState.blocks.filter(block => {
                if (gameState.ball.x >= block.x && gameState.ball.x <= block.x + block.width &&
                    gameState.ball.y >= block.y && gameState.ball.y <= block.y + block.height) {
                    gameState.ball.vy *= -1;
                    gameState.score += 10;
                    return false;
                }
                return true;
            });

            // Ball falls off screen
            if (gameState.ball.y > canvas.height) {
                gameState.lives--;
                if (gameState.lives <= 0) {
                    gameState.running = false;
                } else {
                    // Reset ball
                    gameState.ball.x = canvas.width / 2;
                    gameState.ball.y = canvas.height / 2;
                    gameState.ball.vx = 3;
                    gameState.ball.vy = -3;
                }
            }

            // Check win condition
            if (gameState.blocks.length === 0) {
                gameState.running = false;
                alert('You Win!');
            }

            // Update UI
            document.getElementById('gameScore').textContent = gameState.score;
            document.getElementById('gameLives').textContent = gameState.lives;
        };

        const drawGame = () => {
            // Clear canvas
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw player
            ctx.fillStyle = '#2196F3';
            ctx.fillRect(gameState.player.x, gameState.player.y, gameState.player.width, gameState.player.height);

            // Draw ball
            ctx.fillStyle = '#FFF';
            ctx.beginPath();
            ctx.arc(gameState.ball.x, gameState.ball.y, gameState.ball.radius, 0, Math.PI * 2);
            ctx.fill();

            // Draw blocks
            gameState.blocks.forEach(block => {
                ctx.fillStyle = block.color;
                ctx.fillRect(block.x, block.y, block.width, block.height);
            });

            if (!gameState.running) {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = '#FFF';
                ctx.font = '24px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('Press Start to Play', canvas.width / 2, canvas.height / 2);
            }
        };

        const gameLoop = () => {
            updateGame();
            drawGame();
            requestAnimationFrame(gameLoop);
        };

        // Event listeners
        document.addEventListener('keydown', (e) => {
            keys[e.key] = true;
        });

        document.addEventListener('keyup', (e) => {
            keys[e.key] = false;
        });

        // Global game functions
        window.startGame = () => {
            gameState.running = true;
            gameState.score = 0;
            gameState.lives = 3;
            initBlocks();
        };

        window.pauseGame = () => {
            gameState.running = false;
        };

        window.resetGame = () => {
            gameState.running = false;
            gameState.score = 0;
            gameState.lives = 3;
            gameState.ball.x = canvas.width / 2;
            gameState.ball.y = canvas.height / 2;
            gameState.ball.vx = 3;
            gameState.ball.vy = -3;
            initBlocks();
        };

        // Initialize game
        initBlocks();
        gameLoop();
    }

    // Chart/Data Visualization Implementation
    setupChart() {
        const canvas = this.canvases.chart;
        const ctx = this.contexts.chart;
        if (!canvas || !ctx) return;

        const sampleData = [
            { label: 'HTML', value: 85, color: '#E34F26' },
            { label: 'CSS', value: 70, color: '#1572B6' },
            { label: 'JavaScript', value: 90, color: '#F7DF1E' },
            { label: 'Canvas 2D', value: 80, color: '#2196F3' },
            { label: 'SVG Graphics', value: 65, color: '#FF5722' }
        ];

        let animationProgress = 0;
        let animationId;

        const drawBarChart = (progress = 1) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const barWidth = (canvas.width - 100) / sampleData.length;
            const maxValue = Math.max(...sampleData.map(d => d.value));

            sampleData.forEach((data, index) => {
                const barHeight = (data.value / maxValue) * (canvas.height - 80) * progress;
                const x = 50 + index * barWidth;
                const y = canvas.height - 30 - barHeight;

                // Draw bar
                ctx.fillStyle = data.color;
                ctx.fillRect(x, y, barWidth - 10, barHeight);

                // Draw label
                ctx.fillStyle = '#333';
                ctx.font = '12px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(data.label, x + (barWidth - 10) / 2, canvas.height - 10);

                // Draw value
                if (progress > 0.8) {
                    ctx.fillText(data.value, x + (barWidth - 10) / 2, y - 5);
                }
            });
        };

        const drawLineChart = (progress = 1) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const points = sampleData.map((data, index) => ({
                x: 50 + (index / (sampleData.length - 1)) * (canvas.width - 100),
                y: canvas.height - 30 - (data.value / 100) * (canvas.height - 80)
            }));

            // Draw axes
            ctx.strokeStyle = '#ccc';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(50, 20);
            ctx.lineTo(50, canvas.height - 30);
            ctx.lineTo(canvas.width - 50, canvas.height - 30);
            ctx.stroke();

            // Draw line
            ctx.strokeStyle = '#2196F3';
            ctx.lineWidth = 3;
            ctx.beginPath();

            const endIndex = Math.floor(points.length * progress);
            points.slice(0, endIndex + 1).forEach((point, index) => {
                if (index === 0) {
                    ctx.moveTo(point.x, point.y);
                } else {
                    ctx.lineTo(point.x, point.y);
                }
            });
            ctx.stroke();

            // Draw points
            ctx.fillStyle = '#1976D2';
            points.slice(0, endIndex + 1).forEach(point => {
                ctx.beginPath();
                ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
                ctx.fill();
            });

            // Draw labels
            ctx.fillStyle = '#333';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            sampleData.forEach((data, index) => {
                if (index < endIndex + 1) {
                    ctx.fillText(data.label, points[index].x, canvas.height - 10);
                }
            });
        };

        const drawPieChart = (progress = 1) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const radius = Math.min(canvas.width, canvas.height) / 3;

            const total = sampleData.reduce((sum, data) => sum + data.value, 0);
            let currentAngle = -Math.PI / 2;

            sampleData.forEach(data => {
                const sliceAngle = (data.value / total) * Math.PI * 2 * progress;

                // Draw slice
                ctx.fillStyle = data.color;
                ctx.beginPath();
                ctx.moveTo(centerX, centerY);
                ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
                ctx.closePath();
                ctx.fill();

                // Draw label
                if (progress > 0.8) {
                    const labelAngle = currentAngle + sliceAngle / 2;
                    const labelX = centerX + Math.cos(labelAngle) * (radius + 20);
                    const labelY = centerY + Math.sin(labelAngle) * (radius + 20);

                    ctx.fillStyle = '#333';
                    ctx.font = '12px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText(data.label, labelX, labelY);
                }

                currentAngle += sliceAngle;
            });
        };

        let currentChartType = 'bar';

        window.generateChart = (type) => {
            currentChartType = type;
            animationProgress = 0;

            const animate = () => {
                animationProgress += 0.02;

                switch (type) {
                    case 'bar':
                        drawBarChart(animationProgress);
                        break;
                    case 'line':
                        drawLineChart(animationProgress);
                        break;
                    case 'pie':
                        drawPieChart(animationProgress);
                        break;
                }

                if (animationProgress < 1) {
                    requestAnimationFrame(animate);
                }
            };

            animate();
        };

        window.animateChart = () => {
            window.generateChart(currentChartType);
        };

        // Initialize with bar chart
        window.generateChart('bar');
    }

    // Image Processing Implementation
    initializeImageProcessing() {
        const canvas = this.canvases.image;
        const ctx = this.contexts.image;
        if (!canvas || !ctx) return;

        let originalImageData = null;
        let currentImageData = null;

        window.loadImage = (event) => {
            const file = event.target.files[0];
            if (!file) return;

            const img = new Image();
            img.onload = () => {
                // Calculate dimensions to fit canvas
                const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
                const width = img.width * scale;
                const height = img.height * scale;
                const x = (canvas.width - width) / 2;
                const y = (canvas.height - height) / 2;

                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, x, y, width, height);

                originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                currentImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            };

            const reader = new FileReader();
            reader.onload = (e) => {
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        };

        window.applyFilter = (filterType) => {
            if (!originalImageData) return;

            const imageData = new ImageData(
                new Uint8ClampedArray(originalImageData.data),
                originalImageData.width,
                originalImageData.height
            );
            const data = imageData.data;

            switch (filterType) {
                case 'grayscale':
                    for (let i = 0; i < data.length; i += 4) {
                        const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
                        data[i] = gray;
                        data[i + 1] = gray;
                        data[i + 2] = gray;
                    }
                    break;

                case 'sepia':
                    for (let i = 0; i < data.length; i += 4) {
                        const r = data[i];
                        const g = data[i + 1];
                        const b = data[i + 2];

                        data[i] = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189);
                        data[i + 1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168);
                        data[i + 2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131);
                    }
                    break;

                case 'invert':
                    for (let i = 0; i < data.length; i += 4) {
                        data[i] = 255 - data[i];
                        data[i + 1] = 255 - data[i + 1];
                        data[i + 2] = 255 - data[i + 2];
                    }
                    break;

                case 'blur':
                    // Simple box blur
                    const width = imageData.width;
                    const height = imageData.height;
                    const kernel = [
                        [1, 2, 1],
                        [2, 4, 2],
                        [1, 2, 1]
                    ];
                    const kernelSum = 16;

                    const newData = new Uint8ClampedArray(data);

                    for (let y = 1; y < height - 1; y++) {
                        for (let x = 1; x < width - 1; x++) {
                            for (let c = 0; c < 3; c++) {
                                let sum = 0;
                                for (let ky = -1; ky <= 1; ky++) {
                                    for (let kx = -1; kx <= 1; kx++) {
                                        const pixelIndex = ((y + ky) * width + (x + kx)) * 4 + c;
                                        sum += data[pixelIndex] * kernel[ky + 1][kx + 1];
                                    }
                                }
                                newData[(y * width + x) * 4 + c] = sum / kernelSum;
                            }
                        }
                    }

                    for (let i = 0; i < data.length; i++) {
                        data[i] = newData[i];
                    }
                    break;
            }

            currentImageData = imageData;
            ctx.putImageData(imageData, 0, 0);
        };

        window.resetImage = () => {
            if (originalImageData) {
                ctx.putImageData(originalImageData, 0, 0);
                currentImageData = originalImageData;
            }
        };

        // Draw placeholder
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#999';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Load an image to start', canvas.width / 2, canvas.height / 2);
    }
}

// Fractal Generation Functions
window.generateMandelbrot = () => {
    const canvas = document.getElementById('fractalCanvas');
    const ctx = canvas.getContext('2d');
    const iterations = document.getElementById('fractalIterations').value;

    const imageData = ctx.createImageData(canvas.width, canvas.height);
    const data = imageData.data;

    for (let x = 0; x < canvas.width; x++) {
        for (let y = 0; y < canvas.height; y++) {
            const a = (x / canvas.width) * 3.5 - 2.5;
            const b = (y / canvas.height) * 2 - 1;

            let ca = a;
            let cb = b;
            let n = 0;

            while (n < iterations) {
                const aa = ca * ca - cb * cb;
                const bb = 2 * ca * cb;
                ca = aa + a;
                cb = bb + b;

                if (ca * ca + cb * cb > 4) break;
                n++;
            }

            const pixelIndex = (y * canvas.width + x) * 4;
            const brightness = (n / iterations) * 255;

            data[pixelIndex] = brightness;
            data[pixelIndex + 1] = brightness * 0.5;
            data[pixelIndex + 2] = brightness * 0.8;
            data[pixelIndex + 3] = 255;
        }
    }

    ctx.putImageData(imageData, 0, 0);
};

window.generateJulia = () => {
    const canvas = document.getElementById('fractalCanvas');
    const ctx = canvas.getContext('2d');
    const iterations = document.getElementById('fractalIterations').value;

    const imageData = ctx.createImageData(canvas.width, canvas.height);
    const data = imageData.data;

    const cReal = -0.7;
    const cImag = 0.27015;

    for (let x = 0; x < canvas.width; x++) {
        for (let y = 0; y < canvas.height; y++) {
            let zReal = (x / canvas.width) * 3 - 1.5;
            let zImag = (y / canvas.height) * 3 - 1.5;

            let n = 0;

            while (n < iterations) {
                const zRealNew = zReal * zReal - zImag * zImag + cReal;
                const zImagNew = 2 * zReal * zImag + cImag;

                zReal = zRealNew;
                zImag = zImagNew;

                if (zReal * zReal + zImag * zImag > 4) break;
                n++;
            }

            const pixelIndex = (y * canvas.width + x) * 4;
            const hue = (n / iterations) * 360;
            const [r, g, b] = hslToRgb(hue / 360, 1, 0.5);

            data[pixelIndex] = r;
            data[pixelIndex + 1] = g;
            data[pixelIndex + 2] = b;
            data[pixelIndex + 3] = 255;
        }
    }

    ctx.putImageData(imageData, 0, 0);
};

window.generateSierpinski = () => {
    const canvas = document.getElementById('fractalCanvas');
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const drawSierpinski = (x1, y1, x2, y2, x3, y3, depth) => {
        if (depth === 0) {
            ctx.fillStyle = `hsl(${depth * 30}, 70%, 50%)`;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.lineTo(x3, y3);
            ctx.closePath();
            ctx.fill();
        } else {
            const mx1 = (x1 + x2) / 2;
            const my1 = (y1 + y2) / 2;
            const mx2 = (x2 + x3) / 2;
            const my2 = (y2 + y3) / 2;
            const mx3 = (x3 + x1) / 2;
            const my3 = (y3 + y1) / 2;

            drawSierpinski(x1, y1, mx1, my1, mx3, my3, depth - 1);
            drawSierpinski(mx1, my1, x2, y2, mx2, my2, depth - 1);
            drawSierpinski(mx3, my3, mx2, my2, x3, y3, depth - 1);
        }
    };

    const depth = Math.min(8, Math.floor(document.getElementById('fractalIterations').value / 10));
    drawSierpinski(canvas.width / 2, 20, 20, canvas.height - 20, canvas.width - 20, canvas.height - 20, depth);
};

// Utility Functions
window.clearDrawing = () => {
    const canvas = document.getElementById('drawingCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
};

window.saveDrawing = () => {
    const canvas = document.getElementById('drawingCanvas');
    const link = document.createElement('a');
    link.download = 'drawing.png';
    link.href = canvas.toDataURL();
    link.click();
};

// HSL to RGB conversion
function hslToRgb(h, s, l) {
    let r, g, b;

    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CanvasGraphics();
    console.log('Canvas Graphics demos initialized');
});