// Get canvas and context
const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');

// Get buttons and containers
const clearBtn = document.getElementById('clearBtn');
const predictBtn = document.getElementById('predictBtn');
const resultContainer = document.getElementById('resultContainer');
const errorContainer = document.getElementById('errorContainer');

// Canvas configuration
const BRUSH_SIZE = 15;
const BRUSH_COLOR = '#000000';

// Drawing state
let isDrawing = false;
let lastX = 0;
let lastY = 0;

// Initialize canvas
function initializeCanvas() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = BRUSH_COLOR;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = BRUSH_SIZE;
}

initializeCanvas();

// Drawing functions
function startDrawing(e) {
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    lastX = e.clientX - rect.left;
    lastY = e.clientY - rect.top;
}

function draw(e) {
    if (!isDrawing) return;
    
    const rect = canvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;
    
    ctx.strokeStyle = BRUSH_COLOR;
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(currentX, currentY);
    ctx.stroke();
    
    lastX = currentX;
    lastY = currentY;
}

function stopDrawing() {
    isDrawing = false;
}

// Touch support for mobile devices
function handleTouch(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent(e.type === 'touchstart' ? 'mousedown' : e.type === 'touchmove' ? 'mousemove' : 'mouseup', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
}

// Event listeners for desktop
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

// Event listeners for touch
canvas.addEventListener('touchstart', handleTouch);
canvas.addEventListener('touchmove', handleTouch);
canvas.addEventListener('touchend', handleTouch);

// Clear button
clearBtn.addEventListener('click', () => {
    initializeCanvas();
    resultContainer.classList.add('hidden');
    errorContainer.classList.add('hidden');
});

// Predict button
predictBtn.addEventListener('click', async () => {
    // Get canvas image data
    const imageData = canvas.toDataURL('image/png');
    
    // Show loading state
    predictBtn.disabled = true;
    predictBtn.classList.add('loading');
    
    try {
        const response = await fetch('/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ image: imageData })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            displayResult(data);
            errorContainer.classList.add('hidden');
        } else {
            displayError(data.error || 'Prediction failed');
        }
    } catch (error) {
        displayError('Error: ' + error.message);
    } finally {
        predictBtn.disabled = false;
        predictBtn.classList.remove('loading');
    }
});

// Display prediction result
function displayResult(data) {
    document.getElementById('digitResult').textContent = data.digit;
    document.getElementById('digitText').textContent = data.digit;
    document.getElementById('confidenceText').textContent = data.confidence.toFixed(2) + '%';
    
    // Display probability bars
    const probabilityBars = document.getElementById('probabilityBars');
    probabilityBars.innerHTML = '';
    
    const probabilities = data.probabilities;
    for (let digit = 0; digit < 10; digit++) {
        const prob = probabilities[digit.toString()];
        const barHTML = `
            <div class="probability-bar">
                <div class="probability-label">${digit}</div>
                <div class="probability-bg">
                    <div class="probability-fill" style="width: ${prob}%">
                        ${prob > 5 ? prob.toFixed(1) + '%' : ''}
                    </div>
                </div>
            </div>
        `;
        probabilityBars.innerHTML += barHTML;
    }
    
    resultContainer.classList.remove('hidden');
}

// Display error message
function displayError(message) {
    document.getElementById('errorText').textContent = '❌ ' + message;
    errorContainer.classList.remove('hidden');
}

// Check if model is loaded on page load
window.addEventListener('load', async () => {
    try {
        const response = await fetch('/health');
        const data = await response.json();
        if (!data.model_loaded) {
            document.getElementById('errorText').textContent = 
                '⚠️ Model not loaded. Please run: python train_model.py';
            errorContainer.classList.remove('hidden');
        }
    } catch (error) {
        console.log('Could not check model status');
    }
});
