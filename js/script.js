import Nebulae from './nebulae.js';
import { initializeStars, updateStars, drawStars } from './stars.js';
import { togglePause, drawPauseMessage, isPausedState } from './pause.js';
import { drawGameOverMessage, setGameOver, isGameOverState } from './gameOver.js';
import { setGameOverWin, isGameWinState } from './gameOverWin.js'; // Asegúrate de importar isGameWinState
import { initializeLives, decreaseLife, resetLives, updateLifePowerups, drawLifePowerups, lifePowerups } from './lives.js';
import { enemy, enemyAttacks, initializeEnemy, updateEnemy, drawEnemy, updateEnemyLevel, resetEnemy } from './enemy.js';
import { player, initializePlayer, updatePlayer, drawPlayer } from './player.js';
import { explosionParticles, createExplosion, updateExplosionParticles, drawExplosionParticles } from './explosions.js';
import { collision } from './collisions.js';
import { bullets, bulletSpeed, updateBullets, drawPowerUps } from './bullets.js';
import { getScore, setScore, incrementScore, getGameTime, updateGameTime, getCurrentLevel, incrementLevel, resetGameState, getFormattedTime, updateLevel } from './gameState.js';
import { initializeMinions, updateMinions, drawMinions } from './minions.js';

// Asegúrate de que el botón de pausa esté oculto al cargar la página
window.addEventListener('load', function() {
    document.getElementById('pauseButton').style.display = 'none';
    document.getElementById('gameInfoContainer').style.display = 'none';
});

document.getElementById('startButton').addEventListener('click', function () {
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('gameInfo').style.display = 'block';
    document.getElementById('levelText').style.display = 'block';
    document.getElementById('livesContainer').style.display = 'block';
    document.getElementById('pauseButton').style.display = 'block';
    document.getElementById('gameInfoContainer').style.display = 'block';

    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Game variables
    let isGamePaused = false;
    let isGameOver = false;
    const levelText = document.getElementById('levelText');

    // Load img
    const playerImage = new Image();
    playerImage.src = "img/skin-1.png";

    const enemyImage = new Image();
    enemyImage.src = "img/jefe-1.png";

    // Load missile image
    const missileImage = new Image();
    missileImage.src = 'img/misil-1.png';

    // Load enemy missile image
    const missileEnemyImage = new Image();
    missileEnemyImage.src = 'img/misil-enemigo-1.png';

    //Cargar imagen Minions
    const minionImage = new Image();
    minionImage.src = 'img/minion-1.png'; // Asegúrate de tener esta imagen

    //Power Up Lives
    const lifePowerupImage = new Image();
    lifePowerupImage.src = 'img/life-powerup.png'; // Asegúrate de tener esta imagen

    //POWER UP 1
    const powerUpImage1 = new Image();
    powerUpImage1.src = 'img/power-up1-icon.png';

    //POWER UP 2
    const powerUpImage2 = new Image();
    powerUpImage2.src = 'img/power-up2-icon.png';
    
    // Initialize game components
    initializeStars(canvas);
    Nebulae.initialize(canvas);
    initializePlayer(canvas);
    initializeEnemy(canvas.width, canvas.height);
    initializeLives();
    initializeMinions();

// Función para limitar la posición del jugador dentro del canvas
function limitPlayerPosition(x, y, canvas) {
    return {
        x: Math.max(0, Math.min(x, canvas.width - player.width)),
        y: Math.max(0, Math.min(y, canvas.height - player.height))
    };
}

// Control con mouse (actualizado)
canvas.addEventListener('mousemove', (e) => {
    if (!isGamePaused && !isGameOver) {
        const newPosition = limitPlayerPosition(
            e.clientX - player.width / 2,
            e.clientY - player.height / 2,
            canvas
        );
        player.x = newPosition.x;
        player.y = newPosition.y;
    }
});

// Control táctil (actualizado)
canvas.addEventListener('touchmove', (e) => {
    if (!isGamePaused && !isGameOver) {
        const touch = e.touches[0];
        const newPosition = limitPlayerPosition(
            touch.clientX - player.width / 2,
            touch.clientY - player.height / 2,
            canvas
        );
        player.x = newPosition.x;
        player.y = newPosition.y;
    }
});

// Control con joystick (actualizado)
function updateGamepad() {
    const gamepads = navigator.getGamepads();
    for (let i = 0; i < gamepads.length; i++) {
        const gp = gamepads[i];
        if (gp) {
            const xAxis = gp.axes[0];
            const yAxis = gp.axes[1];

            if (!isGamePaused && !isGameOver) {
                const newPosition = limitPlayerPosition(
                    player.x + xAxis * 5,
                    player.y + yAxis * 5,
                    canvas
                );
                player.x = newPosition.x;
                player.y = newPosition.y;
            }
        }
    }
    requestAnimationFrame(updateGamepad);
}
// Inicia la actualización del gamepad
updateGamepad();


    // Pause button
    const pauseButton = document.getElementById('pauseButton');
    pauseButton.addEventListener('click', handlePauseToggle);

    function handlePauseToggle() {
        isGamePaused = togglePause();
    }

    // Add keyboard event for "p" key (PAUSE)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'p' || e.key === 'P') {
            handlePauseToggle();
        }
    });

    // UPDATE FUNCTION
    function update() {
        if (isPausedState() || isGameOverState()) return;
    
        updateGameTime(1 / 60);  // Assuming 60 FPS
    
        // Update bullets (new auto-fire system)
        updateBullets(Date.now());

        //power ups
        drawPowerUps(ctx, powerUpImage1, powerUpImage2);
    
        // Update player
        setScore(updatePlayer(canvas, bullets, bulletSpeed, collision, enemy, createExplosion, getScore(), updateGameLevel));
    
        // Update enemy
        updateEnemy(canvas, player, createExplosion, collision, decreaseLife, setGameOver, updateGameLevel);
        
        // UPDATE MINIONS
        updateMinions(canvas, player, bullets, createExplosion, decreaseLife, setScore, getScore);
    
        // Update life powerups
        updateLifePowerups(canvas, player, getScore(), createExplosion);
        
        // Update explosion particles
        updateExplosionParticles();
        
        // Update stars
        updateStars(canvas);
    
        // Update nebulae
        Nebulae.update(canvas);
    
        // Update game information
        document.getElementById('score').textContent = getScore();
        document.getElementById('timer').textContent = getFormattedTime();
    }

    function draw() {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        Nebulae.draw(ctx);
        drawStars(ctx);
        drawPlayer(ctx, playerImage, missileImage, bullets);
        drawPowerUps(ctx, powerUpImage1, powerUpImage2);
        drawEnemy(ctx, enemyImage, missileEnemyImage);
        drawMinions(ctx, minionImage);
        drawLifePowerups(ctx, lifePowerupImage);
        drawExplosionParticles(ctx);
        drawPauseMessage(ctx, canvas.width, canvas.height);
        drawGameOverMessage(ctx, canvas.width, canvas.height, getScore());
    }

    function updateGameLevel() {
        updateLevel(levelText, canvas, updateEnemyLevel, enemyImage, missileEnemyImage);
    }

    function gameLoop() {
        update();
        draw();
        requestAnimationFrame(gameLoop);
    }

    document.getElementById('restartButton').addEventListener('click', () => {
        if (isGameOverState()) {
            document.getElementById('finalScore').textContent = getScore();
            restartGame();
        }
    });
    
    document.getElementById('restartButton2').addEventListener('click', () => {
        if (isGameWinState()) {
            document.getElementById('finalScore').textContent = getScore();
            restartGame();
        }
    });
    
    function restartGame() {
        // Lógica para reiniciar el juego
        // Podría incluir reiniciar variables, estados y recargar la pantalla de inicio
        window.location.reload(); // Ejemplo simple para recargar la página
    }

    gameLoop();
});
