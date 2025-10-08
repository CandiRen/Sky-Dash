const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");
const scoreNode = document.getElementById("score");
const planeMenuToggle = document.getElementById("planeMenuToggle");
const planeMenuOverlay = document.getElementById("planeMenuOverlay");
const planeGrid = document.getElementById("planeGrid");
const closePlaneMenu = document.getElementById("closePlaneMenu");
const planeUploadButton = document.getElementById("planeUploadButton");
const planeUploadInput = document.getElementById("planeUploadInput");
const planeUploadStatus = document.getElementById("planeUploadStatus");

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

const customPlaneDefinition = {
  id: "custom-upload",
  airframe: "image",
  name: "Unggahan PNG",
  description: "Unggah gambar PNG milikmu.",
  palette: {
    outline: "#1c4f7a",
    fuselage: "#ffffff",
    belly: "#c7e6ff",
  },
  image: null,
  imageSrc: "",
  renderSize: null,
};

const CUSTOM_PLANE_INDEX = planeDefinitions.push(customPlaneDefinition) - 1;

function calculateCustomPlaneSize(image) {
  const naturalWidth = image?.naturalWidth ?? 0;
  const naturalHeight = image?.naturalHeight ?? 0;
  if (!naturalWidth || !naturalHeight) {
    return { width: PLANE_HITBOX.width, height: PLANE_HITBOX.height };
  }

  const maxWidth = PLANE_HITBOX.width;
  const maxHeight = PLANE_HITBOX.height;
  const scale = Math.min(maxWidth / naturalWidth, maxHeight / naturalHeight);

  return {
    width: naturalWidth * scale,
    height: naturalHeight * scale,
  };
}

function getDefinitionSize(definition) {
  if (definition?.airframe === "image" && definition?.renderSize) {
    return definition.renderSize;
  }
  return { width: PLANE_HITBOX.width, height: PLANE_HITBOX.height };
}

const airframeLabels = {
  jet: "Jet",
  prop: "Propeler",
  stealth: "Stealth",
  image: "Unggahan",
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

function syncPlaneDimensions(definition) {
  const size = getDefinitionSize(definition);
  plane.width = size.width;
  plane.height = size.height;
}

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
  const definition = planeDefinitions[index];
  if (!definition) {
    return;
  }

  if (definition.airframe === "image" && !definition.image) {
    return;
  }
  planeDefinition = definition;
  syncPlaneDimensions(definition);
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
    const typeLabel = airframeLabels[def.airframe] || def.airframe;

    if (def.airframe === "image") {
      card.classList.add("plane-card--image");
      const hasImage = Boolean(def.image);
      const previewContent = hasImage
        ? `<img src="${def.imageSrc}" alt="Pesawat unggahan pengguna">`
        : '<span class="plane-preview__placeholder">PNG</span>';
      const caption = hasImage
        ? "Klik untuk memakai unggahanmu."
        : "Unggah PNG untuk menampilkan pesawatmu.";
      card.innerHTML = `
        <span class="plane-preview plane-preview--image">${previewContent}</span>
        <strong>${def.name}</strong>
        <span class="plane-tag">${typeLabel}</span>
        <span class="caption">${caption}</span>
      `;
    } else {
      const palette = def.palette;
      card.innerHTML = `
        <span class="plane-preview" data-airframe="${def.airframe}" style="--plane-top:${palette.fuselage}; --plane-belly:${palette.belly}; --plane-outline:${palette.outline}; --plane-detail:${palette.engine || palette.belly}; --plane-window:${palette.window || palette.outline}"></span>
        <strong>${def.name}</strong>
        <span class="plane-tag">${typeLabel}</span>
        <span class="caption">${def.description}</span>
      `;
    }

    card.addEventListener("click", () => {
      if (def.airframe === "image" && !def.image) {
        updateUploadStatus("Pilih berkas PNG dari perangkatmu untuk mengganti pesawat.");
        planeUploadInput?.click();
        return;
      }
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

function updateUploadStatus(message, state = "info") {
  if (!planeUploadStatus) {
    return;
  }
  planeUploadStatus.textContent = message;
  if (state === "info") {
    planeUploadStatus.removeAttribute("data-state");
  } else {
    planeUploadStatus.dataset.state = state;
  }
}

function handlePlaneUpload(event) {
  const input = event.target;
  const file = input?.files?.[0];
  if (!file) {
    return;
  }

  const mime = file.type?.toLowerCase?.() ?? "";
  if (!mime.includes("png")) {
    updateUploadStatus("Harap pilih berkas dengan format PNG.", "error");
    input.value = "";
    return;
  }

  updateUploadStatus("Memuat gambar PNG…");
  const reader = new FileReader();
  reader.onload = () => {
    const result = reader.result;
    if (typeof result !== "string") {
      updateUploadStatus("Tidak dapat membaca berkas PNG.", "error");
      input.value = "";
      return;
    }

    const image = new Image();
    image.onload = () => {
      customPlaneDefinition.image = image;
      customPlaneDefinition.imageSrc = result;
      customPlaneDefinition.renderSize = calculateCustomPlaneSize(image);
      updateUploadStatus(
        `PNG terunggah (${image.naturalWidth}×${image.naturalHeight}). Pesawat otomatis digunakan.`,
        "success",
      );
      applyPlaneDefinition(CUSTOM_PLANE_INDEX);
      resetGame();
      hidePlaneMenu();
      createPlaneMenu();
      input.value = "";
    };
    image.onerror = () => {
      updateUploadStatus("Gagal memuat gambar PNG.", "error");
      input.value = "";
    };
    image.src = result;
  };
  reader.onerror = () => {
    updateUploadStatus("Tidak dapat membaca berkas PNG.", "error");
    input.value = "";
  };
  reader.readAsDataURL(file);
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

function drawUnifiedAirframe(palette) {
  const outline = palette.outline;
  const fuselage = palette.fuselage;
  const belly = palette.belly || fuselage;

  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  const gradient = ctx.createLinearGradient(-110, -32, -110, 26);
  gradient.addColorStop(0, fuselage);
  gradient.addColorStop(0.6, fuselage);
  gradient.addColorStop(1, belly);

  const silhouette = new Path2D();
  silhouette.moveTo(-96, -4);
  silhouette.quadraticCurveTo(-52, -22, -14, -20);
  silhouette.quadraticCurveTo(2, -22, 6, -30);
  silhouette.quadraticCurveTo(22, -32, 34, -42);
  silhouette.quadraticCurveTo(46, -48, 40, -20);
  silhouette.quadraticCurveTo(72, -16, 84, 0);
  silhouette.quadraticCurveTo(88, 10, 52, 12);
  silhouette.quadraticCurveTo(24, 16, -22, 18);
  silhouette.quadraticCurveTo(-68, 20, -96, 8);
  silhouette.quadraticCurveTo(-112, 4, -96, -4);
  silhouette.closePath();

  ctx.fillStyle = gradient;
  ctx.fill(silhouette);
  ctx.strokeStyle = outline;
  ctx.lineWidth = 2.4;
  ctx.stroke(silhouette);
}

const airframeRenderers = {
  jet: drawUnifiedAirframe,
  prop: drawUnifiedAirframe,
  stealth: drawUnifiedAirframe,
};

function drawPlane() {
  const definition = planeDefinition;
  ctx.save();
  ctx.translate(plane.x, plane.y);

  if (definition.airframe === "image" && definition.image) {
    const size = getDefinitionSize(definition);
    ctx.rotate(plane.rotation);
    ctx.drawImage(definition.image, -size.width * 0.5, -size.height * 0.5, size.width, size.height);
  } else {
    const { palette, airframe = "jet" } = definition;
    const renderer = airframeRenderers[airframe] || airframeRenderers.jet;
    // Mirror the airframe geometry so that every plane faces arah terbang.
    // Rotation is negated after the horizontal flip to preserve the original pitching behaviour.
    ctx.scale(-1, 1);
    ctx.rotate(-plane.rotation);
    renderer(palette);
  }

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

if (planeUploadButton) {
  planeUploadButton.addEventListener("click", () => {
    planeUploadInput?.click();
  });
}

if (planeUploadInput) {
  planeUploadInput.addEventListener("change", handlePlaneUpload);
}

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
