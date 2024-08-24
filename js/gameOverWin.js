// gameOverWin.js

import { getScore } from './gameState.js';

let isGameWon = false;

function drawGameWinMessage(ctx, canvasWidth, canvasHeight, score) {
    if (isGameWon) {
        // Ocultar el canvas y mostrar la pantalla de Game Win
        document.getElementById('gameCanvas').style.display = 'none';
        document.getElementById('pauseButton').style.display = 'none';
        document.getElementById('levelText').style.display = 'none';
        document.getElementById('gameInfoContainer').style.display = 'none';
        document.getElementById('gameWinScreen').style.display = 'block';
        
        // Actualizar el puntaje final
        document.getElementById('finalScore2').textContent = score;
    }
}

export function setGameOverWin(value) {
    isGameWon = value;
    if (isGameWon) {
        const finalScore2 = getScore();
        drawGameWinMessage(null, null, null, finalScore2);
    } else {
        // Ocultar la pantalla de Game Win y mostrar el canvas cuando se reinicia el juego
        document.getElementById('gameWinScreen').style.display = 'none';
        document.getElementById('gameCanvas').style.display = 'block';
        document.getElementById('pauseButton').style.display = 'block';
        document.getElementById('levelText').style.display = 'block';
        document.getElementById('gameInfoContainer').style.display = 'block';
    }
}

export function isGameWinState() {
    return isGameWon;
}

export { drawGameWinMessage };