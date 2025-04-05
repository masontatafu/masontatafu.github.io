const canvas = document.getElementById("stickCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = 200;

let x = 50;
let dx = 2;
let legFrame = 0;
let ballX = 100;
let ballDX = 0;

// Draw stick figure with running legs
function drawStickFigure(xPos, legFrame) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Ground line
    ctx.beginPath();
    ctx.moveTo(0, 130);
    ctx.lineTo(canvas.width, 130);
    ctx.strokeStyle = "#999";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Head
    ctx.beginPath();
    ctx.arc(xPos, 60, 10, 0, Math.PI * 2);
    ctx.stroke();

    // Body
    ctx.beginPath();
    ctx.moveTo(xPos, 70);
    ctx.lineTo(xPos, 100);
    ctx.stroke();

    // Arms
    ctx.beginPath();
    ctx.moveTo(xPos - 10, 85);
    ctx.lineTo(xPos + 10, 85);
    ctx.stroke();

    // Legs (alternate every frame for running effect)
    ctx.beginPath();
    if (legFrame % 20 < 10) {
        ctx.moveTo(xPos, 100);
        ctx.lineTo(xPos - 10, 120);
        ctx.moveTo(xPos, 100);
        ctx.lineTo(xPos + 10, 115);
    } else {
        ctx.moveTo(xPos, 100);
        ctx.lineTo(xPos - 10, 115);
        ctx.moveTo(xPos, 100);
        ctx.lineTo(xPos + 10, 120);
    }
    ctx.stroke();

    // Draw soccer ball
    ctx.beginPath();
    ctx.arc(ballX, 122, 5, 0, Math.PI * 2);
    ctx.fillStyle = "black";
    ctx.fill();
}

// Animate both figure and ball
function animate() {
    drawStickFigure(x, legFrame);
    x += dx;
    legFrame++;

    // When figure reaches ball, kick it
    if (Math.abs(x - ballX) < 12 && ballDX === 0) {
        ballDX = 3; // kick!
    }

    // Move ball if it's kicked
    if (ballDX > 0) {
        ballX += ballDX;
        if (ballX > canvas.width - 10) {
            ballX = 50;     // reset ball
            ballDX = 0;
        }
    }

    // Stick figure bounce off edge
    if (x > canvas.width - 20) {
        x = 50;
        ballX = 100;
        ballDX = 0;
    }

    requestAnimationFrame(animate);
}

animate();

