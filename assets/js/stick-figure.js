const canvas = document.getElementById("stickCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = 250;

// Constants
const gravity = 0.5;
const damping = 0.7;
const groundY = 200;
const stepLength = 8;
const runSpeed = 2;
const ballRadius = 7;

// Stick figure state
let direction = 1; // 1 for right, -1 for left
let time = 0;
let runnerX = 100;

// Ball state
let ballX = 200;
let ballY = groundY - ballRadius;
let ballVX = 3;
let ballVY = 0;

function drawLimb(x1, y1, length, angle) {
    const x2 = x1 + length * Math.cos(angle);
    const y2 = y1 + length * Math.sin(angle);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    return [x2, y2];
}

function drawStickFigure(x, t, facingRight = true) {
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;

    // Head
    ctx.beginPath();
    ctx.arc(x, groundY - 100, 10, 0, Math.PI * 2);
    ctx.stroke();

    // Torso
    const hipX = x;
    const hipY = groundY - 60;
    const shoulderX = x;
    const shoulderY = groundY - 90;
    ctx.beginPath();
    ctx.moveTo(shoulderX, shoulderY);
    ctx.lineTo(hipX, hipY);
    ctx.stroke();

    // Arms
    let armSwing = Math.sin(t / 5) * 0.5;
    if (!facingRight) armSwing *= -1;
    let [elbowX, elbowY] = drawLimb(shoulderX, shoulderY, 15, armSwing + (facingRight ? 0 : Math.PI));
    drawLimb(elbowX, elbowY, 15, armSwing + 0.5 + (facingRight ? 0 : Math.PI));

    // Legs
    let legSwing = Math.sin(t / 5 + Math.PI) * 0.5;
    if (!facingRight) legSwing *= -1;
    let [kneeX, kneeY] = drawLimb(hipX, hipY, 20, legSwing + (facingRight ? 0 : Math.PI));
    drawLimb(kneeX, kneeY, 20, legSwing + 0.5 + (facingRight ? 0 : Math.PI));
}

function updateBall() {
    ballVY += gravity;
    ballY += ballVY;
    ballX += ballVX;

    // Bounce
    if (ballY + ballRadius > groundY) {
        ballY = groundY - ballRadius;
        ballVY *= -damping;
    }

    // Wall bounce
    if (ballX < ballRadius || ballX > canvas.width - ballRadius) {
        ballVX *= -1;
        ballX = Math.max(ballRadius, Math.min(canvas.width - ballRadius, ballX));
    }
}

function maybeKickBall() {
    const footX = runnerX + direction * 10;
    const dx = ballX - footX;
    const dy = ballY - (groundY - 20);
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 15) {
        // Kick with some force
        ballVX = direction * (3 + Math.random() * 2);
        ballVY = -5 - Math.random() * 2;
    }
}

function updateRunner() {
    runnerX += direction * runSpeed;

    // Turn around when hitting the edge or chasing ball
    if ((direction === 1 && runnerX > ballX) || (direction === -1 && runnerX < ballX)) {
        // Do nothing
    } else {
        direction *= -1;
    }

    // Turn around if runner is too close to canvas edge
    if (runnerX < 30 || runnerX > canvas.width - 30) {
        direction *= -1;
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw ground
    ctx.strokeStyle = "#aaa";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(canvas.width, groundY);
    ctx.stroke();

    // Update
    updateBall();
    updateRunner();
    maybeKickBall();

    // Draw
    drawStickFigure(runnerX, time, direction === 1);

    // Draw ball
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "black";
    ctx.fill();

    time++;
    requestAnimationFrame(animate);
}

animate();
