// pause.js

let isPaused = false;
let pauseOverlay;

function initPauseOverlay() {
    pauseOverlay = new Image();
    pauseOverlay.src = window.location.href+'img/pause-overlay.png'; // Asegúrate de que la ruta sea correcta
}

function togglePause() {
    isPaused = !isPaused;
    const pauseButton = document.getElementById('pauseButton');
    const icon = pauseButton.querySelector('i');
    if (isPaused) {
        icon.classList.remove('fa-pause');
        icon.classList.add('fa-play');
    } else {
        icon.classList.remove('fa-play');
        icon.classList.add('fa-pause');
    }
    return isPaused;
}
    
function drawPauseMessage(ctx, canvasWidth, canvasHeight) {
    if (isPaused) {
        // Oscurecer toda la pantalla
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        if (pauseOverlay.complete) {
            // Calcular la posición para centrar el overlay
            const x = (canvasWidth - pauseOverlay.width) / 2;
            const y = (canvasHeight - pauseOverlay.height) / 2;
            
            // Dibujar el overlay PNG en su tamaño original y centrado
            ctx.drawImage(pauseOverlay, x, y);

            // Dibujar el texto de pausa
            ctx.fillStyle = 'white';
            ctx.font = '40px Impact';
            ctx.textAlign = 'center';
            } else {
            // Fallback en caso de que la imagen no se haya cargado
            ctx.fillStyle = 'white';
            ctx.font = '40px Impact';
            ctx.textAlign = 'center';
            ctx.fillText('JUEGO EN PAUSA', canvasWidth / 2, canvasHeight / 2);
        }
    }
}

function isPausedState() {
    return isPaused;
}

// Asegúrate de llamar a esta función al inicio del juego
initPauseOverlay();

export { togglePause, drawPauseMessage, isPausedState };