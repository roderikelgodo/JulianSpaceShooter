// bullets.js
import { player, activatePowerUp, deactivatePowerUp } from './player.js';

export const bullets = [];
export const bulletSpeed = 3;

let lastFireTime = 0;
let fireInterval = 500; // 500 ms = 0.5 segundos

// Power-up variables
const POWER_UP_INTERVAL = 60000; // 60 seconds
const POWER_UP_DURATION = 10000; // 10 seconds
const POWER_UP_SIZE = 50;
const POWER_UP_SPEED = 1;
let powerUps = [];
let lastPowerUpTime = 0;
let activePowerUp = null;
let powerUpEndTime = 0;

export function fireBullet() {
  if (activePowerUp === 'powerup1') {
    // Fire two bullets at 80º and 100º
    const angle1 = 10 * Math.PI / 180; // 10 degrees to the right
    const angle2 = -10 * Math.PI / 180; // 10 degrees to the left
    bullets.push(createBullet(angle1));
    bullets.push(createBullet(angle2));
  } else if (activePowerUp === 'powerup2') {
    // Fire three bullets at 70º, 90º, and 110º
    const angle1 = 20 * Math.PI / 180; // 20 degrees to the right
    const angle2 = 0; // Straight up
    const angle3 = -20 * Math.PI / 180; // 20 degrees to the left
    bullets.push(createBullet(angle1));
    bullets.push(createBullet(angle2));
    bullets.push(createBullet(angle3));
  } else {
    // Normal single bullet
    bullets.push(createBullet(0));
  }
}

function createBullet(angle) {
  return {
    x: player.x + player.width / 2,
    y: player.y,
    width: 10,
    height: 20,
    vx: Math.sin(angle) * bulletSpeed,
    vy: -Math.cos(angle) * bulletSpeed
  };
}

export function updateBullets(currentTime) {
  if (currentTime - lastFireTime >= fireInterval) {
    fireBullet();
    lastFireTime = currentTime;
  }

  // Update bullet positions
  bullets.forEach((bullet, index) => {
    bullet.x += bullet.vx;
    bullet.y += bullet.vy;
    // Remove bullets that are off screen
    if (bullet.y < 0 || bullet.y > player.canvas.height || 
        bullet.x < 0 || bullet.x > player.canvas.width) {
      bullets.splice(index, 1);
    }
  });

  // Check if it's time to spawn a new power-up
  if (currentTime - lastPowerUpTime >= POWER_UP_INTERVAL && powerUps.length === 0) {
    spawnPowerUp();
    lastPowerUpTime = currentTime;
  }

  // Update power-up positions
  updatePowerUps(currentTime);

  // Check if power-up has ended
  if (activePowerUp && currentTime > powerUpEndTime) {
    deactivatePowerUpEffect();
  }
}

function spawnPowerUp() {
  const powerUpType = Math.random() < 0.5 ? 'powerup1' : 'powerup2';
  powerUps.push({
    x: Math.random() * (player.canvas.width - POWER_UP_SIZE),
    y: -POWER_UP_SIZE,
    width: POWER_UP_SIZE,
    height: POWER_UP_SIZE,
    type: powerUpType
  });
}

function updatePowerUps(currentTime) {
  powerUps.forEach((powerUp, index) => {
    // Move in a zigzag pattern
    powerUp.x += Math.sin(currentTime * 0.002 + index) * 2;
    powerUp.y += POWER_UP_SPEED;

    // Remove power-ups that are off screen
    if (powerUp.y > player.canvas.height) {
      powerUps.splice(index, 1);
    }

    // Check for collision with player
    if (checkCollision(powerUp, player)) {
      activatePowerUpEffect(powerUp.type, currentTime);
      powerUps.splice(index, 1);
    }
  });
}

function checkCollision(obj1, obj2) {
  return obj1.x < obj2.x + obj2.width &&
         obj1.x + obj1.width > obj2.x &&
         obj1.y < obj2.y + obj2.height &&
         obj1.y + obj1.height > obj2.y;
}

function activatePowerUpEffect(powerUpType, currentTime) {
  activePowerUp = powerUpType;
  powerUpEndTime = currentTime + POWER_UP_DURATION;
  activatePowerUp(powerUpType);
}

function deactivatePowerUpEffect() {
  activePowerUp = null;
  deactivatePowerUp();
}

export function drawPowerUps(ctx, powerUpImage1, powerUpImage2) {
  powerUps.forEach(powerUp => {
      const image = powerUp.type === 'powerup1' ? powerUpImage1 : powerUpImage2;
      if (image && image.complete && image.naturalHeight !== 0) {
          ctx.drawImage(image, powerUp.x, powerUp.y, POWER_UP_SIZE, POWER_UP_SIZE);
      } else {
          console.warn(`Image for ${powerUp.type} not loaded yet`);
          // Draw a placeholder rectangle
          ctx.fillStyle = powerUp.type === 'powerup1' ? 'blue' : 'red';
          ctx.fillRect(powerUp.x, powerUp.y, POWER_UP_SIZE, POWER_UP_SIZE);
      }
  });
}