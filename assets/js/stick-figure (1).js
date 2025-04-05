
const canvas = document.getElementById('stickCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = 220;

let ball = {
    x: 100,
    y: 180,
    vx: 3,
    vy: -2,
    radius: 8,
    gravity: 0.25,
    bounce: 0.7
};

let runner = {
    x: 80,
    y: 180,
    direction: 1,
    speed: 2,
    legAngle: 0,
    armAngle: 0,
    frame: 0,
    width: 20,
    height: 50
};

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#333";
    ctx.fill();
    ctx.closePath();
}

function drawStickFigure(x, y, frame, dir) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(dir, 1);

    // Head
    ctx.beginPath();
    ctx.arc(0, -30, 10, 0, Math.PI * 2);
    ctx.stroke();

    // Body
    ctx.beginPath();
    ctx.moveTo(0, -20);
    ctx.lineTo(0, 10);
    ctx.stroke();

    // Arms
    const armSwing = Math.sin(frame / 5) * 10;
    ctx.beginPath();
    ctx.moveTo(0, -10);
    ctx.lineTo(-15 + armSwing, 0);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, -10);
    ctx.lineTo(15 - armSwing, 0);
    ctx.stroke();

    // Legs
    const legSwing = Math.sin(frame / 5) * 12;
    ctx.beginPath();
    ctx.moveTo(0, 10);
    ctx.lineTo(-10 + legSwing, 30);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, 10);
    ctx.lineTo(10 - legSwing, 30);
    ctx.stroke();

    ctx.restore();
}

function updateBall() {
    ball.vy += ball.gravity;
    ball.x += ball.vx;
    ball.y += ball.vy;

    // Bounce off ground
    if (ball.y + ball.radius > canvas.height) {
        ball.y = canvas.height - ball.radius;
        ball.vy *= -ball.bounce;
    }

    // Bounce off walls
    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.vx *= -1;
    }
}

function updateRunner() {
    runner.frame++;

    // Chase ball
    if ((ball.x > runner.x && runner.direction === 1) || (ball.x < runner.x && runner.direction === -1)) {
        runner.x += runner.speed * runner.direction;
    } else {
        runner.direction *= -1;
    }

    // Kick
    let dx = ball.x - runner.x;
    let dy = ball.y - runner.y;
    let distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 25 && ball.vx * runner.direction < 0) {
        ball.vx = 5 * runner.direction;
        ball.vy = -4;
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
