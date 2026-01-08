document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('techCanvas');
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const nodes = [];
    const nodeCount = 60;
    const maxDistance = 220;

    function createNodes() {
        for (let i = 0; i < nodeCount; i++) {
            nodes.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 2 + 2,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4
            });
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < nodes.length; i++) {
            const nodeA = nodes[i];
            for (let j = i + 1; j < nodes.length; j++) {
                const nodeB = nodes[j];
                const dx = nodeB.x - nodeA.x;
                const dy = nodeB.y - nodeA.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < maxDistance) {
                    const opacity = 1 - dist / maxDistance;
                    ctx.strokeStyle = `rgba(0, 188, 235, ${opacity * 0.35})`;
                    ctx.lineWidth = 1.5;
                    ctx.beginPath();
                    ctx.moveTo(nodeA.x, nodeA.y);
                    ctx.lineTo(nodeB.x, nodeB.y);
                    ctx.stroke();
                }
            }
            nodeA.x += nodeA.vx;
            nodeA.y += nodeA.vy;

            if (nodeA.x <= 0 || nodeA.x >= canvas.width) nodeA.vx *= -1;
            if (nodeA.y <= 0 || nodeA.y >= canvas.height) nodeA.vy *= -1;

            ctx.fillStyle = 'rgba(0, 188, 235, 0.5)';
            ctx.beginPath();
            ctx.arc(nodeA.x, nodeA.y, nodeA.radius, 0, Math.PI * 2);
            ctx.fill();
        }
        requestAnimationFrame(animate);
    }
    
    createNodes();
    animate();
});