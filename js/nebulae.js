// Nebulae module
const Nebulae = (function() {
    const nebulae = [];
    const numNebulae = 5;

    function initialize(canvas) {
        for (let i = 0; i < numNebulae; i++) {
            nebulae.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 100 + 250,
                hue: Math.random() * 60 + 180,
                speed: Math.random() * 0.1 + 0.05
            });
        }
    }

    function update(canvas) {
        nebulae.forEach(nebula => {
            nebula.y += nebula.speed;
            if (nebula.y - nebula.radius > canvas.height) {
                nebula.y = -nebula.radius;
                nebula.x = Math.random() * canvas.width;
            }
        });
    }

    function draw(ctx) {
        nebulae.forEach(nebula => {
            const gradient = ctx.createRadialGradient(nebula.x, nebula.y, 0, nebula.x, nebula.y, nebula.radius);
            gradient.addColorStop(0, `hsla(${nebula.hue}, 300%, 50%, 0.3)`);
            gradient.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(nebula.x, nebula.y, nebula.radius, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    return {
        initialize,
        update,
        draw
    };
})();

export default Nebulae;
