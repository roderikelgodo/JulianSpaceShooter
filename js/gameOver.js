// gameOver.js

import { getScore } from './gameState.js';

let isGameOver = false;

function drawGameOverMessage(ctx, canvasWidth, canvasHeight, score) {
    if (isGameOver) {
        // Ocultar el canvas y mostrar la pantalla de Game Over
        document.getElementById('gameCanvas').style.display = 'none';
        document.getElementById('pauseButton').style.display = 'none';
        document.getElementById('levelText').style.display = 'none';
        document.getElementById('gameInfoContainer').style.display = 'none';
        document.getElementById('gameOverScreen').style.display = 'block';
        
        // Actualizar el puntaje final
        document.getElementById('finalScore').textContent = score;
    }
}

function setGameOver(value) {
    isGameOver = value;
    if (isGameOver) {
        const finalScore = getScore();
        drawGameOverMessage(null, null, null, finalScore);
    } else {
        // Ocultar la pantalla de Game Over y mostrar el canvas cuando se reinicia el juego
        document.getElementById('gameOverScreen').style.display = 'none';
        document.getElementById('gameCanvas').style.display = 'block';
        document.getElementById('pauseButton').style.display = 'block';
        document.getElementById('levelText').style.display = 'block';
        document.getElementById('gameInfoContainer').style.display = 'block';
    }
}

function isGameOverState() {
    return isGameOver;
}

export { drawGameOverMessage, setGameOver, isGameOverState };