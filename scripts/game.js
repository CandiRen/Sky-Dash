const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");
const scoreNode = document.getElementById("score");
const planeMenuToggle = document.getElementById("planeMenuToggle");
const planeMenuOverlay = document.getElementById("planeMenuOverlay");
const planeGrid = document.getElementById("planeGrid");
const closePlaneMenu = document.getElementById("closePlaneMenu");

const GAME_WIDTH = canvas.width;
const GAME_HEIGHT = canvas.height;
const SKY_GRADIENT = ctx.createLinearGradient(0, 0, 0, GAME_HEIGHT);
SKY_GRADIENT.addColorStop(0, "#70c6ff");
SKY_GRADIENT.addColorStop(0.6, "#acf0ff");
SKY_GRADIENT.addColorStop(1, "#d0f6ff");

const PLANE_HITBOX = {
  width: 128,
  height: 48,
};

const planeDefinitions = [
  {
    id: "aurora-blue",
    airframe: "jet",
    name: "Aurora Blue",
    description: "Warna biru laut dengan ekor aqua",
    palette: {
      outline: "#082036",
      fuselage: "#ffffff",
      belly: "#14708c",
      tail: "#1a5476",
      farWing: "#0f3248",
      window: "#082036",
      engine: "#ffffff",
      engineCore: "#14708c",
    },
  },
  {
    id: "crimson-jet",
    airframe: "jet",
    name: "Crimson Jet",
    description: "Livery merah mencolok",
    palette: {
      outline: "#320f1f",
      fuselage: "#fff4f4",
      belly: "#d94343",
      tail: "#7c1428",
      farWing: "#4a0d19",
      window: "#320f1f",
      engine: "#fff4f4",
      engineCore: "#d94343",
    },
  },
  {
    id: "emerald-breeze",
    airframe: "prop",
    name: "Emerald Breeze",
    description: "Hijau zamrud yang segar",
    palette: {
      outline: "#0f2c23",
      fuselage: "#f8fffb",
      belly: "#1ea87a",
      tail: "#127c58",
      farWing: "#0e4735",
      window: "#0f2c23",
      engine: "#f8fffb",
      engineCore: "#1ea87a",
    },
  },
  {
    id: "sunrise-gold",
    airframe: "prop",
    name: "Sunrise Gold",
    description: "Gradasi jingga keemasan",
    palette: {
      outline: "#3a1b0f",
      fuselage: "#fffdf6",
      belly: "#f39c27",
      tail: "#d6711a",
      farWing: "#542b11",
      window: "#3a1b0f",
      engine: "#fff7e2",
      engineCore: "#f39c27",
    },
  },
  {
    id: "midnight-storm",
    airframe: "stealth",
    name: "Midnight Storm",
    description: "Gelap elegan dengan aksen biru",
    palette: {
      outline: "#050d1a",
      fuselage: "#f0f4ff",
      belly: "#173f82",
      tail: "#0b2858",
      farWing: "#071839",
      window: "#050d1a",
      engine: "#f0f4ff",
      engineCore: "#173f82",
    },
  },
  {
    id: "arctic-frost",
    airframe: "jet",
    name: "Arctic Frost",
    description: "Biru muda es dengan ekor putih",
    palette: {
      outline: "#123041",
      fuselage: "#ffffff",
      belly: "#7bd0ff",
      tail: "#2e6f9d",
      farWing: "#124561",
      window: "#123041",
      engine: "#ffffff",
      engineCore: "#7bd0ff",
    },
  },
  {
    id: "tropic-coral",
    airframe: "prop",
    name: "Tropic Coral",
    description: "Coral dan biru laut tropis",
    palette: {
      outline: "#3a1f29",
      fuselage: "#fff9f6",
      belly: "#ff7660",
      tail: "#dd3d3a",
      farWing: "#5a1c2d",
      window: "#2a1116",
      engine: "#fff9f6",
      engineCore: "#ff7660",
    },
  },
  {
    id: "galaxy-violet",
    airframe: "jet",
    name: "Galaxy Violet",
    description: "Ungu lembut dengan belly biru tua",
    palette: {
      outline: "#1d0f2d",
      fuselage: "#f5f2ff",
      belly: "#6c4ddc",
      tail: "#472a9d",
      farWing: "#28134f",
      window: "#1d0f2d",
      engine: "#f5f2ff",
      engineCore: "#6c4ddc",
    },
  },
  {
    id: "sahara-sand",
    airframe: "prop",
    name: "Sahara Sand",
    description: "Tone pasir hangat",
    palette: {
      outline: "#3a2714",
      fuselage: "#fffaf2",
      belly: "#d4a46a",
      tail: "#a9783e",
      farWing: "#55381e",
      window: "#3a2714",
      engine: "#fff4de",
      engineCore: "#d4a46a",
    },
  },
  {
    id: "neon-mint",
    airframe: "jet",
    name: "Neon Mint",
    description: "Mint segar dengan kontras gelap",
    palette: {
      outline: "#05252a",
      fuselage: "#f4fffb",
      belly: "#1dd3a7",
      tail: "#0a9880",
      farWing: "#06473f",
      window: "#05252a",
      engine: "#f4fffb",
      engineCore: "#1dd3a7",
    },
  },
  {
    id: "cinder-ember",
    airframe: "stealth",
    name: "Cinder Ember",
    description: "Hitam arang dengan belly merah",
    palette: {
      outline: "#0a0a0a",
      fuselage: "#f4f4f4",
      belly: "#c63b30",
      tail: "#76211c",
      farWing: "#1e1e1e",
      window: "#0a0a0a",
      engine: "#f4f4f4",
      engineCore: "#c63b30",
    },
  },
  {
    id: "copper-trail",
    airframe: "prop",
    name: "Copper Trail",
    description: "Perpaduan tembaga dan krem",
    palette: {
      outline: "#2a150c",
      fuselage: "#fff7f0",
      belly: "#c2753b",
      tail: "#8f4a1c",
      farWing: "#4d2813",
      window: "#2a150c",
      engine: "#fff7f0",
      engineCore: "#c2753b",
    },
  },
  {
    id: "oceanic-deep",
    airframe: "jet",
    name: "Oceanic Deep",
    description: "Biru laut pekat",
    palette: {
      outline: "#05162e",
      fuselage: "#f2f8ff",
      belly: "#1d5fb8",
      tail: "#0f3674",
      farWing: "#0a1f46",
      window: "#05162e",
      engine: "#f2f8ff",
      engineCore: "#1d5fb8",
    },
  },
  {
    id: "solar-flare",
    airframe: "jet",
    name: "Solar Flare",
    description: "Oranye terang dengan ekor merah",
    palette: {
      outline: "#33130f",
      fuselage: "#fff9f3",
      belly: "#ff7b2f",
      tail: "#d13a16",
      farWing: "#5b1c11",
      window: "#33130f",
      engine: "#fff9f3",
      engineCore: "#ff7b2f",
    },
  },
  {
    id: "jade-wing",
    airframe: "prop",
    name: "Jade Wing",
    description: "Hijau giok minimalis",
    palette: {
      outline: "#082521",
      fuselage: "#f5fffb",
      belly: "#1d9c74",
      tail: "#0f6e4f",
      farWing: "#0a4b39",
      window: "#082521",
      engine: "#f5fffb",
      engineCore: "#1d9c74",
    },
  },
  {
    id: "berry-cloud",
    airframe: "jet",
    name: "Berry Cloud",
    description: "Perpaduan ungu & pink",
    palette: {
      outline: "#2a143a",
      fuselage: "#fef6ff",
      belly: "#c163e6",
      tail: "#8e2ebb",
      farWing: "#3f1a59",
      window: "#2a143a",
      engine: "#fef6ff",
      engineCore: "#c163e6",
    },
  },
  {
    id: "nimbus-silver",
    airframe: "stealth",
    name: "Nimbus Silver",
    description: "Abu elegan dengan aksen biru",
    palette: {
      outline: "#1b2430",
      fuselage: "#f7f7f9",
      belly: "#6d7e9c",
      tail: "#3a4c68",
      farWing: "#252f40",
      window: "#1b2430",
      engine: "#f7f7f9",
      engineCore: "#6d7e9c",
    },
  },
  {
    id: "lagoon-teal",
    airframe: "prop",
    name: "Lagoon Teal",
    description: "Teal kaya dengan ekor biru",
    palette: {
      outline: "#0b2131",
      fuselage: "#f4fbff",
      belly: "#1e9db7",
      tail: "#126782",
      farWing: "#0c4256",
      window: "#0b2131",
      engine: "#f4fbff",
      engineCore: "#1e9db7",
    },
  },
  {
    id: "cobalt-dash",
    airframe: "jet",
    name: "Cobalt Dash",
    description: "Cobalt tegas dengan ekor putih",
    palette: {
      outline: "#051833",
      fuselage: "#ffffff",
      belly: "#1c54d1",
      tail: "#0c2f7a",
      farWing: "#0a1f4f",
      window: "#051833",
      engine: "#ffffff",
      engineCore: "#1c54d1",
    },
  },
  {
    id: "amber-horizon",
    airframe: "prop",
    name: "Amber Horizon",
    description: "Amber dan krem senja",
    palette: {
      outline: "#3c200e",
      fuselage: "#fff6ec",
      belly: "#d98231",
      tail: "#a65517",
      farWing: "#542d13",
      window: "#321a0b",
      engine: "#fff6ec",
      engineCore: "#d98231",
    },
  },
  {
    id: "onyx-ice",
    airframe: "stealth",
    name: "Onyx Ice",
    description: "Hitam-putih dengan belly biru muda",
    palette: {
      outline: "#04090f",
      fuselage: "#fefefe",
      belly: "#6fb0ff",
      tail: "#2d4f9c",
      farWing: "#182a4f",
      window: "#04090f",
      engine: "#fefefe",
      engineCore: "#6fb0ff",
    },
  },
  {
    id: "violet-sky",
    airframe: "stealth",
    name: "Violet Sky",
    description: "Violet pastel dan biru muda",
    palette: {
      outline: "#1c1236",
      fuselage: "#f6f2ff",
      belly: "#8470ff",
      tail: "#5a46c7",
      farWing: "#2f1f77",
      window: "#1c1236",
      engine: "#f6f2ff",
      engineCore: "#8470ff",
    },
  },
];

const airframeLabels = {
  jet: "Jet",
  prop: "Propeler",
  stealth: "Stealth",
};

let planeDefinition = planeDefinitions[0];

const plane = {
  x: GAME_WIDTH * 0.22,
  y: GAME_HEIGHT * 0.5,
  width: PLANE_HITBOX.width,
  height: PLANE_HITBOX.height,
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

const skylineLayers = [
  {
    color: "#4c6f99",
    accent: "#3b597d",
    roof: "#5b82ad",
    windowColor: "rgba(255, 255, 255, 0.18)",
    baseLine: GAME_HEIGHT - 200,
    minHeight: 120,
    maxHeight: 190,
    speed: 12,
    width: 62,
    gap: 24,
    windowSpacingX: 14,
    windowSpacingY: 18,
    patternCount: 8,
  },
  {
    color: "#395676",
    accent: "#2a425a",
    roof: "#446184",
    windowColor: "rgba(255, 235, 190, 0.28)",
    baseLine: GAME_HEIGHT - 130,
    minHeight: 160,
    maxHeight: 240,
    speed: 20,
    width: 74,
    gap: 20,
    windowSpacingX: 16,
    windowSpacingY: 20,
    patternCount: 10,
  },
  {
    color: "#22364b",
    accent: "#182636",
    roof: "#2e4a66",
    windowColor: "rgba(255, 220, 140, 0.45)",
    baseLine: GAME_HEIGHT - 52,
    minHeight: 190,
    maxHeight: 280,
    speed: 34,
    width: 84,
    gap: 18,
    windowSpacingX: 18,
    windowSpacingY: 22,
    patternCount: 12,
  },
];

const skylinePatterns = skylineLayers.map((layer, index) => createSkylinePattern(layer, index));

const state = {
  mode: "ready",
  lastTime: 0,
  timeSincePipe: 0,
  score: 0,
  readyTick: 0,
  selectedPlaneIndex: 0,
};

const inputState = {
  isPointerDown: false,
};

function applyPlaneDefinition(index) {
  if (!planeDefinitions[index]) {
    return;
  }
  planeDefinition = planeDefinitions[index];
  plane.width = PLANE_HITBOX.width;
  plane.height = PLANE_HITBOX.height;
  plane.rotation = 0;
  state.selectedPlaneIndex = index;
  updatePlaneMenuSelection();
}

function createPlaneMenu() {
  planeGrid.innerHTML = "";
  planeDefinitions.forEach((def, index) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "plane-card";
    card.dataset.index = index;
    const palette = def.palette;
    const typeLabel = airframeLabels[def.airframe] || def.airframe;
    card.innerHTML = `
      <span class="plane-preview" data-airframe="${def.airframe}" style="--plane-top:${palette.fuselage}; --plane-belly:${palette.belly}; --plane-outline:${palette.outline}; --plane-detail:${palette.engine || palette.belly}; --plane-window:${palette.window || palette.outline}"></span>
      <strong>${def.name}</strong>
      <span class="plane-tag">${typeLabel}</span>
      <span class="caption">${def.description}</span>
    `;
    card.addEventListener("click", () => {
      if (state.selectedPlaneIndex !== index) {
        applyPlaneDefinition(index);
        resetGame();
      }
      hidePlaneMenu();
    });
    planeGrid.appendChild(card);
  });
  updatePlaneMenuSelection();
}

function updatePlaneMenuSelection() {
  if (!planeGrid) {
    return;
  }
  planeGrid.querySelectorAll(".plane-card").forEach((card) => {
    const idx = Number(card.dataset.index);
    card.classList.toggle("active", idx === state.selectedPlaneIndex);
  });
}

function showPlaneMenu() {
  planeMenuOverlay.hidden = false;
}

function hidePlaneMenu() {
  planeMenuOverlay.hidden = true;
}

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
    styleIndex: Math.floor(Math.random() * obstacleStyles.length),
    windowSeed: Math.random() * 1000,
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

  const dt = Math.min(delta, 32) / 1000;

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

  const planeRadiusX = plane.width * 0.27;
  const planeRadiusY = plane.height * 0.44;

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

  ctx.fillStyle = "rgba(255, 255, 255, 0.65)";
  const cloudCount = 5;
  for (let i = 0; i < cloudCount; i++) {
    const scroll = (state.lastTime * 0.04 + i * 180) % (GAME_WIDTH + 200);
    const baseX = scroll - 200;
    const baseY = 90 + Math.sin(state.lastTime * 0.002 + i) * 16;
    drawCloud(baseX, baseY, 0.7 + (i % 3) * 0.18);
  }

  for (let i = 0; i < skylineLayers.length; i++) {
    drawSkylineLayer(skylineLayers[i], skylinePatterns[i]);
  }

  drawStreetLevel();
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

function drawSkylineLayer(layer, pattern) {
  const spacing = layer.width + layer.gap;
  const totalPatternWidth = pattern.length * spacing;
  const offset = (state.lastTime * 0.001 * layer.speed) % totalPatternWidth;

  let x = -offset;
  let index = 0;
  while (x < GAME_WIDTH + spacing) {
    const building = pattern[index % pattern.length];
    const height = building.height;
    const topY = layer.baseLine - height;
    const rightShadeWidth = Math.max(6, layer.width * 0.16);

    ctx.fillStyle = layer.color;
    ctx.fillRect(x, topY, layer.width, height);

    ctx.fillStyle = layer.accent;
    ctx.fillRect(x + layer.width - rightShadeWidth, topY, rightShadeWidth, height);

    drawBuildingWindows(x, topY, height, layer, building);
    drawRoofDetail(x, topY, layer, building);

    x += spacing;
    index += 1;
  }
}

function drawBuildingWindows(x, topY, height, layer, building) {
  if (!layer.windowColor) {
    return;
  }

  const startX = x + 6;
  const startY = topY + 10;
  const usableWidth = layer.width - 12;
  const usableHeight = height - 18;

  if (usableWidth <= 0 || usableHeight <= 0) {
    return;
  }

  const cols = Math.max(1, Math.floor(usableWidth / layer.windowSpacingX));
  const rows = Math.max(1, Math.floor(usableHeight / layer.windowSpacingY));
  const windowWidth = Math.min(8, layer.windowSpacingX - 4);
  const windowHeight = Math.min(10, layer.windowSpacingY - 6);

  ctx.fillStyle = layer.windowColor;

  for (let row = 0; row < rows; row++) {
    const y = startY + row * layer.windowSpacingY;
    for (let col = 0; col < cols; col++) {
      const xOffset = startX + col * layer.windowSpacingX;
      const lightSeed = building.seed + row * 13 + col * 17;
      if (seededRandom(lightSeed) > 0.55) {
        continue;
      }
      ctx.fillRect(xOffset, y, windowWidth, windowHeight);
    }
  }
}

function drawRoofDetail(x, topY, layer, building) {
  ctx.fillStyle = layer.roof;

  if (building.roofStyle === "slant") {
    ctx.beginPath();
    ctx.moveTo(x, topY + 4);
    ctx.lineTo(x + layer.width * 0.55, topY - layer.width * 0.16);
    ctx.lineTo(x + layer.width, topY + 4);
    ctx.closePath();
    ctx.fill();
  } else if (building.roofStyle === "antenna") {
    ctx.fillRect(x, topY - 4, layer.width, 4);
    ctx.fillRect(x + layer.width * 0.48, topY - 24, layer.width * 0.04, 20);
    ctx.beginPath();
    ctx.arc(x + layer.width * 0.5, topY - 26, 3, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.fillRect(x, topY - 3, layer.width, 3);
  }
}

function drawStreetLevel() {
  const streetHeight = 40;
  ctx.fillStyle = "#111a27";
  ctx.fillRect(0, GAME_HEIGHT - streetHeight, GAME_WIDTH, streetHeight);

  ctx.fillStyle = "#1d2a3b";
  ctx.fillRect(0, GAME_HEIGHT - streetHeight - 6, GAME_WIDTH, 6);

  ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
  ctx.fillRect(0, GAME_HEIGHT - streetHeight, GAME_WIDTH, 4);

  ctx.fillStyle = "rgba(255, 255, 255, 0.18)";
  const dashWidth = 34;
  const dashGap = 22;
  const travel = (state.lastTime * 0.12) % (dashWidth + dashGap);
  for (let x = -dashWidth; x < GAME_WIDTH + dashWidth; x += dashWidth + dashGap) {
    ctx.fillRect(x + travel, GAME_HEIGHT - streetHeight / 2 - 2, dashWidth, 4);
  }
}

function drawObstacleBuilding(x, startY, width, height, isTop, style, seed) {
  if (height <= 0) {
    return;
  }

  ctx.save();
  ctx.translate(x, startY);
  const bodyY = isTop ? -height : 0;
  const accentWidth = Math.max(6, width * 0.16);

  ctx.fillStyle = style.body;
  ctx.fillRect(0, bodyY, width, height);

  const facadeGradient = ctx.createLinearGradient(0, bodyY, width, bodyY + height);
  facadeGradient.addColorStop(0, "rgba(255, 255, 255, 0.08)");
  facadeGradient.addColorStop(0.45, "rgba(255, 255, 255, 0.1)");
  facadeGradient.addColorStop(1, "rgba(0, 0, 0, 0.12)");
  ctx.fillStyle = facadeGradient;
  ctx.fillRect(0, bodyY, width, height);

  drawObstacleWindows(width, height, bodyY, style.window, seed, accentWidth);
  drawObstacleGlassSheen(width, height, bodyY, style.highlight, isTop, accentWidth);

  ctx.fillStyle = style.accent;
  ctx.fillRect(width - accentWidth, bodyY, accentWidth, height);

  drawObstacleRoof(width, bodyY, isTop, style.roof);

  ctx.restore();
}

const obstacleStyles = [
  {
    body: "#1f3652",
    accent: "#142336",
    roof: "#2d4d70",
    window: "rgba(170, 214, 255, 0.82)",
    highlight: "rgba(255, 255, 255, 0.25)",
  },
  {
    body: "#1c3a55",
    accent: "#13283a",
    roof: "#33597c",
    window: "rgba(150, 210, 255, 0.78)",
    highlight: "rgba(255, 255, 255, 0.22)",
  },
  {
    body: "#233c5f",
    accent: "#162949",
    roof: "#3b6289",
    window: "rgba(180, 230, 255, 0.8)",
    highlight: "rgba(255, 255, 255, 0.28)",
  },
  {
    body: "#19314a",
    accent: "#102136",
    roof: "#2a4a68",
    window: "rgba(140, 200, 240, 0.76)",
    highlight: "rgba(255, 255, 255, 0.2)",
  },
];

function drawObstacleWindows(width, height, bodyY, windowColor, seed, accentWidth) {
  const leftMargin = Math.max(4, width * 0.08);
  const rightMargin = Math.max(8, accentWidth + 6);
  const topMargin = 14;
  const bottomMargin = 18;
  const windowWidth = Math.max(6, Math.min(12, width * 0.18));
  const windowHeight = Math.max(8, Math.min(18, windowWidth * 1.4));
  const spacingX = windowWidth + 6;
  const spacingY = windowHeight + 8;
  const startY = bodyY + topMargin;
  const maxY = bodyY + height - bottomMargin - windowHeight;
  const maxX = width - rightMargin - windowWidth;

  if (leftMargin > maxX || startY > maxY) {
    return;
  }

  let noiseIndex = 0;
  for (let y = startY; y <= maxY; y += spacingY) {
    for (let x = leftMargin; x <= maxX; x += spacingX) {
      const flicker = seededRandom(seed + noiseIndex * 0.71);
      const glow = flicker > 0.82;
      const dim = flicker < 0.16;

      ctx.fillStyle = windowColor;
      ctx.fillRect(x, y, windowWidth, windowHeight);

      if (glow) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.38)";
        ctx.fillRect(x, y, windowWidth, windowHeight);
      } else if (dim) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.24)";
        ctx.fillRect(x, y, windowWidth, windowHeight);
      }

      ctx.fillStyle = "rgba(255, 255, 255, 0.18)";
      ctx.fillRect(x + windowWidth * 0.12, y + 1, windowWidth * 0.32, 2);
      ctx.fillRect(x + windowWidth * 0.65, y + windowHeight * 0.55, windowWidth * 0.22, 2);

      noiseIndex += 1;
    }
  }
}

function drawObstacleGlassSheen(width, height, bodyY, highlightColor, isTop, accentWidth) {
  const facadeWidth = width - accentWidth;
  if (facadeWidth <= 0) {
    return;
  }

  ctx.save();
  ctx.beginPath();
  ctx.rect(0, bodyY, facadeWidth, height);
  ctx.clip();

  const sheenWidth = facadeWidth * 0.18;
  const sheenGradient = ctx.createLinearGradient(0, bodyY, sheenWidth, bodyY + height);
  sheenGradient.addColorStop(0, highlightColor);
  sheenGradient.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = sheenGradient;
  ctx.fillRect(0, bodyY, sheenWidth, height);

  ctx.globalAlpha = 0.12;
  const stripeWidth = facadeWidth * 0.65;
  for (let offset = -height * 1.2; offset < facadeWidth + height; offset += stripeWidth * 0.5) {
    ctx.beginPath();
    const topY = bodyY;
    const bottomY = bodyY + height;
    if (isTop) {
      ctx.moveTo(offset - stripeWidth * 0.4, topY);
      ctx.lineTo(offset + stripeWidth * 0.12, topY);
      ctx.lineTo(offset + stripeWidth * 0.35, bottomY);
      ctx.lineTo(offset - stripeWidth * 0.18, bottomY);
    } else {
      ctx.moveTo(offset - stripeWidth * 0.18, bottomY);
      ctx.lineTo(offset + stripeWidth * 0.35, bottomY);
      ctx.lineTo(offset + stripeWidth * 0.12, topY);
      ctx.lineTo(offset - stripeWidth * 0.4, topY);
    }
    ctx.closePath();
    ctx.fillStyle = highlightColor;
    ctx.fill();
  }

  ctx.restore();
}

function drawObstacleRoof(width, bodyY, isTop, roofColor) {
  ctx.fillStyle = roofColor;
  if (isTop) {
    ctx.fillRect(0, 0, width, 5);
    ctx.fillStyle = "rgba(0, 0, 0, 0.18)";
    ctx.fillRect(0, 3, width, 2);
  } else {
    ctx.beginPath();
    ctx.moveTo(0, bodyY);
    ctx.lineTo(width * 0.5, bodyY - 12);
    ctx.lineTo(width, bodyY);
    ctx.closePath();
    ctx.fill();
  }
}

function drawPipes() {
  for (const pipe of pipes) {
    const style = obstacleStyles[(pipe.styleIndex ?? 0) % obstacleStyles.length] || obstacleStyles[0];
    drawObstacleBuilding(pipe.x, pipe.gapTop, pipe.width, pipe.gapTop, true, style, pipe.windowSeed ?? 0);
    drawObstacleBuilding(pipe.x, pipe.gapBottom, pipe.width, GAME_HEIGHT - pipe.gapBottom, false, style, (pipe.windowSeed ?? 0) + 101);
  }
}

function drawJetAirframe(palette) {
  const outline = palette.outline;
  const fuselage = palette.fuselage;
  const belly = palette.belly;
  const tail = palette.tail;
  const farWing = palette.farWing || belly;
  const windowColor = palette.window || outline;
  const engineColor = palette.engine || fuselage;
  const engineCore = palette.engineCore || belly;

  // Far wings
  ctx.fillStyle = farWing;
  ctx.beginPath();
  ctx.moveTo(-28, -6);
  ctx.lineTo(8, -24);
  ctx.lineTo(-12, -26);
  ctx.lineTo(-42, -12);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(-40, 10);
  ctx.lineTo(6, 24);
  ctx.lineTo(-10, 26);
  ctx.lineTo(-52, 14);
  ctx.closePath();
  ctx.fill();

  // Tail and stabilizers
  ctx.fillStyle = tail;
  ctx.strokeStyle = outline;
  ctx.lineWidth = 1.3;
  ctx.beginPath();
  ctx.moveTo(-64, -5);
  ctx.lineTo(-86, -30);
  ctx.lineTo(-52, -18);
  ctx.lineTo(-50, -6);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(-54, -1);
  ctx.lineTo(-74, 2);
  ctx.lineTo(-48, 5);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(-56, -2);
  ctx.lineTo(-78, -4);
  ctx.lineTo(-48, -6);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Fuselage
  ctx.fillStyle = fuselage;
  ctx.strokeStyle = outline;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-70, -6);
  ctx.quadraticCurveTo(-38, -18, 54, -16);
  ctx.quadraticCurveTo(78, -8, 80, -2);
  ctx.lineTo(80, 2);
  ctx.quadraticCurveTo(78, 8, 54, 18);
  ctx.quadraticCurveTo(-38, 20, -70, 8);
  ctx.quadraticCurveTo(-80, 4, -80, 0);
  ctx.quadraticCurveTo(-80, -4, -70, -6);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Belly stripe
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(-70, -6);
  ctx.quadraticCurveTo(-38, -18, 54, -16);
  ctx.quadraticCurveTo(78, -8, 80, -2);
  ctx.lineTo(80, 20);
  ctx.lineTo(-82, 20);
  ctx.closePath();
  ctx.clip();
  ctx.fillStyle = belly;
  ctx.beginPath();
  ctx.moveTo(-66, 2);
  ctx.quadraticCurveTo(-18, 16, 48, 14);
  ctx.lineTo(54, 14);
  ctx.quadraticCurveTo(-12, 22, -74, 7);
  ctx.quadraticCurveTo(-76, 4, -76, 2);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Dorsal fin
  ctx.fillStyle = tail;
  ctx.strokeStyle = outline;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(-4, -8);
  ctx.lineTo(12, -28);
  ctx.lineTo(10, -6);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Underside accents
  ctx.fillStyle = belly;
  ctx.beginPath();
  ctx.moveTo(0, 2);
  ctx.lineTo(48, -18);
  ctx.lineTo(44, -6);
  ctx.lineTo(-2, 8);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(-36, 8);
  ctx.lineTo(14, 24);
  ctx.lineTo(10, 16);
  ctx.lineTo(-34, 6);
  ctx.closePath();
  ctx.fill();

  // Engine
  ctx.fillStyle = engineColor;
  ctx.strokeStyle = outline;
  ctx.lineWidth = 1.3;
  ctx.beginPath();
  ctx.ellipse(14, 12, 12, 7, 0.08, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = engineCore;
  ctx.beginPath();
  ctx.ellipse(17, 12, 7, 4.6, 0.08, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = outline;
  ctx.beginPath();
  ctx.ellipse(6, 12, 3.6, 3.2, 0, 0, Math.PI * 2);
  ctx.fill();

  // Near wings
  ctx.fillStyle = fuselage;
  ctx.strokeStyle = outline;
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(-8, 0);
  ctx.lineTo(32, -22);
  ctx.lineTo(52, -16);
  ctx.lineTo(6, 4);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(-24, 4);
  ctx.lineTo(30, 18);
  ctx.lineTo(12, 22);
  ctx.lineTo(-40, 10);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Winglets
  ctx.fillStyle = tail;
  ctx.beginPath();
  ctx.moveTo(52, -16);
  ctx.lineTo(60, -2);
  ctx.lineTo(46, -4);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(30, 18);
  ctx.lineTo(38, 6);
  ctx.lineTo(24, 8);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Cockpit windows
  ctx.fillStyle = windowColor;
  ctx.beginPath();
  ctx.moveTo(30, -6);
  ctx.quadraticCurveTo(44, -6, 50, -2);
  ctx.lineTo(32, -2);
  ctx.quadraticCurveTo(30, -4, 28, -4);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(26, -3);
  ctx.lineTo(30, -1);
  ctx.lineTo(24, -1);
  ctx.closePath();
  ctx.fill();

  // Passenger windows
  ctx.fillStyle = windowColor;
  const windowPositions = [-42, -36, -30, -24, -18, -12, -6, 0, 6, 12, 18, 24, 30];
  for (const wx of windowPositions) {
    ctx.fillRect(wx - 2.2, -3, 4.4, 5.4);
  }

  // Door outline
  ctx.lineWidth = 1.1;
  ctx.strokeStyle = outline;
  ctx.strokeRect(-28, -6, 6, 14);
}

function drawPropAirframe(palette) {
  const outline = palette.outline;
  const fuselage = palette.fuselage;
  const belly = palette.belly;
  const tail = palette.tail;
  const farWing = palette.farWing || belly;
  const windowColor = palette.window || outline;
  const engineColor = palette.engine || fuselage;
  const engineCore = palette.engineCore || belly;

  // Back wings for depth
  ctx.fillStyle = farWing;
  ctx.beginPath();
  ctx.moveTo(-52, -8);
  ctx.lineTo(6, -28);
  ctx.lineTo(-16, -30);
  ctx.lineTo(-70, -14);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(-56, 10);
  ctx.lineTo(4, 30);
  ctx.lineTo(-18, 32);
  ctx.lineTo(-74, 18);
  ctx.closePath();
  ctx.fill();

  // Tailplane
  ctx.fillStyle = tail;
  ctx.strokeStyle = outline;
  ctx.lineWidth = 1.3;
  ctx.beginPath();
  ctx.moveTo(-88, -6);
  ctx.lineTo(-116, -34);
  ctx.lineTo(-98, 10);
  ctx.lineTo(-84, 16);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Fuselage capsule
  ctx.fillStyle = fuselage;
  ctx.strokeStyle = outline;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-112, -10);
  ctx.quadraticCurveTo(-46, -34, 74, -10);
  ctx.quadraticCurveTo(92, -2, 92, 0);
  ctx.quadraticCurveTo(92, 2, 74, 10);
  ctx.quadraticCurveTo(-46, 34, -112, 12);
  ctx.quadraticCurveTo(-124, 6, -124, 0);
  ctx.quadraticCurveTo(-124, -6, -112, -10);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Belly striping
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(-112, -10);
  ctx.quadraticCurveTo(-46, -34, 74, -10);
  ctx.quadraticCurveTo(92, -2, 92, 0);
  ctx.quadraticCurveTo(92, 2, 74, 10);
  ctx.quadraticCurveTo(-46, 34, -112, 12);
  ctx.quadraticCurveTo(-124, 6, -124, 0);
  ctx.quadraticCurveTo(-124, -6, -112, -10);
  ctx.closePath();
  ctx.clip();
  ctx.fillStyle = belly;
  ctx.beginPath();
  ctx.moveTo(-102, 4);
  ctx.quadraticCurveTo(-54, 20, 70, 14);
  ctx.quadraticCurveTo(-24, 30, -114, 16);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Main wings
  ctx.fillStyle = fuselage;
  ctx.strokeStyle = outline;
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(-38, -6);
  ctx.lineTo(30, -20);
  ctx.lineTo(58, -12);
  ctx.lineTo(-12, 6);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(-50, 6);
  ctx.lineTo(26, 26);
  ctx.lineTo(-6, 32);
  ctx.lineTo(-72, 12);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Propeller hub and blades
  ctx.fillStyle = engineColor;
  ctx.strokeStyle = outline;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(92, 0, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.strokeStyle = engineCore;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(92, -18);
  ctx.lineTo(92, 18);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(70, 0);
  ctx.lineTo(114, 0);
  ctx.stroke();

  // Cockpit glazing
  ctx.fillStyle = windowColor;
  ctx.beginPath();
  ctx.moveTo(22, -6);
  ctx.quadraticCurveTo(46, -6, 60, -2);
  ctx.lineTo(22, -2);
  ctx.quadraticCurveTo(20, -4, 18, -4);
  ctx.closePath();
  ctx.fill();

  // Cabin windows
  const propWindows = [-78, -66, -54, -42, -30, -18, -6, 6];
  ctx.fillStyle = windowColor;
  for (const wx of propWindows) {
    ctx.fillRect(wx - 3, -4, 6, 6.2);
  }

  // Door outline
  ctx.strokeStyle = outline;
  ctx.lineWidth = 1;
  ctx.strokeRect(-56, -6, 6, 16);
}

function drawStealthAirframe(palette) {
  const outline = palette.outline;
  const fuselage = palette.fuselage;
  const belly = palette.belly;
  const tail = palette.tail;
  const farWing = palette.farWing || belly;
  const windowColor = palette.window || outline;
  const engineColor = palette.engine || fuselage;

  // Shadowed wing planes
  ctx.fillStyle = farWing;
  ctx.beginPath();
  ctx.moveTo(-62, -6);
  ctx.lineTo(-4, -34);
  ctx.lineTo(32, -18);
  ctx.lineTo(-18, -6);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(-62, 6);
  ctx.lineTo(-4, 34);
  ctx.lineTo(32, 18);
  ctx.lineTo(-18, 6);
  ctx.closePath();
  ctx.fill();

  // Main stealth body
  ctx.fillStyle = fuselage;
  ctx.strokeStyle = outline;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-96, 0);
  ctx.lineTo(-26, -38);
  ctx.lineTo(96, -8);
  ctx.lineTo(96, 8);
  ctx.lineTo(-26, 38);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Belly facets
  ctx.fillStyle = belly;
  ctx.beginPath();
  ctx.moveTo(-78, 10);
  ctx.lineTo(62, 6);
  ctx.lineTo(-18, 28);
  ctx.lineTo(-86, 16);
  ctx.closePath();
  ctx.fill();

  // Tail notch
  ctx.fillStyle = tail;
  ctx.beginPath();
  ctx.moveTo(-96, 0);
  ctx.lineTo(-116, -8);
  ctx.lineTo(-114, 8);
  ctx.closePath();
  ctx.fill();

  // Engine intakes
  ctx.fillStyle = engineColor;
  ctx.beginPath();
  ctx.ellipse(26, -2, 14, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(26, 2, 14, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  // Cockpit canopy
  ctx.fillStyle = windowColor;
  ctx.beginPath();
  ctx.moveTo(6, -10);
  ctx.lineTo(44, -6);
  ctx.lineTo(10, 8);
  ctx.lineTo(-2, 4);
  ctx.closePath();
  ctx.fill();

  // Panel lines for definition
  ctx.strokeStyle = outline;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(-20, -4);
  ctx.lineTo(32, -2);
  ctx.lineTo(-20, 6);
  ctx.stroke();
}

const airframeRenderers = {
  jet: drawJetAirframe,
  prop: drawPropAirframe,
  stealth: drawStealthAirframe,
};

function drawPlane() {
  const { palette, airframe = "jet" } = planeDefinition;
  const renderer = airframeRenderers[airframe] || airframeRenderers.jet;

  ctx.save();
  ctx.translate(plane.x, plane.y);
  ctx.rotate(plane.rotation);
  renderer(palette);
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

function seededRandom(seed) {
  const x = Math.sin(seed) * 43758.5453123;
  return x - Math.floor(x);
}

function createSkylinePattern(layer, seedOffset) {
  const pattern = [];
  for (let i = 0; i < layer.patternCount; i++) {
    const seed = seedOffset * 10.17 + i * 3.73;
    const height = Math.round(layer.minHeight + (layer.maxHeight - layer.minHeight) * seededRandom(seed + 0.11));
    const roofRoll = seededRandom(seed + 0.47);
    const roofStyle = roofRoll > 0.72 ? "antenna" : roofRoll > 0.38 ? "slant" : "flat";
    pattern.push({
      height,
      roofStyle,
      seed: Math.floor(seededRandom(seed + 0.91) * 1000),
    });
  }
  return pattern;
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

planeMenuToggle.addEventListener("click", () => {
  showPlaneMenu();
});

closePlaneMenu.addEventListener("click", () => {
  hidePlaneMenu();
});

planeMenuOverlay.addEventListener("click", (event) => {
  if (event.target === planeMenuOverlay) {
    hidePlaneMenu();
  }
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

  if (event.code === "Escape" && !planeMenuOverlay.hidden) {
    hidePlaneMenu();
  }
});

window.addEventListener("blur", () => {
  inputState.isPointerDown = false;
});

applyPlaneDefinition(0);
createPlaneMenu();
resetGame();
requestAnimationFrame(loop);
