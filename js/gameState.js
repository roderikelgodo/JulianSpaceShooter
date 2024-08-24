// gameState.js

let score = 0;
let gameTime = 0;
let currentLevel = 1;
const FINAL_BOSS_LEVEL = 9; // Define el nivel del último jefe

export function getScore() {
    return score;
}

export function setScore(newScore) {
    score = newScore;
}

export function incrementScore(amount) {
    score += amount;
}

export function getGameTime() {
    return gameTime;
}

export function updateGameTime(delta) {
    gameTime += delta;
}

export function getCurrentLevel() {
    return currentLevel;
}

export function incrementLevel() {
    currentLevel++;
    return currentLevel;
}

export function resetGameState() {
    score = 0;
    gameTime = 0;
    currentLevel = 1;
}

export function getFormattedTime() {
    const minutes = Math.floor(gameTime / 60);
    const seconds = Math.floor(gameTime % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

import { setGameOverWin } from './gameOverWin.js';

export function updateLevel(levelText, canvas, updateEnemyLevel, enemyImage, missileEnemyImage) {
    if (currentLevel >= FINAL_BOSS_LEVEL) {
        setGameOverWin(true);
    } else {
        currentLevel++;
        levelText.textContent = `NIVEL ${currentLevel}`;
        enemyImage.src = `img/jefe-${currentLevel}.png`;
        missileEnemyImage.src = `img/misil-enemigo-${currentLevel}.png`;
        
        // Esperar a que ambas imágenes se carguen antes de actualizar el enemigo
        Promise.all([
            new Promise(resolve => enemyImage.onload = resolve),
            new Promise(resolve => missileEnemyImage.onload = resolve)
        ]).then(() => {
            updateEnemyLevel(currentLevel, canvas, enemyImage, missileEnemyImage);
        });
    }
}



