// enemy.js

let enemy = {
    x: 0,
    y: 50,
    width: 200,
    height: 200,
    speed: 2,
    directionX: 1,
    directionY: 1,
    maxHealth: 100,
    health: 100,
    isExploding: false,
    explosionStartTime: 0,
    explosionDuration: 2000,
    lastAttackTime: 0,
    attackInterval: 2000,
    lastDirectionChange: 0,
    directionChangeInterval: 1000,
    isRespawning: false,
    respawnStartTime: 0,
    respawnDuration: 2000,
    invincible: false,
    invincibilityDuration: 3000,
};

let enemyAttacks = [];
const enemyAttackSpeed = 5;

// Nueva variable para el tamaño del misil enemigo
let enemyMissileSize = { width: 20, height: 30 };

function initializeEnemy(canvasWidth, canvasHeight) {
    enemy.x = canvasWidth / 2;
    enemy.y = 50;
    enemy.health = enemy.maxHealth;
    enemy.isExploding = false;
    enemy.explosionStartTime = 0;
    enemy.isRespawning = true;
    enemy.respawnStartTime = Date.now();
    enemy.invincible = true;
    enemyAttacks = [];
}


function updateEnemy(canvas, player, createExplosion, collision, decreaseLife, setGameOver, updateLevel) {
    if (enemy.isExploding) {
        if (Date.now() - enemy.explosionStartTime > enemy.explosionDuration) {
            enemy.isExploding = false;
            enemy.isRespawning = true;
            enemy.respawnStartTime = Date.now();
            updateLevel();
        }
        enemyAttacks = []; // Limpiar ataques del enemigo al explotar
        return;
    }

    if (enemy.isRespawning) {
        if (Date.now() - enemy.respawnStartTime > enemy.respawnDuration) {
            enemy.isRespawning = false;
            enemy.invincible = true;
            setTimeout(() => {
                enemy.invincible = false;
            }, enemy.invincibilityDuration);
        }
        return;
    }

    if (!enemy.isRespawning && !enemy.invincible) {
        // Mover al jefe enemigo más aleatoriamente
        enemy.x += enemy.speed * enemy.directionX;
        enemy.y += enemy.speed * enemy.directionY;

        // Cambiar de dirección aleatoriamente
        if (Date.now() - enemy.lastDirectionChange > enemy.directionChangeInterval) {
            enemy.directionX = Math.random() * 2 - 1;
            enemy.directionY = Math.random() * 2 - 1;
            enemy.lastDirectionChange = Date.now();
        }

        // Mantener al enemigo dentro de los límites del lienzo
        if (enemy.x <= 0 || enemy.x + enemy.width >= canvas.width) {
            enemy.directionX *= -1;
        }
        if (enemy.y <= 0 || enemy.y + enemy.height >= canvas.height) {
            enemy.directionY *= -1;
        }

        // Comprobar colisión con el jugador
        if (collision(player, enemy) && !player.invincible && !player.isRespawning) {
            if (decreaseLife() > 0) {
                createExplosion(player.x + player.width / 2, player.y + player.height / 2);
                player.isRespawning = true;
                player.lastHitTime = Date.now();
            } else {
                player.isDestroyed = true;
                createExplosion(player.x + player.width / 2, player.y + player.height / 2);
                setGameOver(true);
            }
        }

        // Ataque del enemigo
        if (Date.now() - enemy.lastAttackTime > enemy.attackInterval) {
            enemyAttack(player);
            enemy.lastAttackTime = Date.now();
        }
    }

    // Actualizar ataques del enemigo
    for (let i = enemyAttacks.length - 1; i >= 0; i--) {
        const attack = enemyAttacks[i];
        attack.x += attack.vx;
        attack.y += attack.vy;
        if (attack.y > canvas.height || attack.x > canvas.width || attack.x < 0) {
            enemyAttacks.splice(i, 1);
        } else if (collision(attack, player) && !player.invincible && !player.isRespawning) {
            enemyAttacks.splice(i, 1);
            if (decreaseLife() > 0) {
                createExplosion(player.x + player.width / 2, player.y + player.height / 2);
                player.isRespawning = true;
                player.lastHitTime = Date.now();
            } else {
                player.isDestroyed = true;
                createExplosion(player.x + player.width / 2, player.y + player.height / 2);
                setGameOver(true);
            }
        }
    }

    if (enemy.health <= 0 && !enemy.isExploding) {
        enemy.health = 0;
        enemy.isExploding = true;
        enemy.explosionStartTime = Date.now();
        createExplosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2);
        enemyAttacks = []; // Limpiar ataques del enemigo al comenzar a explotar
        enemy.invincible = true;
    }
}

function enemyAttack(player) {
    if (!enemy.isExploding && !enemy.isRespawning && !enemy.invincible) {
        const playerCenterX = player.x + player.width / 2;
        const playerCenterY = player.y + player.height / 2;
        const enemyCenterX = enemy.x + enemy.width / 2;
        const enemyCenterY = enemy.y + enemy.height / 2;
        
        const dx = playerCenterX - enemyCenterX;
        const dy = playerCenterY - enemyCenterY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        const vx = (dx / distance) * enemyAttackSpeed;
        const vy = (dy / distance) * enemyAttackSpeed;

        const angle = Math.atan2(dy, dx);

        enemyAttacks.push({
            x: enemyCenterX,
            y: enemyCenterY,
            width: enemyMissileSize.width,
            height: enemyMissileSize.height,
            vx: vx,
            vy: vy,
            angle: angle
        });
    }
}

function drawEnemy(ctx, enemyImage, missileEnemyImage) {
    if (!enemy.isExploding && !enemy.isRespawning) {
        // Dibujar ataques del enemigo primero para que estén debajo del enemigo
        enemyAttacks.forEach(attack => {
            ctx.save();
            ctx.translate(attack.x + attack.width / 2, attack.y + attack.height / 2);
            ctx.rotate(attack.angle + Math.PI / 2); // Añadir 90 grados
            ctx.drawImage(missileEnemyImage, -attack.width / 2, -attack.height / 2, attack.width, attack.height);
            ctx.restore();
        });

        // Determinar el porcentaje de salud
        const healthPercentage = enemy.health / enemy.maxHealth;

        // Si la salud es baja, hacer que el enemigo parpadee en blanco
        if (healthPercentage <= 0.25) {
            ctx.globalAlpha = 0.9 + Math.sin(Date.now() / 100) * 0.5;
        } else if (enemy.invincible) {
            ctx.globalAlpha = 0.5 + Math.sin(Date.now() / 100) * 0.5;
        } else {
            ctx.globalAlpha = 1;
        }

        ctx.drawImage(enemyImage, enemy.x, enemy.y, enemy.width, enemy.height);
        ctx.globalAlpha = 1;

        // Dibujar barra de salud del enemigo
        let mainColor, darkColor;

        if (healthPercentage > 0.5) {
            mainColor = 'green';
            darkColor = 'darkgreen';
        } else if (healthPercentage > 0.25) {
            mainColor = 'yellow';
            darkColor = 'darkgoldenrod';
        } else {
            mainColor = 'red';
            darkColor = 'darkred';
        }

        // Dibujar fondo de la barra de salud
        ctx.fillStyle = darkColor;
        ctx.fillRect(enemy.x, enemy.y - 20, enemy.width, 3);

        // Dibujar barra de salud actual
        ctx.fillStyle = mainColor;
        ctx.fillRect(enemy.x, enemy.y - 20, enemy.width * healthPercentage, 3);
    }
}


function updateEnemyLevel(currentLevel, canvas, enemyImage, missileEnemyImage) {
    enemy.speed *= 1.05;
    enemy.maxHealth *= 1.10;
    enemy.health = enemy.maxHealth;
    enemy.attackInterval *= 0.9;

    // Ajustar el tamaño del enemigo al tamaño de la nueva imagen
    enemy.width = enemyImage.width;
    enemy.height = enemyImage.height;

    // Ajustar el tamaño del misil enemigo al tamaño de la nueva imagen
    enemyMissileSize.width = missileEnemyImage.width;
    enemyMissileSize.height = missileEnemyImage.height;

    // Reposicionar al enemigo
    enemy.x = Math.random() * (canvas.width - enemy.width);
    enemy.y = 50;
}

function resetEnemy(canvas) {
    enemy.health = enemy.maxHealth;
    enemy.isExploding = false;
    enemy.explosionStartTime = 0;
    enemy.isRespawning = true;
    enemy.respawnStartTime = Date.now();
    enemy.x = Math.random() * (canvas.width - enemy.width);
    enemy.y = 50;
    enemy.speed = 2;
    enemy.maxHealth = 100;
    enemy.health = 100;
    enemy.attackInterval = 2000;
    enemy.invincible = false;
    enemyAttacks = [];
}

export { 
    enemy, 
    enemyAttacks, 
    initializeEnemy, 
    updateEnemy, 
    drawEnemy, 
    updateEnemyLevel, 
    resetEnemy 
};