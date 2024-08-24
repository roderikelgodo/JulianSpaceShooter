// explosions.js

export const explosionParticles = [];

export function createExplosion(x, y) {
    for (let i = 0; i < 50; i++) {
        explosionParticles.push({
            x: x,
            y: y,
            radius: Math.random() * 3 + 1,
            color: `hsl(${Math.random() * 60 + 15}, 100%, 50%)`,
            velocity: {
                x: (Math.random() - 0.5) * 8,
                y: (Math.random() - 0.5) * 8
            },
            alpha: 1
        });
    }
}

export function updateExplosionParticles() {
    explosionParticles.forEach((particle, index) => {
        particle.x += particle.velocity.x;
        particle.y += particle.velocity.y;
        particle.alpha -= 0.02;
        if (particle.alpha <= 0) {
            explosionParticles.splice(index, 1);
        }
    });
}

export function drawExplosionParticles(ctx) {
    explosionParticles.forEach(particle => {
        ctx.globalAlpha = particle.alpha;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();
    });
    ctx.globalAlpha = 1; // Reset alpha to default
}
