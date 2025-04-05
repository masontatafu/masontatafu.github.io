
const canvas = document.getElementById('stickCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = 220;

let ball = {
    x: 150,
    y: 190,
    vx: 0,
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
    frame: 0,
    cooldown: 0,
    lastKickX: null,
    retreating: false,
    kickReady: true,
    isKicking: false,
    kickFrameCounter: 0
};

function drawStickFigure(x, y, frame, dir) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(dir, 1);

    if (runner.isKicking) {
        // Kick pose
        ctx.beginPath();
        ctx.arc(0, -30, 8, 0, Math.PI * 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, -22);
        ctx.lineTo(0, 10);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, -18);
        ctx.lineTo(-12, 0);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, -18);
        ctx.lineTo(20, 2); // Extended kick leg
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, 10);
        ctx.lineTo(-8, 30);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, 10);
        ctx.lineTo(6, 30);
        ctx.stroke();
    } else {
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
    }

    ctx.restore();
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#000";
    ctx.fill();
    ctx.closePath();
}

function updateBall() {
    ball.vy += ball.gravity;
    ball.vx *= 0.993;
    ball.x += ball.vx;
    ball.y += ball.vy;

    if (ball.y + ball.radius > canvas.height) {
        ball.y = canvas.height - ball.radius;
        ball.vy *= -ball.bounce;
    }

    if (ball.x + ball.radius >= canvas.width || ball.x - ball.radius <= 0) {
        ball.vx *= -1;
    }

    ball.x = Math.max(ball.radius, Math.min(canvas.width - ball.radius, ball.x));
}

function updateRunner() {
    if (runner.isKicking) {
        runner.kickFrameCounter++;
        if (runner.kickFrameCounter >= 6) {
            runner.isKicking = false;
            runner.kickFrameCounter = 0;
        }
        return;
    }

    runner.frame++;

    if (runner.cooldown > 0) {
        runner.cooldown--;
        return;
    }

    const dx = ball.x - runner.x;
    const dy = ball.y - runner.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Force retreat if too close
    if (distance < 15 && !runner.retreating) {
        runner.retreating = true;
        runner.x -= 40 * runner.direction;
        return;
    }

    // Retreat behavior
    if (runner.retreating) {
        runner.x -= 2 * runner.direction;
        if (Math.abs(runner.x - ball.x) > 60) {
            runner.retreating = false;
        }
        return;
    }

    // Approach ball
    if (distance > 20) {
        runner.direction = dx > 0 ? 1 : -1;
        runner.x += runner.speed * runner.direction;
    }

    // Kick logic (only if not too close)
    if (distance >= 20 && distance <= 35 && runner.kickReady) {
        runner.isKicking = true;
        runner.kickFrameCounter = 0;

        ball.vx = 12 * runner.direction;
        ball.vy = -5;

        runner.cooldown = 15;
        runner.kickReady = false;
    }

    // Reset kick readiness
    if (distance > 40) {
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
