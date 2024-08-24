// player.js

export const player = {
    x: 0,
    y: 0,
    width: 50,
    height: 50,
    isDestroyed: false,
    invincible: false,
    invincibilityTime: 2000,
    lastHitTime: 0,
    isRespawning: false,
    respawnTime: 1000,
    activePowerUp: null,
    canvas: null,
    powerUpImage1: null,
    powerUpImage2: null
};

export function initializePlayer(canvas) {
    player.x = canvas.width / 2;
    player.y = canvas.height - 50;
    player.canvas = canvas;
}

export function updatePlayer(canvas, bullets, bulletSpeed, collision, enemy, createExplosion, score, updateLevel) {
    // Update player invincibility
    if (player.invincible && Date.now() - player.lastHitTime > player.invincibilityTime) {
        player.invincible = false;
    }

    // Handle player respawn
    if (player.isRespawning) {
        if (Date.now() - player.lastHitTime > player.respawnTime) {
            player.isRespawning = false;
            player.y = canvas.height - 50;
            player.invincible = true;
            player.lastHitTime = Date.now();
        } else {
            // Move player up during respawn
            player.y = canvas.height + 50 - (Date.now() - player.lastHitTime) / player.respawnTime * 100;
        }
    }

    // Update bullets
    bullets.forEach((bullet, index) => {
        bullet.y -= bulletSpeed;
        if (bullet.y < 0) bullets.splice(index, 1);

        // Collision with enemy boss
        if (collision(bullet, enemy) && !enemy.invincible) {
            bullets.splice(index, 1);
            enemy.health -= 5;
            score += 10;
        }
    });

    return score;  // Return the updated score
}

export function drawPlayer(ctx, playerImage, missileImage, bullets) {
    if (!player.isDestroyed && !player.isRespawning) {
        if (player.invincible) {
            ctx.globalAlpha = 0.5 + Math.sin(Date.now() / 100) * 0.5;
        }
        let imageToDraw;
        if (player.activePowerUp === 'powerup1') {
            imageToDraw = player.powerUpImage1;
        } else if (player.activePowerUp === 'powerup2') {
            imageToDraw = player.powerUpImage2;
        } else {
            imageToDraw = playerImage;
        }
        ctx.drawImage(imageToDraw, player.x, player.y, player.width, player.height);
        ctx.globalAlpha = 1;

        // Draw bullets
        bullets.forEach(bullet => {
            ctx.drawImage(missileImage, bullet.x, bullet.y, bullet.width, bullet.height);
        });
    }
}

export function activatePowerUp(powerUpType) {
    player.activePowerUp = powerUpType;
    if (powerUpType === 'powerup1' && !player.powerUpImage1) {
        player.powerUpImage1 = new Image();
        player.powerUpImage1.src = 'img/skin-2.png';
    } else if (powerUpType === 'powerup2' && !player.powerUpImage2) {
        player.powerUpImage2 = new Image();
        player.powerUpImage2.src = 'img/skin-3.png';
    }
}

export function deactivatePowerUp() {
    player.activePowerUp = null;
}