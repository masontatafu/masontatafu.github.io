
const canvas = document.getElementById('stickCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = 220;

let ball = {
    x: 100,
    y: 190,
    vx: 2.5,
    vy: 0,
    radius: 8,
    gravity: 0.25,
    bounce: 0.7
};

let runner = {
    x: 80,
    y: 190,
    direction: 1,
    speed: 2,
    frame: 0
};

function drawStickFigure(x, y, frame, dir) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(dir, 1);

    // Run cycle: swing arms and legs at staggered timings
    const swingSpeed = 0.15;
    const armSwing = Math.sin(frame * swingSpeed) * 12;
    const rearArmSwing = Math.sin(frame * swingSpeed + Math.PI) * 12;
    const frontLegSwing = Math.sin(frame * swingSpeed + Math.PI / 2) * 14;
    const rearLegSwing = Math.sin(frame * swingSpeed + 3 * Math.PI / 2) * 14;

    // Head
    ctx.beginPath();
    ctx.arc(0, -30, 8, 0, Math.PI * 2);
    ctx.stroke();

    // Body
    ctx.beginPath();
    ctx.moveTo(0, -22);
    ctx.lineTo(0, 10);
    ctx.stroke();

    // Arms (rear first)
    ctx.beginPath();
    ctx.moveTo(0, -18);
    ctx.lineTo(-12 + rearArmSwing, 0);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, -18);
    ctx.lineTo(12 + armSwing, 0);
    ctx.stroke();

    // Legs (rear first)
    ctx.beginPath();
    ctx.moveTo(0, 10);
    ctx.lineTo(-10 + rearLegSwing, 30);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, 10);
    ctx.lineTo(10 + frontLegSwing, 30);
    ctx.stroke();

    ctx.restore();
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#333";
    ctx.fill();
    ctx.closePath();
}

function updateBall() {
    ball.vy += ball.gravity;
    ball.vx *= 0.995;
    ball.x += ball.vx;
    ball.y += ball.vy;

    if (ball.y + ball.radius > canvas.height) {
        ball.y = canvas.height - ball.radius;
        ball.vy *= -ball.bounce;
    }

    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.vx *= -1;
    }
}

function updateRunner() {
    runner.frame++;

    if ((ball.x > runner.x && runner.direction === 1) || (ball.x < runner.x && runner.direction === -1)) {
        runner.x += runner.speed * runner.direction;
    } else {
        runner.direction *= -1;
    }

    // Kick if close
    const dx = ball.x - runner.x;
    const dy = ball.y - runner.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 20 && ball.vx * runner.direction < 0) {
        ball.vx = 4.5 * runner.direction;
        ball.vy = -3;
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updateBall();
    updateRunner();
    drawBall();
    drawStickFigure(runner.x, runner.y, runner.frame, runner.direction);
    requestAnimationFrame(animate);
}

animate();

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = 220;
});
