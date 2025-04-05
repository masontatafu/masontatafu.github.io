
const canvas = document.getElementById('stickCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = 220;

let ball = {
    x: 120,
    y: 190,
    vx: 2.8,
    vy: -1,
    radius: 8,
    gravity: 0.25,
    bounce: 0.7,
    idleFrames: 0
};

let runner = {
    x: 80,
    y: 190,
    direction: 1,
    speed: 2,
    frame: 0,
    cooldown: 0,
    lastKickX: null,
    retreating: false,
    stuckFrames: 0,
    lastX: 80,
    kickReady: true,
    wallEscape: false,
    wallEscapeFrames: 0
};

function drawStickFigure(x, y, frame, dir) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(dir, 1);

    const swingSpeed = 0.15;
    const armSwing = Math.sin(frame * swingSpeed) * 12;
    const rearArmSwing = Math.sin(frame * swingSpeed + Math.PI) * 12;
    const frontLegSwing = Math.sin(frame * swingSpeed + Math.PI / 2) * 14;
    const rearLegSwing = Math.sin(frame * swingSpeed + 3 * Math.PI / 2) * 14;

    ctx.beginPath();
    ctx.arc(0, -30, 8, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, -22);
    ctx.lineTo(0, 10);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, -18);
    ctx.lineTo(-12 + rearArmSwing, 0);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, -18);
    ctx.lineTo(12 + armSwing, 0);
    ctx.stroke();

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
    ctx.arc(Math.floor(ball.x), Math.floor(ball.y), ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#333";
    ctx.fill();
    ctx.closePath();
}

function updateBall() {
    ball.vy += ball.gravity;
    ball.vx *= 0.995;
    ball.x += ball.vx;
    ball.y += ball.vy;

    if (Math.abs(ball.vx) < 0.02 && Math.abs(ball.vy) < 0.02) {
        ball.idleFrames++;
    } else {
        ball.idleFrames = 0;
    }

    if (ball.idleFrames > 200) {
        ball.vx = (Math.random() < 0.5 ? -1 : 1) * 2;
        ball.vy = -2;
        ball.idleFrames = 0;
    }

    if (ball.y + ball.radius > canvas.height) {
        ball.y = canvas.height - ball.radius;
        ball.vy *= -ball.bounce;
    }

    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.vx *= -1;
    }

    ball.x = Math.max(ball.radius, Math.min(canvas.width - ball.radius, ball.x));
}

function updateRunner() {
    runner.frame++;

    if (Math.abs(runner.x - runner.lastX) < 1) {
        runner.stuckFrames++;
    } else {
        runner.stuckFrames = 0;
    }
    runner.lastX = runner.x;

    if (runner.wallEscape) {
        runner.wallEscapeFrames++;
        runner.x -= 4 * runner.direction;
        if (runner.wallEscapeFrames > 10) {
            runner.wallEscape = false;
            runner.wallEscapeFrames = 0;
        }
        return;
    }

    if (runner.cooldown > 0) {
        runner.cooldown--;
        return;
    }

    const dx = ball.x - runner.x;
    const dy = ball.y - runner.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (runner.retreating) {
        runner.x -= 2 * runner.direction;
        if (Math.abs(runner.x - runner.lastKickX) > 40) {
            runner.retreating = false;
        }
        return;
    }

    // NEW: escape if stuck in wall corner
    if ((ball.x <= ball.radius + 2 && runner.direction === -1) ||
        (ball.x >= canvas.width - ball.radius - 2 && runner.direction === 1)) {
        runner.wallEscape = true;
        runner.direction *= -1;
        return;
    }

    if (distance > 25) {
        runner.direction = dx > 0 ? 1 : -1;
        runner.x += runner.speed * runner.direction;
    }

    // Collision resolve
    if (Math.abs(runner.x - ball.x) < ball.radius + 6) {
        if (runner.x < ball.x) {
            ball.x += 1;
            runner.x -= 1;
        } else {
            ball.x -= 1;
            runner.x += 1;
        }
    }

    const footZoneLeft = runner.x - 10;
    const footZoneRight = runner.x + 10;
    const inFootZone = ball.x > footZoneLeft && ball.x < footZoneRight;

    if (inFootZone && Math.abs(ball.y - runner.y) < 20 && runner.kickReady) {
        ball.vx = (10 + Math.random() * 3) * runner.direction;
        ball.vy = -6;
        runner.cooldown = 20;
        runner.retreating = true;
        runner.lastKickX = runner.x;
        runner.kickReady = false;

        // Knockback effect after kick
        runner.x -= 20 * runner.direction;
    }

    if (!inFootZone) {
        runner.kickReady = true;
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
