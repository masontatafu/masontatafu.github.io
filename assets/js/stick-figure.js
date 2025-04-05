const canvas = document.getElementById("stickCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = 200;

let x = 50;
let dx = 2;

function drawStickFigure() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 0.15; // transparency

    // Head
    ctx.beginPath();
    ctx.arc(x, 60, 10, 0, Math.PI * 2);
    ctx.stroke();

    // Body
    ctx.beginPath();
    ctx.moveTo(x, 70);
    ctx.lineTo(x, 100);
    ctx.stroke();

    // Arms
    ctx.beginPath();
    ctx.moveTo(x - 10, 85);
    ctx.lineTo(x + 10, 85);
    ctx.stroke();

    // Legs
    ctx.beginPath();
    ctx.moveTo(x, 100);
    ctx.lineTo(x - 10, 120);
    ctx.moveTo(x, 100);
    ctx.lineTo(x + 10, 120);
    ctx.stroke();

    // Movement logic
    x += dx;
    if (x > canvas.width - 10 || x < 10) {
        dx = -dx;
    }
}

function animate() {
    drawStickFigure();
    requestAnimationFrame(animate);
}

animate();

