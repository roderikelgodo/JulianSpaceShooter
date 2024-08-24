// lives.js
let InitialPlayerLives = 3;
let playerLives = InitialPlayerLives;
const MAX_LIVES = 5;
const LIFE_POWERUP_INTERVAL = 300; // Puntos necesarios para que aparezca una vida extra
const LIFE_POWERUP_SIZE = 50;
const LIFE_POWERUP_SPEED = 1;

let lifePowerups = [];
let lastLifePowerupScore = 0; // Nueva variable para rastrear el último puntaje en el que se generó una vida

function updateLivesDisplay() {
    const livesContainer = document.getElementById('livesContainer');
    livesContainer.innerHTML = '';
    for (let i = 0; i < playerLives; i++) {
        const lifeIcon = document.createElement('img');
        lifeIcon.src = 'img/lifeIcon.png';
        lifeIcon.classList.add('lifeIcon');
        livesContainer.appendChild(lifeIcon);
    }
}

function initializeLives() {
    updateLivesDisplay();
}

function decreaseLife() {
    playerLives = Math.max(0, playerLives - 1);
    updateLivesDisplay();
    return playerLives;
}

function increaseLife() {
    if (playerLives < MAX_LIVES) {
        playerLives++;
        updateLivesDisplay();
    }
}

function resetLives() {
    playerLives = InitialPlayerLives;
    lastLifePowerupScore = 0; // Reiniciar el último puntaje de generación de vida
    updateLivesDisplay();
}

function spawnLifePowerup(canvas) {
    lifePowerups.push({
        x: Math.random() * (canvas.width - LIFE_POWERUP_SIZE),
        y: -LIFE_POWERUP_SIZE,
        width: LIFE_POWERUP_SIZE,
        height: LIFE_POWERUP_SIZE
    });
}

function updateLifePowerups(canvas, player, score, createExplosion) {
    const currentTime = Date.now();

    // Spawn new life powerup if score is multiple of LIFE_POWERUP_INTERVAL and we haven't spawned one for this interval
    if (score > 0 && score % LIFE_POWERUP_INTERVAL === 0 && score > lastLifePowerupScore && lifePowerups.length === 0) {
        spawnLifePowerup(canvas);
        lastLifePowerupScore = score; // Actualizar el último puntaje en el que se generó una vida
    }

    // Update life powerup positions
    lifePowerups.forEach((powerup, index) => {
        // Move in a zigzag pattern
        powerup.x += Math.sin(currentTime * 0.002 + index) * 2;
        powerup.y += LIFE_POWERUP_SPEED;

        // Remove powerups that are off screen
        if (powerup.y > canvas.height) {
            lifePowerups.splice(index, 1);
        }

        // Check for collision with player
        if (checkCollision(powerup, player)) {
            createExplosion(powerup.x + LIFE_POWERUP_SIZE / 2, powerup.y + LIFE_POWERUP_SIZE / 2);
            increaseLife();
            lifePowerups.splice(index, 1);
        }
    });
}

function checkCollision(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.y + obj1.height > obj2.y;
}

function drawLifePowerups(ctx, lifePowerupImage) {
    lifePowerups.forEach(powerup => {
        ctx.drawImage(lifePowerupImage, powerup.x, powerup.y, LIFE_POWERUP_SIZE, LIFE_POWERUP_SIZE);
    });
}

export { 
    initializeLives, 
    decreaseLife, 
    resetLives, 
    updateLifePowerups, 
    drawLifePowerups, 
    lifePowerups 
};