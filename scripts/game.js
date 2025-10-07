const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");
const scoreNode = document.getElementById("score");

const GAME_WIDTH = canvas.width;
const GAME_HEIGHT = canvas.height;
const SKY_GRADIENT = ctx.createLinearGradient(0, 0, 0, GAME_HEIGHT);
SKY_GRADIENT.addColorStop(0, "#70c6ff");
SKY_GRADIENT.addColorStop(0.6, "#acf0ff");
SKY_GRADIENT.addColorStop(1, "#d0f6ff");

const plane = {
  x: GAME_WIDTH * 0.22,
  y: GAME_HEIGHT * 0.5,
  width: 58,
  height: 42,
  velocity: 0,
  rotation: 0,
};

const physics = {
  gravity: 1350,
  thrust: -420,
  maxFallSpeed: 680,
};

const pipes = [];
const pipeSettings = {
  gapMin: 150,
  gapMax: 210,
  width: 90,
  speed: 220,
  spawnInterval: 1450,
};

const state = {
  mode: "ready", // ready | running | gameover
  lastTime: 0,
  timeSincePipe: 0,
  score: 0,
  readyTick: 0,
};

function resetGame() {
  pipes.length = 0;
  plane.y = GAME_HEIGHT * 0.5;
  plane.velocity = 0;
  plane.rotation = 0;
  state.mode = "ready";
  state.timeSincePipe = pipeSettings.spawnInterval;
  state.score = 0;
  state.lastTime = 0;
  state.readyTick = 0;
  scoreNode.textContent = state.score.toString();
  startButton.hidden = false;
  startButton.disabled = false;
  restartButton.hidden = true;
  canvas.focus();
}

function startGame({ autoLaunch = false } = {}) {
  resetGame();
  if (autoLaunch) {
    state.mode = "running";
    startButton.hidden = true;
    plane.velocity = physics.thrust;
  }
}

function endGame() {
  if (state.mode === "gameover") {
    return;
  }
  state.mode = "gameover";
  restartButton.hidden = false;
  startButton.hidden = true;
  restartButton.focus({ preventScroll: true });
}

function createPipe() {
  const gapSize = randomRange(pipeSettings.gapMin, pipeSettings.gapMax);
  const gapCenter = randomRange(gapSize * 0.5 + 70, GAME_HEIGHT - gapSize * 0.5 - 90);

  pipes.push({
    x: GAME_WIDTH + pipeSettings.width,
    gapTop: gapCenter - gapSize * 0.5,
    gapBottom: gapCenter + gapSize * 0.5,
    width: pipeSettings.width,
    scored: false,
  });
}

function update(delta) {
  if (state.mode !== "running") {
    if (state.mode === "ready") {
      state.readyTick += delta;
      plane.rotation = Math.sin(state.readyTick * 0.004) * 0.12;
      plane.y = GAME_HEIGHT * 0.5 + Math.sin(state.readyTick * 0.003) * 14;
    }
    return;
  }

  const dt = Math.min(delta, 32) / 1000; // clamp to avoid big jumps on focus return

  plane.velocity += physics.gravity * dt;
  plane.velocity = Math.min(plane.velocity, physics.maxFallSpeed);
  plane.y += plane.velocity * dt;
  plane.rotation = clamp(plane.velocity / physics.maxFallSpeed, -0.6, 0.8);

  state.timeSincePipe += delta;
  if (state.timeSincePipe >= pipeSettings.spawnInterval) {
    createPipe();
    state.timeSincePipe = 0;
  }

  for (const pipe of pipes) {
    pipe.x -= pipeSettings.speed * dt;

    if (!pipe.scored && pipe.x + pipe.width < plane.x) {
      pipe.scored = true;
      state.score += 1;
      scoreNode.textContent = state.score.toString();
    }
  }

  while (pipes.length && pipes[0].x + pipes[0].width < -140) {
    pipes.shift();
  }

  const planeRadiusX = plane.width * 0.35;
  const planeRadiusY = plane.height * 0.35;

  if (plane.y + planeRadiusY >= GAME_HEIGHT) {
    endGame();
    return;
  }

  if (plane.y - planeRadiusY <= 0) {
    plane.y = planeRadiusY;
    plane.velocity = 0;
  }

  for (const pipe of pipes) {
    const planeLeft = plane.x - planeRadiusX;
    const planeRight = plane.x + planeRadiusX;

    const pipeLeft = pipe.x;
    const pipeRight = pipe.x + pipe.width;

    if (planeRight < pipeLeft || planeLeft > pipeRight) {
      continue;
    }

    const planeTop = plane.y - planeRadiusY;
    const planeBottom = plane.y + planeRadiusY;

    if (planeTop < pipe.gapTop || planeBottom > pipe.gapBottom) {
      endGame();
      return;
    }
  }
}

function drawBackground() {
  ctx.fillStyle = SKY_GRADIENT;
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  const hillHeight = 120;
  ctx.fillStyle = "#71c574";
  ctx.beginPath();
  ctx.moveTo(0, GAME_HEIGHT);
  ctx.lineTo(0, GAME_HEIGHT - hillHeight);
  ctx.quadraticCurveTo(GAME_WIDTH * 0.4, GAME_HEIGHT - hillHeight - 40, GAME_WIDTH * 0.6, GAME_HEIGHT - hillHeight + 8);
  ctx.quadraticCurveTo(GAME_WIDTH * 0.85, GAME_HEIGHT, GAME_WIDTH, GAME_HEIGHT - hillHeight + 36);
  ctx.lineTo(GAME_WIDTH, GAME_HEIGHT);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "rgba(255, 255, 255, 0.65)";
  const cloudCount = 5;
  for (let i = 0; i < cloudCount; i++) {
    const scroll = (state.lastTime * 0.04 + i * 180) % (GAME_WIDTH + 200);
    const baseX = scroll - 200;
    const baseY = 90 + Math.sin(state.lastTime * 0.002 + i) * 16;
    drawCloud(baseX, baseY, 0.7 + (i % 3) * 0.18);
  }
}

function drawCloud(x, y, scale) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.beginPath();
  ctx.arc(0, 0, 32, Math.PI * 0.5, Math.PI * 1.5);
  ctx.arc(24, -22, 36, Math.PI, Math.PI * 1.85);
  ctx.arc(60, -12, 30, Math.PI * 1.1, Math.PI * 1.9);
  ctx.arc(84, 12, 28, Math.PI * 1.2, Math.PI * 1.85);
  ctx.arc(58, 28, 24, Math.PI * 1.5, Math.PI * 0.5, true);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawPipes() {
  for (const pipe of pipes) {
    const topHeight = pipe.gapTop;
    const bottomY = pipe.gapBottom;
    const bottomHeight = GAME_HEIGHT - bottomY;

    ctx.fillStyle = "#d9e6fb";
    ctx.fillRect(pipe.x, 0, pipe.width, topHeight);
    ctx.fillRect(pipe.x, bottomY, pipe.width, bottomHeight);

    drawCloudCap(pipe.x, topHeight, pipe.width, true);
    drawCloudCap(pipe.x, bottomY, pipe.width, false);

    ctx.fillStyle = "rgba(83, 105, 141, 0.25)";
    ctx.fillRect(pipe.x + pipe.width - 10, 0, 10, topHeight);
    ctx.fillRect(pipe.x + pipe.width - 10, bottomY, 10, bottomHeight);
  }
}

function drawCloudCap(x, y, width, isTop) {
  ctx.save();
  ctx.translate(x, y);
  if (isTop) {
    ctx.scale(1, -1);
  }

  ctx.fillStyle = "#ecf4ff";
  ctx.beginPath();
  ctx.arc(width * 0.2, 0, width * 0.28, Math.PI, Math.PI * 2);
  ctx.arc(width * 0.5, -12, width * 0.34, Math.PI, Math.PI * 2);
  ctx.arc(width * 0.8, 0, width * 0.24, Math.PI, Math.PI * 2);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

function drawPlane() {
  ctx.save();
  ctx.translate(plane.x, plane.y);
  ctx.rotate(plane.rotation);

  ctx.fillStyle = "#f6f7fb";
  ctx.strokeStyle = "#2e3c5d";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-30, 0);
  ctx.quadraticCurveTo(10, -14, 26, -4);
  ctx.quadraticCurveTo(22, 6, -30, 8);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#ed7352";
  ctx.beginPath();
  ctx.moveTo(-12, -8);
  ctx.lineTo(2, -28);
  ctx.lineTo(18, -18);
  ctx.lineTo(4, -6);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(-10, 10);
  ctx.lineTo(6, 26);
  ctx.lineTo(22, 16);
  ctx.lineTo(6, 6);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#5ba0d0";
  ctx.beginPath();
  ctx.arc(8, -2, 10, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawReadyOverlay() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.14)";
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 28px 'Segoe UI', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Tekan untuk terbang!", GAME_WIDTH / 2, GAME_HEIGHT * 0.42);
  ctx.font = "20px 'Segoe UI', sans-serif";
  ctx.fillText("Tahan klik atau spasi", GAME_WIDTH / 2, GAME_HEIGHT * 0.48);
}

function drawGameOverOverlay() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.font = "bold 30px 'Segoe UI', sans-serif";
  ctx.fillText("Game Over", GAME_WIDTH / 2, GAME_HEIGHT * 0.4);
  ctx.font = "22px 'Segoe UI', sans-serif";
  ctx.fillText(`Skor: ${state.score}`, GAME_WIDTH / 2, GAME_HEIGHT * 0.48);
  ctx.fillText("Klik Ulangi atau tekan R", GAME_WIDTH / 2, GAME_HEIGHT * 0.54);
}

function flap() {
  if (state.mode === "ready") {
    state.mode = "running";
    startButton.hidden = true;
    restartButton.hidden = true;
    plane.velocity = physics.thrust;
    return;
  }

  if (state.mode !== "running") {
    return;
  }

  plane.velocity = physics.thrust;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}

function loop(timestamp) {
  if (!state.lastTime) {
    state.lastTime = timestamp;
  }
  const delta = timestamp - state.lastTime;
  state.lastTime = timestamp;

  update(delta);

  ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
  drawBackground();
  drawPipes();
  drawPlane();

  if (state.mode === "ready") {
    drawReadyOverlay();
  } else if (state.mode === "gameover") {
    drawGameOverOverlay();
  }

  requestAnimationFrame(loop);
}

startButton.addEventListener("click", () => {
  startGame({ autoLaunch: true });
});

restartButton.addEventListener("click", () => {
  startGame({ autoLaunch: true });
});

canvas.addEventListener("pointerdown", () => {
  flap();
});

window.addEventListener("keydown", (event) => {
  if (event.code === "Space" || event.code === "ArrowUp") {
    event.preventDefault();
    flap();
  }

  if (event.code === "KeyR" && state.mode === "gameover") {
    startGame({ autoLaunch: true });
  }
});

window.addEventListener("blur", () => {
  if (state.mode === "running") {
    plane.velocity = Math.min(plane.velocity, 120);
  }
});

resetGame();
requestAnimationFrame(loop);
