// minions.js

const minions = [];
const MINION_WIDTH = 40;
const MINION_HEIGHT = 40;
const MINION_SPEED = 2;
const SPAWN_INTERVAL = 2000; // Spawn a new minion every 2 seconds
let lastSpawnTime = 0;

export function initializeMinions() {
    minions.length = 0; // Clear the minions array
}

export function updateMinions(canvas, player, bullets, createExplosion, decreaseLife, setScore, getScore) {
    const currentTime = Date.now();

    // Spawn new minions
    if (currentTime - lastSpawnTime > SPAWN_INTERVAL) {
        spawnMinion(canvas);
        lastSpawnTime = currentTime;
    }

    // Update minion positions
    minions.forEach((minion, index) => {
        // Move in a zigzag pattern
        minion.x += Math.sin(currentTime * 0.002 + index) * 2;
        minion.y += MINION_SPEED;

        // Remove minions that are off screen
        if (minion.y > canvas.height) {
            minions.splice(index, 1);
        }

        // Check for collision with player
        if (checkCollision(minion, player) && !player.invincible && !player.isRespawning) {
            createExplosion(player.x + player.width / 2, player.y + player.height / 2);
            if (decreaseLife() > 0) {
                player.isRespawning = true;
                player.lastHitTime = Date.now();
            } else {
                player.isDestroyed = true;
            }
            minions.splice(index, 1);
        }

        // Check for collision with bullets
        bullets.forEach((bullet, bulletIndex) => {
            if (checkCollision(minion, bullet)) {
                createExplosion(minion.x + MINION_WIDTH / 2, minion.y + MINION_HEIGHT / 2);
                minions.splice(index, 1);
                bullets.splice(bulletIndex, 1);
                setScore(getScore() + 10); // Increment score by 10 points when a minion is destroyed
            }
        });
    });
}

function spawnMinion(canvas) {
    minions.push({
        x: Math.random() * (canvas.width - MINION_WIDTH),
        y: -MINION_HEIGHT,
        width: MINION_WIDTH,
        height: MINION_HEIGHT
    });
}

function checkCollision(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.y + obj1.height > obj2.y;
}

export function drawMinions(ctx, minionImage) {
    minions.forEach(minion => {
        ctx.drawImage(minionImage, minion.x, minion.y, MINION_WIDTH, MINION_HEIGHT);
    });
}