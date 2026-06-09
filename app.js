
(function() {
"use strict";

var FONTS = [
  "'Bungee', cursive",
  "'Monoton', cursive",
  "'Rubik Glitch', cursive",
  "'Sixtyfour', monospace",
  "'Honk', system-ui",
  "'Jersey 10', monospace",
  "'Micro 5', monospace",
  "'Nabla', system-ui",
  "'Orbitron', sans-serif",
  "'Press Start 2P', cursive",
  "'Rubik Burned', system-ui",
  "'Smooch Sans', sans-serif",
  "'Tilt Prism', cursive",
  "'UnifrakturMaguntia', cursive",
];

var QUOTES = [
  "El sistema se esta rompiendo...",
  "Realidad inestable",
  "Que has hecho?",
  "BUG DETECTADO",
  "Caos nivel: indeterminado",
  "Todo esta bien... creo.",
  "FUEGO FUEGO FUEGO",
  "Anomalia registrada",
  "Probabilidad de colapso: alta",
  "La entropia siempre gana",
  "Has desbloqueado: el vacio",
  "REINICIO RECOMENDADO",
  "Este no es un bug, es una feature",
  "El boton te mira fijamente",
  "Demasiado tarde para arrepentirse",
  "Realidad alterna cargando...",
  "INFINITO",
  "Error 418: I'm a teapot",
  "La IA te observa",
  "Caos level: ",
];

var SYMBOLS = ["*", "+", "~", "^", "#", "@", "!", "$", "%", "&"];

/* ========================= */
/* SOUND SYSTEM */
/* ========================= */

var SOUNDS = [
  "assets/sounds/bruh.mp3",
  "assets/sounds/ara-ara-sayonara.mp3",
  "assets/sounds/galaxy-meme.mp3",
  "assets/sounds/sad-violin-the-meme-one.mp3",
  "assets/sounds/spongebob-fail.mp3",
  "assets/sounds/cat-laugh-meme-1.mp3",
  "assets/sounds/windows-xp-donteflon.mp3"
];

/* ========================= */
/* VIDEO SYSTEM */
/* ========================= */

var VIDEOS = [
  { file: "assets/videos/Avioncito.mp4", name: "Avioncito", prob: 0.5 },
  { file: "assets/videos/Tesla_bailando.mp4", name: "Tesla Bailando", prob: 0.25 },
  { file: "assets/videos/Gojo_bici.mp4", name: "Gojo en Bici", prob: 0.25 }
];

var unlockedVideos = JSON.parse(localStorage.getItem("chaosVideos") || "[]");
var jesusRewardUnlocked = localStorage.getItem("chaosJesusReward") === "1";
var collectionOpen = false;

var videoOverlay = document.getElementById("videoOverlay");
var overlayVideo = document.getElementById("overlayVideo");
var repetidoMsg = document.getElementById("repetidoMsg");

var clickSound = new Audio("assets/sounds/mouse-click-sound.mp3");
clickSound.volume = 0.7;
clickSound.preload = "auto";
var soundPool = [];
var lastSoundIndex = -1;
var lastSoundTime = 0;
var SOUND_COOLDOWN = 10000;

function playRandomSound() {
  var now = Date.now();
  if (now - lastSoundTime < SOUND_COOLDOWN) return;

  var available = [];
  for (var i = 0; i < SOUNDS.length; i++) {
    if (i !== lastSoundIndex) available.push(i);
  }
  if (available.length === 0) return;

  var idx = available[Math.floor(Math.random() * available.length)];
  lastSoundIndex = idx;
  lastSoundTime = now;

  var sound = new Audio(SOUNDS[idx]);
  sound.volume = 0.5;
  soundPool.push(sound);

  sound.play().catch(function() {});

  sound.onended = function() {
    var i = soundPool.indexOf(sound);
    if (i > -1) soundPool.splice(i, 1);
  };
}

function playClickSound() {
  if (clickSound.readyState < 2) {
    clickSound.load();
  }
  clickSound.currentTime = 0;
  clickSound.volume = 0.5 + Math.random() * 0.4;
  var playPromise = clickSound.play();
  if (playPromise !== undefined) {
    playPromise.catch(function() {});
  }
}

/* ========================= */
/* FACTS */
/* ========================= */

var FACTS = [
  // ESPACIO
  "Un dia en Venus dura mas que un ano en Venus.",
  "El universo no tiene sonido.",
  "Un relampago es mas caliente que la superficie del Sol.",
  "Algunas estrellas que ves quizas ya murieron hace millones de anos.",
  "Existen estrellas tan densas que una cucharada pesaria millones de toneladas.",
  "Hay planetas donde podria llover vidrio horizontalmente.",
  "El espacio huele raro segun astronautas.",
  "Algunas estrellas podrian ser enormes masas de diamante.",
  // ANIMALES
  "Los pulpos tienen 3 corazones.",
  "Los tiburones existian antes que los arboes.",
  "Las vacas tienen mejores amigos.",
  "Los delfines usan nombres entre ellos.",
  "Las burbujas pueden reconocer rostros humanos.",
  "Algunas tortugas respiran por el trasero.",
  "Los pinguinos a veces regalan piedras como cortejo.",
  "Los gatos normalmente no maullan entre ellos.",
  "Hay peces capaces de caminar fuera del agua.",
  "Los cuervos recuerdan caras humanas por anos.",
  // CEREBRO
  "Tu cerebro puede crear recuerdos falsos.",
  "El miedo se procesa mas rapido que la logica.",
  "Algunas personas no tienen voz interna.",
  "Tu cerebro ignora constantemente tu nariz.",
  "El cuerpo humano produce electricidad.",
  "Dormir poco altera la percepcion de la realidad.",
  "Tu cuerpo reemplaza millones de celulas constantemente.",
  "Tecnicamente nunca tocas nada realmente debido a fuerzas atomicas.",
  "El cerebro humano se nombro a si mismo.",
  "El cuerpo humano contiene suficiente hierro para fabricar un clavo.",
  // NATURALEZA
  "Hay mas arboles en la Tierra que estrellas en la galaxia.",
  "Existe nieve roja en ciertas regiones.",
  "Algunas ranas pueden congelarse y sobrevivir.",
  "Las plantas liberan senales quimicas cuando son danadas.",
  "Hay hongos gigantes bajo tierra mas grandes que ciudades.",
  "El agua caliente puede congelarse mas rapido que la fria.",
  "Existen lagos debajo del oceano.",
  "Las bananas son ligeramente radioactivas.",
  "Algunas medusas son biologicamente casi inmortales.",
  // DIGITAL
  "Un meme puede llegar a millones de personas en horas.",
  "Tu telefono probablemente tiene mas potencia que computadoras antiguas de la NASA.",
  "Los videojuegos pueden mejorar reflejos y coordinacion.",
  "Algunos sonidos virales vienen de grabaciones accidentales.",
  "La musica cambia como percibes el tiempo.",
  "Los colores afectan decisiones sin que lo notes.",
  "Tu cerebro detecta caras mas rapido que cualquier otra forma.",
  "Hay gente que desarrolla apego emocional a NPCs.",
  "El lag puede existir incluso en tu percepcion visual.",
  "El caos digital suele parecer mas divertido que el orden."
];

var clicks = 0;
var chaosLevel = 0;
var lastFontIndex = -1;
var isResetting = false;
var shownFacts = [];
var lastFactTime = 0;
var FACT_COOLDOWN = 5000;
var sidebarOpen = false;
/* ========================= */
/* CLICK COUNTER (Fase 0.1) */
/* ========================= */

var totalClicks = parseInt(localStorage.getItem("totalClicks") || "0", 10);
var clickCounterEl = document.getElementById("clickCounter");
var clickCounterNumber = document.getElementById("clickCounterNumber");
var clickCounterTickTimeout = null;
var lastMilestoneShown = parseInt(localStorage.getItem("lastMilestoneShown") || "0", 10);
var MILESTONES = [100, 250, 500, 750, 1000, 2500, 5000, 7500, 10000, 25000, 50000, 100000];

clickCounterNumber.textContent = formatNumber(totalClicks);

function formatNumber(n) {
  if (n < 1000) return String(n);
  if (n < 1000000) return (n / 1000).toFixed(n < 10000 ? 1 : 0) + "K";
  return (n / 1000000).toFixed(1) + "M";
}

/* ========================= */
/* COIN SYSTEM (Fase 1) */
/* ========================= */

var coins = parseInt(localStorage.getItem("chaosCoins") || "0", 10);
var coinDisplayEl = document.getElementById("coinDisplay");
var coinNumberEl = document.getElementById("coinNumber");
var coinTickTimeout = null;
var coinSound = null;

coinNumberEl.textContent = formatNumber(coins);

try {
  coinSound = new Audio("assets/sounds/coin-collect.mp3");
  coinSound.volume = 0.3;
  coinSound.preload = "auto";
} catch (e) { /* file may not exist yet, sound optional */ }

function addCoins(amount, source, isBig) {
  coins += amount;
  localStorage.setItem("chaosCoins", String(coins));
  coinNumberEl.textContent = formatNumber(coins);
  if (shopOpen) updateShopBalance();

  coinDisplayEl.classList.remove("tick");
  void coinDisplayEl.offsetWidth;
  coinDisplayEl.classList.add("tick");
  if (coinTickTimeout) clearTimeout(coinTickTimeout);
  coinTickTimeout = setTimeout(function() {
    coinDisplayEl.classList.remove("tick");
  }, 200);

  var rect = chaosBtn.getBoundingClientRect();
  var popup = document.createElement("div");
  popup.className = "coin-popup " + (source || "normal") + (isBig ? " big" : "");
  popup.textContent = "+" + amount;
  popup.style.left = (rect.left + rect.width / 2) + "px";
  popup.style.top = (rect.top + 8) + "px";
  document.body.appendChild(popup);
  setTimeout(function() { if (popup.parentNode) popup.parentNode.removeChild(popup); }, 1000);

  if (coinSound) {
    try {
      coinSound.currentTime = 0;
      coinSound.play().catch(function() {});
    } catch (e) {}
  }
}

function updateClickCounter() {
  totalClicks++;
  localStorage.setItem("totalClicks", String(totalClicks));
  clickCounterNumber.textContent = formatNumber(totalClicks);

  clickCounterEl.classList.remove("tick");
  void clickCounterEl.offsetWidth;
  clickCounterEl.classList.add("tick");

  if (clickCounterTickTimeout) clearTimeout(clickCounterTickTimeout);
  clickCounterTickTimeout = setTimeout(function() {
    clickCounterEl.classList.remove("tick");
  }, 200);

  for (var i = 0; i < MILESTONES.length; i++) {
    if (totalClicks === MILESTONES[i] && lastMilestoneShown < MILESTONES[i]) {
      lastMilestoneShown = MILESTONES[i];
      localStorage.setItem("lastMilestoneShown", String(MILESTONES[i]));
      clickCounterEl.classList.remove("milestone");
      void clickCounterEl.offsetWidth;
      clickCounterEl.classList.add("milestone");
      setTimeout(function() { clickCounterEl.classList.remove("milestone"); }, 700);
      break;
    }
  }
}

/* ========================= */
/* PERFORMANCE - MAX ELEMENTS (Fase 0.2) */
/* ========================= */

var MAX_ELEMENTS = {
  "chaos-symbol": 25,
  "invasion-symbol": 20,
  "raindrop": 50,
  "rain-splash": 25,
  "confetti-piece": 80,
  "matrix-column": 60,
  "shockwave": 5,
  "supernova-wave": 5,
  "portal-ring": 4,
  "portal-vortex": 2,
  "glitch-slice": 5,
  "hackerman-line": 15,
  "aurora-layer": 4,
  "falling-cat": 1,
  "sardine": 1,
  "coin-button": 1
};

var elementCountCache = {};

function canCreate(className) {
  var max = MAX_ELEMENTS[className];
  if (!max) return true;
  var count = elementCountCache[className] || 0;
  if (count >= max) return false;
  elementCountCache[className] = count + 1;
  return true;
}

function releaseElement(className) {
  var count = elementCountCache[className] || 0;
  if (count > 0) elementCountCache[className] = count - 1;
}

function trackedAppend(el, className) {
  if (!canCreate(className)) return false;
  document.body.appendChild(el);
  return true;
}

function trackedRemove(el, className) {
  if (el.parentNode) el.parentNode.removeChild(el);
  releaseElement(className);
}

// Load saved facts from localStorage
var unlockedFacts = JSON.parse(localStorage.getItem("chaosFacts") || "[]");
if (unlockedFacts.length > 0) {
  unlockedFacts.forEach(function(fact, i) {
    var item = document.createElement("div");
    item.className = "unlocked-item show";
    item.textContent = (i + 1) + ". " + fact;
    document.getElementById("unlockedList").appendChild(item);
  });
  document.getElementById("unlockedCount").textContent = unlockedFacts.length + " / 40";
}

var canvas = document.getElementById("particles-canvas");
var ctx = canvas.getContext("2d");
var title = document.getElementById("title");
var logEl = document.getElementById("log");
var chaosBtn = document.getElementById("chaosBtn");
var chaosBar = document.getElementById("chaosBar");
var chaos100NumberEl = document.getElementById("chaos100Number");
var chaosLevelSpan = document.getElementById("chaosLevel");
var factPanel = document.getElementById("factPanel");
var factText = document.getElementById("factText");

var W, H;

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);

// ===== PARTICLES =====
var NUM_AMBIENT = 40;

function randomHsl(sat, lit) {
  return "hsl(" + Math.floor(Math.random() * 360) + ", " + (sat !== undefined ? sat : 100) + "%, " + (lit !== undefined ? lit : 50) + "%)";
}

// Particle classes
function AmbientParticle() {
  this.reset(true);
}
AmbientParticle.prototype.reset = function(initial) {
  this.x = Math.random() * (W || 1);
  this.y = Math.random() * (H || 1);
  this.size = Math.random() * 2 + 0.5;
  this.vx = (Math.random() - 0.5) * 0.4;
  this.vy = (Math.random() - 0.5) * 0.4;
  this.hue = Math.random() * 360;
  this.alpha = Math.random() * 0.4 + 0.1;
  this.pulse = Math.random() * Math.PI * 2;
  this.pulseSpeed = 0.01 + Math.random() * 0.015;
};
AmbientParticle.prototype.update = function() {
  this.x += this.vx;
  this.y += this.vy;
  this.pulse += this.pulseSpeed;
  if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
  }
};
AmbientParticle.prototype.draw = function() {
  var a = this.alpha * (0.6 + 0.4 * Math.sin(this.pulse));
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.size, 0, 6.283);
  ctx.fillStyle = "hsla(" + this.hue + ", 70%, 60%, " + a + ")";
  ctx.fill();
};

function BurstParticle(x, y, hue) {
  var angle = Math.random() * 6.283;
  var speed = 2 + Math.random() * 4 + chaosLevel * 0.1;
  this.x = x;
  this.y = y;
  this.vx = Math.cos(angle) * speed;
  this.vy = Math.sin(angle) * speed;
  this.size = 1 + Math.random() * 3;
  this.hue = hue + (Math.random() - 0.5) * 40;
  this.life = 1;
  this.decay = 0.012 + Math.random() * 0.008;
}
BurstParticle.prototype.update = function() {
  this.x += this.vx;
  this.y += this.vy;
  this.vy += 0.04;
  this.vx *= 0.98;
  this.vy *= 0.98;
  this.life -= this.decay;
};
BurstParticle.prototype.draw = function() {
  if (this.life <= 0) return;
  var a = this.life;
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.size * a, 0, 6.283);
  ctx.fillStyle = "hsla(" + this.hue + ", 100%, 65%, " + a + ")";
  ctx.fill();
};

var ambientParticles = [];
var burstParticles = [];

function initParticles() {
  resize();
  for (var i = 0; i < NUM_AMBIENT; i++) {
    ambientParticles.push(new AmbientParticle());
  }
}
initParticles();

function spawnBurst(x, y) {
  var count = 15 + Math.floor(chaosLevel * 0.5);
  if (count > 60) count = 60;
  var hue = Math.random() * 360;
  for (var i = 0; i < count; i++) {
    if (burstParticles.length < 200) {
      burstParticles.push(new BurstParticle(x, y, hue));
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, W, H);
  for (var i = 0; i < ambientParticles.length; i++) {
    ambientParticles[i].update();
    ambientParticles[i].draw();
  }
  for (var i = burstParticles.length - 1; i >= 0; i--) {
    burstParticles[i].update();
    burstParticles[i].draw();
    if (burstParticles[i].life <= 0) {
      burstParticles.splice(i, 1);
    }
  }
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

// ===== CHAOS SYMBOLS =====
function spawnChaosSymbol() {
  if (!canCreate("chaos-symbol")) return;
  var sym = document.createElement("div");
  sym.className = "chaos-symbol";
  sym.textContent = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
  sym.style.left = (10 + Math.random() * 80) + "%";
  sym.style.bottom = "15%";
  sym.style.color = randomHsl(100, 60);
  sym.style.fontSize = (18 + Math.random() * 24 + Math.min(chaosLevel, 40)) + "px";
  document.body.appendChild(sym);
  setTimeout(function() { trackedRemove(sym, "chaos-symbol"); }, 1200);
}

/* ========================= */
/* FACT SYSTEM */
/* ========================= */

var unlockedList = document.getElementById("unlockedList");
var unlockedCount = document.getElementById("unlockedCount");
var toggleBtn = document.getElementById("toggleUnlocked");
var unlockedPanel = document.getElementById("unlockedPanel");

toggleBtn.addEventListener("click", function() {
  sidebarOpen = !sidebarOpen;
  if (sidebarOpen) {
    unlockedPanel.classList.add("open");
  } else {
    unlockedPanel.classList.remove("open");
  }
});

/* ========================= */
/* COLLECTION PANEL */
/* ========================= */

var collectionBtn = document.getElementById("toggleCollection");
var collectionPanel = document.getElementById("collectionPanel");
var collectionList = document.getElementById("collectionList");
var collectionCount = document.getElementById("collectionCount");
var collectionCloseBtn = document.getElementById("collectionClose");

collectionBtn.addEventListener("click", function() {
  collectionOpen = !collectionOpen;
  if (collectionOpen) {
    collectionPanel.classList.add("open");
  } else {
    collectionPanel.classList.remove("open");
  }
});

collectionCloseBtn.addEventListener("click", function() {
  collectionPanel.classList.remove("open");
  collectionOpen = false;
});

function buildCollection() {
  collectionList.innerHTML = "";

  var videosHeader = document.createElement("div");
  videosHeader.className = "collection-section-header";
  videosHeader.textContent = "VIDEOS";
  collectionList.appendChild(videosHeader);

  var videosRow = document.createElement("div");
  videosRow.className = "collection-videos-row";
  collectionList.appendChild(videosRow);

  if (unlockedVideos.length === 0) {
    var empty = document.createElement("div");
    empty.className = "collection-empty-row";
    empty.textContent = "Llega a 100% caos para desbloquear videos";
    videosRow.appendChild(empty);
  } else {
    unlockedVideos.forEach(function(v, i) {
      var item = document.createElement("div");
      item.className = "collection-item";

      var vid = document.createElement("video");
      vid.src = v.file;
      vid.loop = true;
      vid.muted = true;
      vid.addEventListener("mouseenter", function() { vid.play().catch(function(){}); });
      vid.addEventListener("mouseleave", function() { vid.pause(); vid.currentTime = 0; });
      vid.addEventListener("click", function() {
        playVideoFullscreen(v.file, false);
      });

      var name = document.createElement("div");
      name.className = "collection-item-name";
      name.textContent = v.name;

      item.appendChild(vid);
      item.appendChild(name);
      videosRow.appendChild(item);
    });
  }

  var collectiblesHeader = document.createElement("div");
  collectiblesHeader.className = "collection-section-header";
  collectiblesHeader.textContent = "COLECCIONABLES · RULETA";
  collectionList.appendChild(collectiblesHeader);

  var collectiblesRow = document.createElement("div");
  collectiblesRow.className = "collection-collectibles-row";
  collectionList.appendChild(collectiblesRow);

  var collectiblePrizes = (typeof ROULETTE_PRIZES !== "undefined" && ROULETTE_PRIZES)
    ? ROULETTE_PRIZES.filter(function(p) { return p.isCollectible; })
    : [];
  var ownedCount = 0;
  collectiblePrizes.forEach(function(prize) {
    if (isCollectibleOwned(prize.id)) ownedCount++;
    var item = document.createElement("div");
    item.className = "collection-item collectible-item" + (isCollectibleOwned(prize.id) ? " owned" : " locked");

    var imgWrap = document.createElement("div");
    imgWrap.className = "collection-collectible-img-wrap";
    if (isCollectibleOwned(prize.id)) {
      var img = document.createElement("img");
      img.src = prize.img;
      img.alt = prize.name;
      img.className = "collection-collectible-img";
      img.onerror = function() {
        this.style.background = "rgba(255,80,80,0.2)";
        this.alt = "missing";
      };
      imgWrap.appendChild(img);
    } else {
      var lock = document.createElement("div");
      lock.className = "collection-collectible-lock";
      lock.textContent = "🔒";
      imgWrap.appendChild(lock);
    }

    var tierBorder = document.createElement("div");
    tierBorder.className = "collection-collectible-tier-border tier-" + prize.tier;
    imgWrap.appendChild(tierBorder);

    var name = document.createElement("div");
    name.className = "collection-item-name";
    name.textContent = isCollectibleOwned(prize.id) ? prize.name : "???";

    item.appendChild(imgWrap);
    item.appendChild(name);
    if (isCollectibleOwned(prize.id)) {
      item.addEventListener("click", function() { openCollectibleFullscreen(prize); });
    }
    collectiblesRow.appendChild(item);
  });

  var totalCollectibles = collectiblePrizes.length;
  collectionCount.textContent = unlockedVideos.length + " / 3 · " + ownedCount + " / " + totalCollectibles;
}

function playVideoFullscreen(file, isNew) {
  overlayVideo.src = file;
  overlayVideo.muted = false;
  videoOverlay.classList.add("show");
  overlayVideo.play().catch(function() {});
  if (isNew) {
    overlayVideo.onended = function() {
      videoOverlay.classList.remove("show");
      buildCollection();
      resetEverything();
    };
  } else {
    overlayVideo.onended = function() {
      videoOverlay.classList.remove("show");
    };
  }
}

function showRepetido() {
  repetidoMsg.classList.add("show");
  setTimeout(function() { repetidoMsg.classList.remove("show"); }, 3000);
}

function triggerVideoUnlock() {
  var roll = Math.random();
  var cumulative = 0;
  var selectedVideo = null;

  for (var i = 0; i < VIDEOS.length; i++) {
    cumulative += VIDEOS[i].prob;
    if (roll < cumulative) {
      selectedVideo = VIDEOS[i];
      break;
    }
  }
  if (!selectedVideo) selectedVideo = VIDEOS[0];

  var alreadyUnlocked = unlockedVideos.some(function(v) { return v.file === selectedVideo.file; });

  if (alreadyUnlocked) {
    showRepetido();
    setTimeout(resetEverything, 3000);
  } else {
    unlockedVideos.push(selectedVideo);
    localStorage.setItem("chaosVideos", JSON.stringify(unlockedVideos));
    playVideoFullscreen(selectedVideo.file, true);
    checkAchievements();
  }
}

function addToSidebar(fact) {
  unlockedFacts.push(fact);
  localStorage.setItem("chaosFacts", JSON.stringify(unlockedFacts));
  unlockedCount.textContent = unlockedFacts.length + " / " + FACTS.length;

  var item = document.createElement("div");
  item.className = "unlocked-item";
  item.textContent = unlockedFacts.length + ". " + fact;
  unlockedList.appendChild(item);

  setTimeout(function() { item.classList.add("show"); }, 50);
}

function unlockFact() {
  var now = Date.now();
  if (now - lastFactTime < FACT_COOLDOWN) return;
  if (shownFacts.length >= FACTS.length) shownFacts = [];

  var available = FACTS.filter(function(f) {
    return shownFacts.indexOf(f) === -1;
  });
  if (available.length === 0) return;

  var fact = available[Math.floor(Math.random() * available.length)];
  shownFacts.push(fact);

  factText.innerText = fact;
  factPanel.classList.remove("visible");
  void factPanel.offsetWidth;
  factPanel.classList.add("visible");

  addToSidebar(fact);

  lastFactTime = now;

  checkAchievements();

  setTimeout(function() {
    factPanel.classList.remove("visible");
  }, 10000);
}

// ===== CORE FUNCTIONS =====
function updateChaosMeter() {
  chaosBar.style.width = chaosLevel + "%";
  chaosLevelSpan.textContent = chaosLevel + "%";
  if (chaos100NumberEl) {
    chaos100NumberEl.textContent = chaosReachedHundredCount;
  }
}

function changeFont() {
  var idx;
  do { idx = Math.floor(Math.random() * FONTS.length); }
  while (idx === lastFontIndex && FONTS.length > 1);
lastFontIndex = idx;
  title.style.fontFamily = FONTS[idx];
}

/* ========================= */
/* RANDOM EVENTS */
/* ========================= */

var EVENTS = [
  {
    name: "Terremoto",
    chance: 0.12,
    execute: function() {
      document.body.classList.add("earthquake-active");
      setTimeout(function() { document.body.classList.remove("earthquake-active"); }, 600);
    }
  },
  {
    name: "Explosion",
    chance: 0.12,
    execute: function() {
      var flash = document.createElement("div");
      flash.className = "explosion-flash";
      document.body.appendChild(flash);
      setTimeout(function() { if (flash.parentNode) flash.parentNode.removeChild(flash); }, 400);

      for (var i = 0; i < 3; i++) {
        (function(idx) {
          setTimeout(function() {
            if (!canCreate("shockwave")) return;
            var wave = document.createElement("div");
            wave.className = "shockwave";
            wave.style.borderColor = idx === 0
              ? "rgba(255, 200, 50, 0.9)"
              : idx === 1
                ? "rgba(255, 100, 20, 0.7)"
                : "rgba(255, 255, 255, 0.5)";
            document.body.appendChild(wave);
            setTimeout(function() { trackedRemove(wave, "shockwave"); }, 900);
          }, idx * 100);
        })(i);
      }

      var cx = window.innerWidth / 2;
      var cy = window.innerHeight / 2;
      for (var j = 0; j < 50; j++) {
        burstParticles.push(new BurstParticle(cx, cy, Math.random() * 360));
      }
    }
  },
  {
    name: "Invasion",
    chance: 0.09,
    execute: function() {
      var symbols = ["*", "#", "+", "@", "!", "?", "&", "%", "$", "?", "X", "?", "?"];
      for (var i = 0; i < 14; i++) {
        if (!canCreate("invasion-symbol")) return;
        var sym = document.createElement("div");
        sym.className = "invasion-symbol";
        sym.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        sym.style.left = (Math.random() * 100) + "%";
        sym.style.top = (Math.random() * 100) + "%";
        sym.style.fontSize = (50 + Math.random() * 80) + "px";
        sym.style.color = "hsl(" + Math.floor(Math.random() * 360) + ", 100%, 65%)";
        sym.style.animationDelay = (Math.random() * 0.2) + "s";
        document.body.appendChild(sym);
        setTimeout(function(s) { trackedRemove(s, "invasion-symbol"); }, 1600, sym);
      }
    }
  },
  {
    name: "Virus",
    chance: 0.08,
    execute: function() {
      document.body.classList.add("virus-active");
      if (!canCreate("virus-overlay")) {
        setTimeout(function() { document.body.classList.remove("virus-active"); }, 800);
        return;
      }
      var scanlines = document.createElement("div");
      scanlines.className = "virus-overlay";
      document.body.appendChild(scanlines);
      setTimeout(function() {
        document.body.classList.remove("virus-active");
        trackedRemove(scanlines, "virus-overlay");
      }, 800);
    }
  },
  {
    name: "Portal",
    chance: 0.07,
    execute: function() {
      var colors = [
        "hsl(" + Math.floor(Math.random() * 360) + ", 100%, 60%)",
        "hsl(" + Math.floor(Math.random() * 360) + ", 100%, 60%)",
        "hsl(" + Math.floor(Math.random() * 360) + ", 100%, 60%)"
      ];

      if (canCreate("portal-vortex")) {
        var vortex = document.createElement("div");
        vortex.className = "portal-vortex";
        document.body.appendChild(vortex);
        setTimeout(function() { trackedRemove(vortex, "portal-vortex"); }, 1200);
      }

      for (var i = 0; i < 3; i++) {
        (function(idx) {
          setTimeout(function() {
            if (!canCreate("portal-ring")) return;
            var ring = document.createElement("div");
            ring.className = "portal-ring";
            ring.style.width = (100 + Math.random() * 100) + "px";
            ring.style.height = ring.style.width;
            ring.style.borderColor = colors[idx];
            ring.style.color = colors[idx];
            document.body.appendChild(ring);
            setTimeout(function() { trackedRemove(ring, "portal-ring"); }, 1200);
          }, idx * 200);
        })(i);
      }
    }
  },
  {
    name: "GlitchTotal",
    chance: 0.09,
    execute: function() {
      var style = document.createElement("style");
      style.id = "glitch-event-style";
      style.textContent = [
        "@keyframes glitchSlice {",
        "  0%   { clip-path: inset(0 0 95% 0); transform: translate(-5px, 0) skewX(-5deg); }",
        "  20%  { clip-path: inset(30% 0 50% 0); transform: translate(5px, 0) skewX(3deg); }",
        "  40%  { clip-path: inset(60% 0 20% 0); transform: translate(-3px, 0) skewX(-2deg); }",
        "  60%  { clip-path: inset(10% 0 70% 0); transform: translate(4px, 0) skewX(4deg); }",
        "  80%  { clip-path: inset(80% 0 5% 0); transform: translate(-2px, 0) skewX(-3deg); }",
        "  100% { clip-path: inset(0 0 0 0); transform: translate(0); }",
        "}",
        "@keyframes glitchSlice2 {",
        "  0%   { clip-path: inset(95% 0 0 0); transform: translate(5px, 0) skewX(5deg); }",
        "  25%  { clip-path: inset(50% 0 30% 0); transform: translate(-4px, 0) skewX(-3deg); }",
        "  50%  { clip-path: inset(20% 0 60% 0); transform: translate(3px, 0) skewX(2deg); }",
        "  75%  { clip-path: inset(70% 0 10% 0); transform: translate(-5px, 0) skewX(-4deg); }",
        "  100% { clip-path: inset(0 0 0 0); transform: translate(0); }",
        "}",
        "@keyframes glitchFlash {",
        "  0%, 100% { opacity: 0; }",
        "  10%, 30%, 50%, 70%, 90% { opacity: 1; }",
        "  20%, 40%, 60%, 80% { opacity: 0; }",
        "}",
        ".glitch-slice {",
        "  position: fixed; left: 0; width: 100%; height: 100%;",
        "  z-index: 9999; pointer-events: none;",
        "  animation: glitchSlices 0.5s steps(1) forwards;",
        "  mix-blend-mode: screen;",
        "}",
        ".glitch-slice-2 { animation-name: glitchSlices2; }",
        ".glitch-slice::before, .glitch-slice::after {",
        "  content: ''; position: absolute; inset: 0;",
        "}",
        ".glitch-slice::before {",
        "  background: inherit;",
        "  animation: glitchSlices 0.3s steps(1) forwards;",
        "  clip-path: inset(20% 0 60% 0);",
        "  transform: translate(-8px, 0);",
        "  filter: hue-rotate(90deg) saturate(2);",
        "}",
        ".glitch-slice::after {",
        "  background: inherit;",
        "  animation: glitchSlices2 0.4s steps(1) forwards;",
        "  clip-path: inset(60% 0 20% 0);",
        "  transform: translate(8px, 0);",
        "  filter: hue-rotate(-90deg) saturate(2);",
        "}",
        "@keyframes glitchSlices {",
        "  0%   { clip-path: inset(0 0 95% 0); transform: translate(-5px, 0); }",
        "  20%  { clip-path: inset(30% 0 50% 0); transform: translate(5px, 0); }",
        "  40%  { clip-path: inset(55% 0 25% 0); transform: translate(-3px, 0); }",
        "  60%  { clip-path: inset(15% 0 65% 0); transform: translate(4px, 0); }",
        "  80%  { clip-path: inset(80% 0 5% 0); transform: translate(-2px, 0); }",
        "  100% { clip-path: inset(0 0 0 0); transform: translate(0); opacity: 0; }",
        "}",
        "@keyframes glitchSlices2 {",
        "  0%   { clip-path: inset(95% 0 0 0); transform: translate(5px, 0); }",
        "  25%  { clip-path: inset(50% 0 30% 0); transform: translate(-4px, 0); }",
        "  50%  { clip-path: inset(20% 0 55% 0); transform: translate(3px, 0); }",
        "  75%  { clip-path: inset(70% 0 10% 0); transform: translate(-5px, 0); }",
        "  100% { clip-path: inset(0 0 0 0); transform: translate(0); opacity: 0; }",
        "}"
      ].join(" ");
      document.head.appendChild(style);

      var slice1 = document.createElement("div");
      slice1.className = "glitch-slice";
      slice1.style.cssText = "top:0;height:40%;background:rgba(255,0,85,0.15);";
      document.body.appendChild(slice1);

      var slice2 = document.createElement("div");
      slice2.className = "glitch-slice glitch-slice-2";
      slice2.style.cssText = "bottom:0;height:35%;background:rgba(0,200,255,0.15);";
      document.body.appendChild(slice2);

      var slice3 = document.createElement("div");
      slice3.className = "glitch-slice";
      slice3.style.cssText = "top:30%;height:25%;background:rgba(0,255,100,0.1);";
      document.body.appendChild(slice3);

      document.body.style.transform = "translate(" + (Math.random()-0.5)*6 + "px) rotate(" + (Math.random()-0.5)*1 + "deg)";

      setTimeout(function() {
        [slice1, slice2, slice3].forEach(function(s) { if (s.parentNode) s.parentNode.removeChild(s); });
      }, 500);

      setTimeout(function() {
        document.body.style.transform = "";
        if (style.parentNode) style.parentNode.removeChild(style);
      }, 600);
    }
  },
  {
    name: "Lluvia",
    chance: 0.08,
    execute: function() {
      var dropCount = 50;
      for (var i = 0; i < dropCount; i++) {
        (function(idx) {
          setTimeout(function() {
            if (!canCreate("raindrop")) return;
            var drop = document.createElement("div");
            drop.className = "raindrop";
            drop.style.left = (Math.random() * 100) + "%";
            drop.style.height = (15 + Math.random() * 25) + "px";
            drop.style.opacity = (0.5 + Math.random() * 0.5);
            var duration = 0.5 + Math.random() * 0.6;
            drop.style.animationDuration = duration + "s";
            document.body.appendChild(drop);
            setTimeout(function() {
              trackedRemove(drop, "raindrop");
              if (Math.random() < 0.4 && canCreate("rain-splash")) {
                var splash = document.createElement("div");
                splash.className = "rain-splash";
                splash.style.left = drop.style.left;
                document.body.appendChild(splash);
                setTimeout(function() { trackedRemove(splash, "rain-splash"); }, 400);
              }
            }, duration * 1000);
          }, idx * 30);
        })(i);
      }
    }
  },
  {
    name: "Strobe",
    chance: 0.07,
    execute: function() {
      var count = 0;
      var colors = ["white", "#0a0a0f", "white", "white", "#0a0a0f"];
      var strobe = setInterval(function() {
        document.body.style.background = colors[count % colors.length];
        count++;
        if (count > 12) {
          clearInterval(strobe);
          document.body.style.background = "";
        }
      }, 70);
    }
  },
  {
    name: "Matrix",
    chance: 0.08,
    execute: function() {
      var chars = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789";
      var columns = Math.floor(window.innerWidth / 25);
      for (var c = 0; c < columns; c++) {
        (function(idx) {
          setTimeout(function() {
            if (!canCreate("matrix-column")) return;
            var col = document.createElement("div");
            col.className = "matrix-column";
            col.style.left = (idx * 25) + "px";
            col.style.color = "hsl(120, 100%, " + (50 + Math.random() * 30) + "%)";
            var dropCount = 20 + Math.floor(Math.random() * 15);
            for (var j = 0; j < dropCount; j++) {
              var ch = document.createElement("span");
              ch.className = "matrix-char";
              ch.textContent = chars[Math.floor(Math.random() * chars.length)];
              ch.style.animationDelay = (Math.random() * 0.3) + "s";
              col.appendChild(ch);
            }
            var duration = 1.5 + Math.random() * 1.5;
            col.style.animationDuration = duration + "s";
            document.body.appendChild(col);
            setTimeout(function() { trackedRemove(col, "matrix-column"); }, duration * 1000);
          }, idx * 40);
        })(c);
      }
    }
  },
  {
    name: "Hackerman",
    chance: 0.06,
    execute: function() {
      var lines = [
        "$ initializing breach sequence...",
        "> bypassing firewall... [OK]",
        "> decrypting user data... [OK]",
        "> injecting payload... [OK]",
        "> ACCESS GRANTED",
        "$ downloading chaos_v5.dat",
        "  [####################] 100%",
        "> system compromised",
        "> reality.exe has stopped working",
        "$ _"
      ];
      if (!canCreate("hackerman-overlay")) return;
      var overlay = document.createElement("div");
      overlay.className = "hackerman-overlay";
      var scan = document.createElement("div");
      scan.className = "hackerman-scanlines";
      document.body.appendChild(overlay);
      document.body.appendChild(scan);
      for (var i = 0; i < lines.length; i++) {
        (function(idx, text) {
          setTimeout(function() {
            if (!canCreate("hackerman-line")) return;
            var line = document.createElement("span");
            line.className = "hackerman-line";
            line.textContent = text;
            line.style.animationDelay = "0s";
            overlay.appendChild(line);
          }, idx * 200);
        })(i, lines[i]);
      }
      setTimeout(function() {
        trackedRemove(overlay, "hackerman-overlay");
        if (scan.parentNode) scan.parentNode.removeChild(scan);
      }, 2500);
    }
  },
  {
    name: "Supernova",
    chance: 0.06,
    execute: function() {
      document.body.classList.add("supernova-shake");

      var flash = document.createElement("div");
      flash.className = "supernova-flash";
      document.body.appendChild(flash);

      var colors = [
        "rgba(255, 255, 255, 0.95)",
        "rgba(255, 200, 50, 0.9)",
        "rgba(255, 100, 20, 0.8)",
        "rgba(255, 50, 100, 0.6)"
      ];
      for (var i = 0; i < 4; i++) {
        (function(idx) {
          setTimeout(function() {
            if (!canCreate("supernova-wave")) return;
            var wave = document.createElement("div");
            wave.className = "supernova-wave";
            wave.style.borderColor = colors[idx];
            wave.style.boxShadow = "0 0 80px " + colors[idx] + ", inset 0 0 40px " + colors[idx];
            document.body.appendChild(wave);
            setTimeout(function() { trackedRemove(wave, "supernova-wave"); }, 1200);
          }, idx * 150);
        })(i);
      }

      var cx = window.innerWidth / 2;
      var cy = window.innerHeight / 2;
      for (var k = 0; k < 80; k++) {
        burstParticles.push(new BurstParticle(cx, cy, Math.random() * 360));
      }

      setTimeout(function() {
        document.body.classList.remove("supernova-shake");
        if (flash.parentNode) flash.parentNode.removeChild(flash);
      }, 1200);
    }
  },
  {
    name: "Confetti",
    chance: 0.08,
    execute: function() {
      var palette = [
        "#ff0055", "#00ff88", "#00ccff", "#ffaa00", "#ff00cc",
        "#8800ff", "#ffff00", "#00ff00", "#ff6600", "#cc00ff"
      ];
      for (var i = 0; i < 80; i++) {
        (function(idx) {
          setTimeout(function() {
            if (!canCreate("confetti-piece")) return;
            var piece = document.createElement("div");
            piece.className = "confetti-piece";
            piece.style.left = (Math.random() * 100) + "%";
            piece.style.background = palette[Math.floor(Math.random() * palette.length)];
            piece.style.width = (6 + Math.random() * 8) + "px";
            piece.style.height = (10 + Math.random() * 10) + "px";
            piece.style.borderRadius = (Math.random() < 0.3 ? "50%" : "2px");
            var duration = 2 + Math.random() * 2;
            piece.style.animationDuration = duration + "s, 1s";
            document.body.appendChild(piece);
            setTimeout(function() { trackedRemove(piece, "confetti-piece"); }, duration * 1000);
          }, idx * 25);
        })(i);
      }
    }
  },
  {
    name: "Aurora",
    chance: 0.05,
    execute: function() {
      if (!canCreate("aurora-layer")) return;
      var layer1 = document.createElement("div");
      layer1.className = "aurora-layer aurora-layer-1";
      var layer2 = document.createElement("div");
      layer2.className = "aurora-layer aurora-layer-2";
      document.body.appendChild(layer1);
      document.body.appendChild(layer2);
      setTimeout(function() {
        trackedRemove(layer1, "aurora-layer");
        trackedRemove(layer2, "aurora-layer");
      }, 4000);
    }
  }
];

function triggerRandomEvent() {
  var roll = Math.random();
  var cumulative = 0;
  for (var i = 0; i < EVENTS.length; i++) {
    cumulative += EVENTS[i].chance;
    if (roll < cumulative) {
      EVENTS[i].execute();
      return;
    }
  }
}

function resetEverything() {
  if (isResetting) return;
  isResetting = true;

  clicks = 0;
  chaosLevel = 0;
  lastFontIndex = -1;
  burstParticles = [];

  document.body.style.cssText = "";
  document.body.style.background = "#0a0a0f";
  document.body.style.fontFamily = "Orbitron, monospace";

  title.style.cssText = "";
  title.style.fontFamily = "Orbitron, monospace";
  title.style.color = "white";

  chaosBtn.style.cssText = "";
  chaosBtn.style.background = "linear-gradient(90deg, #ff0055, #ffcc00, #00ff88, #aa00ff, #ff0055)";
  chaosBtn.style.backgroundSize = "300% 100%";
  chaosBtn.style.border = "2px solid rgba(255,255,255,0.3)";

logEl.style.cssText = "";
  logEl.innerText = "Sistema re-inicializado. El caos fue contenido.";

  factPanel.classList.remove("visible");

  // Reset unlocked facts (keep them saved)
  shownFacts = [];
  unlockedList.innerHTML = "";
  // Rebuild sidebar with saved facts
  unlockedFacts.forEach(function(fact, i) {
    var item = document.createElement("div");
    item.className = "unlocked-item show";
    item.textContent = (i + 1) + ". " + fact;
    unlockedList.appendChild(item);
  });
  unlockedCount.textContent = unlockedFacts.length + " / " + FACTS.length;

  updateChaosMeter();

  setTimeout(function() { isResetting = false; }, 500);
}

function chaos() {
  if (isResetting) return;

  var boostMult = getBoostMultiplier();
  applyBoostClick();

  clicks++;
  chaosLevel = Math.min(100, chaosLevel + boostMult);
  updateChaosMeter();
  updateClickCounter();

  var rect = chaosBtn.getBoundingClientRect();
  var cx = rect.left + rect.width / 2;
  var cy = rect.top + rect.height / 2;

  // Title color
  var color1 = randomHsl(100, 60);
  title.style.color = color1;

  // Button glow
  chaosBtn.style.borderColor = color1;
  chaosBtn.style.boxShadow = "0 0 25px " + color1;

  // Background
  if (chaosLevel >= 50) {
    document.body.style.background = "linear-gradient(" + Math.floor(Math.random() * 360) + "deg, " + randomHsl(90, 15) + ", " + randomHsl(90, 15) + ")";
  } else {
    document.body.style.background = randomHsl(80, 12);
  }

  // Font change
  changeFont();

  // Quote
  var quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  if (clicks % 5 === 0) quote = "Caos level: " + clicks;
  logEl.innerText = quote;
  logEl.classList.remove("panicked");
  void logEl.offsetWidth;
  logEl.classList.add("panicked");

  // Title glitch
  title.classList.remove("glitching");
  void title.offsetWidth;
  title.classList.add("glitching");

  // Burst particles
  spawnBurst(cx, cy);

  // Random effect
  var roll = Math.random();
  if (roll < 0.25) {
    document.body.classList.remove("screen-shake");
    void document.body.offsetWidth;
    document.body.classList.add("screen-shake");
  } else if (roll < 0.45) {
    title.classList.remove("chromatic-aberration");
    void title.offsetWidth;
    title.classList.add("chromatic-aberration");
} else if (roll < 0.6) {
    document.body.style.transform = "rotate(" + ((Math.random() - 0.5) * 6 * (chaosLevel / 50)) + "deg)";
  } else if (roll < 0.75) {
    document.body.style.filter = "hue-rotate(" + Math.floor(Math.random() * 360) + "deg)";
  } else {
    document.body.style.letterSpacing = (Math.random() * 15 * (chaosLevel / 50)) + "px";
  }

  // Random event
  if (Math.random() < 0.15) {
    triggerRandomEvent();
  }

  // Coin event (1.2% per click + timer)
  if (!coinEvent && Math.random() < 0.012) {
    spawnCoinEvent();
  }

  // Random sound (can play over other sounds except click)
  if (Math.random() < 0.2) {
    playRandomSound();
  }

  // Symbols
  if (Math.random() < 0.4) spawnChaosSymbol();

  // Facts - unlock based on chaos level (higher chance)
  if (chaosLevel >= 5 && Math.random() < chaosLevel / 80) {
    unlockFact();
  }

  // 100% reset - always happens at 100
  if (chaosLevel >= 100) {
    if (chaosLevel === 100) {
      chaosReachedHundredCount++;
      localStorage.setItem("chaosReachedHundredCount", String(chaosReachedHundredCount));
    }
    triggerVideoUnlock();
    checkAchievements();
    return;
  }

  // Occasional random reset at lower levels - only if chaos > 80
  if (chaosLevel > 80 && Math.random() < 0.03) {
    setTimeout(resetEverything, 1000);
  }

  checkAchievements();
}

// Button click
chaosBtn.addEventListener("click", function() {
  playClickSound();
  chaos();
});

// Keyboard shortcut
document.addEventListener("keydown", function(e) {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    playClickSound();
    chaos();
  }
});

// Ambient symbols
setInterval(function() {
  if (Math.random() < 0.4 && chaosLevel > 0) spawnChaosSymbol();
}, 3000);

// Clear transform/filter/letterSpacing periodically
setInterval(function() {
  if (!isResetting) {
    document.body.style.transform = "";
    document.body.style.filter = "";
    document.body.style.letterSpacing = "";
  }
}, 400);

console.log("CHAOS ENGINE v5");

/* ========================= */
/* SHOP SYSTEM (Fase 4) */
/* ========================= */

var SHOP_PICTURES = [
  { file: "assets/images/Obama.jpg",    name: "Obama",     price: 50,  req: 500 },
  { file: "assets/images/Isabel.webp",  name: "Isabel",    price: 50,  req: 500 },
  { file: "assets/images/Tomioka.jpg",  name: "Tomioka",   price: 60,  req: 2500 },
  { file: "assets/images/Muichiro.jpg", name: "Muichiro",  price: 60,  req: 2500 },
  { file: "assets/images/Megumi.jpg",   name: "Megumi",    price: 60,  req: 2500 },
  { file: "assets/images/Knight.jpg",   name: "Knight",    price: 60,  req: 2750 }
];

var SHOP_SECRET_PICTURES = [
  { file: "assets/images/Ratón_gamer.jpg", name: "Mouse Breaker", price: 0, req: 0, requiresBoosts: 5, isSecret: true }
];

var SHOP_FONTS = [
  { key: "dancing-script", name: "Cursiva Elegante",   css: "'Dancing Script', cursive", price: 10, sample: "Tu nombre" },
  { key: "great-vibes",    name: "Cursiva Caligráfica", css: "'Great Vibes', cursive",    price: 10, sample: "Tu nombre" },
  { key: "stranger-things", name: "Stranger Things",   css: "StrangerThings, fantasy",   price: 50, sample: "STRANGER" },
  { key: "kitkat",          name: "KitKat",            css: "KittyKatt, fantasy",        price: 50, sample: "KitKat" },
  { key: "squid-game",      name: "Squid Game",        css: "GameOfSquids, fantasy",     price: 50, sample: "SQUID" }
];

var SHOP_SLOGANS = [
  { key: "just-do-it", name: "Just do it",         price: 10 },
  { key: "no-pain",    name: "No pain, no gain!",  price: 10 },
  { key: "caotico",    name: "Caótico",            price: 20 },
  { key: "boom",       name: "BOOM",               price: 30 },
  { key: "hacker",     name: "HACKER",             price: 50 },
  { key: "nah-id-win", name: "Nah, I'd win",       price: 75 }
];

var SHOP_SECRET_SLOGANS = [
  { key: "mouse-breaker", name: "Mouse breaker", price: 0, requiresBoosts: 5, isSecret: true },
  { key: "jesus-blesses", name: "Jesús me bendice", price: 0, requiresRoulette: "divine", isSecret: true }
];

var SHOP_FRAMES = [
  { id: "jesus-blessing", name: "Bendición de Jesús", price: 0, requiresRoulette: "divine", isSecret: true }
];

/* ========================= */
/* ACHIEVEMENTS SYSTEM */
/* ========================= */

var ACHIEVEMENTS = [
  // BRONCE (5)
  { id: "first_step",   tier: "bronze", name: "First Step",          desc: "Alcanzá 100 clicks",                  category: "clicks",  reward: null },
  { id: "clickeador",   tier: "bronze", name: "Clickeador",          desc: "Alcanzá 500 clicks",                  category: "clicks",  reward: null },
  { id: "foto_inicial", tier: "bronze", name: "Foto Inicial",        desc: "Comprá tu primera foto de perfil",    category: "fotos",   reward: null },
  { id: "frase_marcada",tier: "bronze", name: "Frase Marcada",       desc: "Equipá tu primera frase",             category: "frases",  reward: null },
  { id: "coleccionista_novato", tier: "bronze", name: "Coleccionista Novato", desc: "Desbloqueá tu primer video",       category: "coleccion", reward: null },

  // PLATA (5)
  { id: "clickeador_pro",tier: "silver", name: "Clickeador Pro",      desc: "Alcanzá 5,000 clicks",                category: "clicks",  reward: null },
  { id: "slider",       tier: "silver", name: "Slider",              desc: "Comprá 3 fotos de perfil",            category: "fotos",   reward: null },
  { id: "first_boost",  tier: "silver", name: "First Boost",         desc: "Activá tu primer boost",              category: "clicks",  reward: null },
  { id: "espia",        tier: "silver", name: "Espía",               desc: "Equipá 3 frases",                     category: "frases",  reward: null },
  { id: "curador",      tier: "silver", name: "Curador",             desc: "Desbloqueá los 3 videos",            category: "coleccion", reward: null },

  // ORO (15)
  { id: "bot_frenesi",  tier: "gold",   name: "Bot Frenesí",         desc: "Alcanzá 25,000 clicks",               category: "clicks",  reward: null },
  { id: "multitud",     tier: "gold",   name: "Multitud",            desc: "Comprá todas las 6 fotos",            category: "fotos",   reward: null },
  { id: "mouse_breaker",tier: "gold",   name: "Mouse Breaker",       desc: "Alcanzá 50,000 clicks",               category: "clicks",  reward: { type: "picture", file: "assets/images/Ratón_gamer.jpg" } },
  { id: "ruletero",     tier: "gold",   name: "Ruletero",            desc: "Girá la ruleta 5 veces",             category: "coleccion", reward: null },
  { id: "loco_completo",tier: "gold",   name: "Loco Completo",       desc: "Llegá a 100% caos 3 veces",           category: "clicks",  reward: null },
  { id: "tipografo",    tier: "gold",   name: "Tipógrafo",           desc: "Comprá todas las 5 fuentes",          category: "frases",  reward: null },
  { id: "intelectual",  tier: "gold",   name: "Intelectual",         desc: "Desbloqueá todos los hechos",         category: "hechos",  reward: { type: "picture", file: "assets/images/Nikola-Albert.webp" } },
  { id: "espia_pro",    tier: "gold",   name: "Espía Pro",           desc: "Equipá todas las 6 frases",           category: "frases",  reward: null },
  { id: "riqueza",      tier: "gold",   name: "Riqueza",             desc: "Acumulá 1,000 monedas",               category: "clicks",  reward: null },
  { id: "marmolista",   tier: "gold",   name: "Marmolista",          desc: "Activá 25 boosts",                    category: "clicks",  reward: null },
  { id: "ruleta_maestra",tier: "gold",  name: "Ruleta Maestra",      desc: "Girá la ruleta 25 veces",             category: "coleccion", reward: null },
  { id: "coleccionista",tier: "gold",   name: "Coleccionista",       desc: "Desbloqueá todos los logros de Colección", category: "coleccion", reward: { type: "picture", file: "assets/images/medalla_de_oro.jpg" } },
  { id: "maratonista",  tier: "gold",   name: "Maratonista",         desc: "Activá 10 boosts",                    category: "clicks",  reward: null },
  { id: "bendecido",    tier: "gold",   name: "Bendecido",           desc: "Recibí la bendición divina",          category: "coleccion", reward: { type: "picture", file: "assets/images/Jesus_Payne.jpg" } },
  { id: "completista",  tier: "gold",   name: "Completista",         desc: "Desbloqueá todos los logros",         category: "clicks",  reward: { type: "frame", id: "gold-complete" } }
];

var ACHIEVEMENT_IMAGES = {
  mouse_roto: "🥉",      // emoji cuando no hay imagen custom
  foto_de_perfil: "🥉",  // emoji cuando no hay imagen custom
  comilla_bronce: "🥉",
  comilla_plata: "🥈",
  comilla_oro: "🥇",
  ruleta: "🥉"
};

var achievementsUnlocked = JSON.parse(localStorage.getItem("chaosAchievements") || "[]");
if (!Array.isArray(achievementsUnlocked)) achievementsUnlocked = [];

var chaosReachedHundredCount = parseInt(localStorage.getItem("chaosReachedHundredCount") || "0", 10);
var rouletteTotalSpins = parseInt(localStorage.getItem("chaosRouletteTotalSpins") || "0", 10);

function isAchievementUnlocked(id) {
  return achievementsUnlocked.indexOf(id) !== -1;
}

function unlockAchievement(id) {
  var ach = ACHIEVEMENTS.find(function(a) { return a.id === id; });
  if (!ach) return false;
  var wasUnlocked = isAchievementUnlocked(id);

  // Always apply reward (even if already unlocked) to fix missing rewards
  if (ach.reward && ach.reward.type === "picture" && inventory.pictures.indexOf(ach.reward.file) === -1) {
    inventory.pictures.push(ach.reward.file);
    saveInventory();
  }
  if (ach.reward && ach.reward.type === "frame" && inventory.frames.indexOf(ach.reward.id) === -1) {
    inventory.frames.push(ach.reward.id);
    saveInventory();
  }
  if (ach.reward && ach.reward.type === "slogan" && inventory.slogans.indexOf(ach.reward.id) === -1) {
    inventory.slogans.push(ach.reward.id);
    saveInventory();
  }

  if (wasUnlocked) return false;

  achievementsUnlocked.push(id);
  localStorage.setItem("chaosAchievements", JSON.stringify(achievementsUnlocked));
  showAchievementNotification(ach);
  if (ach.tier === "bronze") playSoundSafe("assets/sounds/powerup.mp3");
  else if (ach.tier === "silver") playSoundSafe("assets/sounds/equip.mp3");
  else if (ach.tier === "gold") playSoundSafe("assets/sounds/purchase.mp3");
  if (id === "completista") playSoundSafe("assets/sounds/galaxy-meme.mp3");
  return true;
}

function showAchievementNotification(ach) {
  var notif = document.getElementById("achievementNotification");
  var img = document.getElementById("achievementNotifImg");
  var tier = document.getElementById("achievementNotifTier");
  var name = document.getElementById("achievementNotifName");
  var desc = document.getElementById("achievementNotifDesc");

  notif.className = "tier-" + ach.tier;
  notif.classList.remove("show");
  void notif.offsetWidth;

  var imgSrc = ach.reward && ach.reward.file ? ach.reward.file : null;
  if (imgSrc) {
    img.src = imgSrc;
    img.style.display = "block";
  } else {
    img.style.display = "none";
  }

  var tierLabel = ach.tier === "bronze" ? "🥉 BRONCE" : ach.tier === "silver" ? "🥈 PLATA" : "🥇 ORO";
  tier.textContent = tierLabel;
  name.textContent = ach.name;
  desc.textContent = ach.desc;

  notif.classList.add("show");

  if (showAchievementNotification._timer) clearTimeout(showAchievementNotification._timer);
  showAchievementNotification._timer = setTimeout(function() {
    notif.classList.remove("show");
  }, 4500);
}

function checkAchievement(id) {
  if (isAchievementUnlocked(id)) {
    // Already unlocked, but still apply reward (in case it was missing)
    applyAchievementReward(id);
    return;
  }
  unlockAchievement(id);
}

function applyAchievementReward(id) {
  var ach = ACHIEVEMENTS.find(function(a) { return a.id === id; });
  if (!ach || !ach.reward) return;
  if (ach.reward.type === "picture" && inventory.pictures.indexOf(ach.reward.file) === -1) {
    inventory.pictures.push(ach.reward.file);
    saveInventory();
  }
  if (ach.reward.type === "frame" && inventory.frames.indexOf(ach.reward.id) === -1) {
    inventory.frames.push(ach.reward.id);
    saveInventory();
  }
  if (ach.reward.type === "slogan" && inventory.slogans.indexOf(ach.reward.id) === -1) {
    inventory.slogans.push(ach.reward.id);
    saveInventory();
  }
}

function checkAchievements() {
  ACHIEVEMENTS.forEach(function(ach) {
    if (isAchievementUnlocked(ach.id)) {
      // Already unlocked, but still apply reward (in case it was missing)
      applyAchievementReward(ach.id);
      return;
    }
    var unlocked = false;
    switch (ach.id) {
      case "first_step":   unlocked = totalClicks >= 100; break;
      case "clickeador":   unlocked = totalClicks >= 500; break;
      case "clickeador_pro":unlocked = totalClicks >= 5000; break;
      case "bot_frenesi":  unlocked = totalClicks >= 25000; break;
      case "mouse_breaker":unlocked = totalClicks >= 50000; break;
      case "riqueza":      unlocked = coins >= 1000; break;
      case "loco_completo":unlocked = chaosReachedHundredCount >= 3; break;
      case "first_boost":  unlocked = boostActivationsCount >= 1; break;
      case "maratonista":  unlocked = boostActivationsCount >= 10; break;
      case "marmolista":   unlocked = boostActivationsCount >= 25; break;
      case "foto_inicial": unlocked = inventory.pictures.length >= 1; break;
      case "slider":       unlocked = inventory.pictures.length >= 3; break;
      case "multitud":     unlocked = inventory.pictures.length >= 6; break;
      case "frase_marcada":unlocked = inventory.slogans.indexOf(equipped.slogan) !== -1 && equipped.slogan !== null; break;
      case "espia":        unlocked = inventory.slogans.length >= 3; break;
      case "espia_pro":    unlocked = inventory.slogans.length >= 6; break;
      case "tipografo":    unlocked = inventory.fonts.length >= 5; break;
      case "coleccionista_novato": unlocked = unlockedVideos.length >= 1; break;
      case "curador":      unlocked = unlockedVideos.length >= 3; break;
      case "ruletero":     unlocked = rouletteTotalSpins >= 5; break;
      case "ruleta_maestra":unlocked = rouletteTotalSpins >= 25; break;
      case "intelectual":  unlocked = unlockedFacts.length >= 10; break;
      case "bendecido":    unlocked = jesusRewardUnlocked; break;
    }
    if (unlocked) unlockAchievement(ach.id);
  });

  // Meta-logro: "Coleccionista" se desbloquea cuando TODOS los otros logros de la categoría "coleccion" están desbloqueados
  if (!isAchievementUnlocked("coleccionista")) {
    var coleccionAchievements = ACHIEVEMENTS.filter(function(a) {
      return a.category === "coleccion" && a.id !== "coleccionista";
    });
    var allColeccionUnlocked = coleccionAchievements.every(function(a) {
      return isAchievementUnlocked(a.id);
    });
    if (allColeccionUnlocked && coleccionAchievements.length > 0) {
      unlockAchievement("coleccionista");
    }
  }

  // Meta-logro: "Completista" se desbloquea cuando TODOS los demás están desbloqueados
  if (!isAchievementUnlocked("completista")) {
    var otherAchievements = ACHIEVEMENTS.filter(function(a) {
      return a.id !== "completista" && a.id !== "coleccionista";
    });
    var allOtherUnlocked = otherAchievements.every(function(a) {
      return isAchievementUnlocked(a.id);
    });
    if (allOtherUnlocked && otherAchievements.length > 0 && isAchievementUnlocked("coleccionista")) {
      unlockAchievement("completista");
    }
  }
}

function buildAchievements() {
  var list = document.getElementById("achievementsList");
  list.innerHTML = "";

  var tiers = [
    { key: "bronze", name: "BRONCE", emoji: "🥉" },
    { key: "silver", name: "PLATA",  emoji: "🥈" },
    { key: "gold",   name: "ORO",    emoji: "🥇" }
  ];

  tiers.forEach(function(tier) {
    var tierAchs = ACHIEVEMENTS.filter(function(a) { return a.tier === tier.key; });
    var section = document.createElement("div");
    section.className = "achievements-tier-section";

    var header = document.createElement("div");
    header.className = "achievements-tier-header tier-" + tier.key;
    var unlockedInTier = tierAchs.filter(function(a){ return isAchievementUnlocked(a.id); }).length;
    header.innerHTML = tier.emoji + " " + tier.name +
      '<span class="achievements-tier-count">' + unlockedInTier + " / " + tierAchs.length + "</span>";
    section.appendChild(header);

    var grid = document.createElement("div");
    grid.className = "achievements-grid";

    tierAchs.forEach(function(ach) {
      var card = document.createElement("div");
      var unlocked = isAchievementUnlocked(ach.id);
      card.className = "achievement-card tier-" + ach.tier + (unlocked ? " unlocked" : " locked");

      var imgSrc = ach.reward && ach.reward.file ? ach.reward.file : null;
      if (imgSrc) {
        var img = document.createElement("img");
        img.src = imgSrc;
        img.alt = ach.name;
        img.className = "achievement-card-img";
        img.onerror = function() { this.style.display = "none"; };
        card.appendChild(img);
      } else {
        var placeholder = document.createElement("div");
        placeholder.className = "achievement-card-img-placeholder";
        var emoji = tier.emoji;
        placeholder.textContent = emoji;
        card.appendChild(placeholder);
      }

      var name = document.createElement("div");
      name.className = "achievement-card-name";
      name.textContent = ach.name;
      card.appendChild(name);

      var status = document.createElement("div");
      status.className = "achievement-card-status";
      status.textContent = unlocked ? "✅" : "🔒";
      card.appendChild(status);

      if (ach.reward) {
        var badge = document.createElement("div");
        badge.className = "achievement-card-reward-badge";
        badge.textContent = "★";
        card.appendChild(badge);
      }

      card.title = ach.desc + (ach.reward ? " (Recompensa: " + (ach.reward.type === "picture" ? "foto" : "marco") + ")" : "");
      grid.appendChild(card);
    });

    section.appendChild(grid);
    list.appendChild(section);
  });

  document.getElementById("achievementsCount").textContent = achievementsUnlocked.length + " / " + ACHIEVEMENTS.length;
}

var achievementsOpen = false;
var achievementsBtn = document.getElementById("toggleAchievements");
var achievementsPanel = document.getElementById("achievementsPanel");
var achievementsCloseBtn = document.getElementById("achievementsClose");

achievementsBtn.addEventListener("click", function() {
  achievementsOpen = !achievementsOpen;
  if (achievementsOpen) {
    achievementsPanel.classList.add("open");
    buildAchievements();
  } else {
    achievementsPanel.classList.remove("open");
  }
});
achievementsCloseBtn.addEventListener("click", function() {
  achievementsPanel.classList.remove("open");
  achievementsOpen = false;
});
achievementsPanel.addEventListener("click", function(e) {
  if (e.target === achievementsPanel) {
    achievementsPanel.classList.remove("open");
    achievementsOpen = false;
  }
});

var inventory = JSON.parse(localStorage.getItem("chaosInventory") || '{"pictures":[],"fonts":[],"accessories":[],"slogans":[]}');
if (!inventory.pictures) inventory.pictures = [];
if (!inventory.fonts) inventory.fonts = [];
if (!inventory.accessories) inventory.accessories = [];
if (!inventory.slogans) inventory.slogans = [];
if (!inventory.frames) inventory.frames = [];
if (!inventory.collectibles) inventory.collectibles = [];

var equipped = JSON.parse(localStorage.getItem("chaosEquipped") || '{"picture":null,"font":null,"accessory":null,"slogan":null}');
if (!equipped.picture) equipped.picture = null;
if (!equipped.slogan) equipped.slogan = null;
if (!equipped.frame) equipped.frame = null;

var shopOpen = false;

function migrateAssetPaths() {
  var migrated = false;

  if (Array.isArray(unlockedVideos)) {
    unlockedVideos.forEach(function(v) {
      if (v && v.file && v.file.indexOf("assets/") !== 0 && /\.mp4$/i.test(v.file)) {
        v.file = "assets/videos/" + v.file;
        migrated = true;
      }
    });
  }

  if (Array.isArray(inventory.pictures)) {
    inventory.pictures = inventory.pictures.map(function(p) {
      if (typeof p === "string" && p.indexOf("assets/") !== 0 && /\.(jpg|jpeg|png|webp)$/i.test(p)) {
        migrated = true;
        return "assets/images/" + p;
      }
      return p;
    });
  }

  if (Array.isArray(inventory.collectibles)) {
    inventory.collectibles = inventory.collectibles.map(function(id) {
      if (typeof id === "string" && id.indexOf("assets/") !== 0) {
        migrated = true;
        return "assets/images/" + id;
      }
      return id;
    });
  }

  if (equipped.picture && typeof equipped.picture === "string" && equipped.picture.indexOf("assets/") !== 0 && /\.(jpg|jpeg|png|webp)$/i.test(equipped.picture)) {
    equipped.picture = "assets/images/" + equipped.picture;
    migrated = true;
  }

  if (migrated) {
    localStorage.setItem("chaosVideos", JSON.stringify(unlockedVideos));
    localStorage.setItem("chaosInventory", JSON.stringify(inventory));
    localStorage.setItem("chaosEquipped", JSON.stringify(equipped));
  }
}
migrateAssetPaths();

function saveInventory() {
  localStorage.setItem("chaosInventory", JSON.stringify(inventory));
}
function saveEquipped() {
  localStorage.setItem("chaosEquipped", JSON.stringify(equipped));
}

function showToast(message, type) {
  var existing = document.querySelector(".toast");
  if (existing) existing.parentNode.removeChild(existing);
  var toast = document.createElement("div");
  toast.className = "toast " + (type || "info");
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(function() { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 2400);
}

function isOwned(picFile) {
  return inventory.pictures.indexOf(picFile) !== -1;
}

function isOwnedFont(fontKey) {
  return inventory.fonts.indexOf(fontKey) !== -1;
}

function canBuy(pic) {
  if (pic.requiresBoosts && boostActivationsCount < pic.requiresBoosts) return false;
  return coins >= pic.price && totalClicks >= pic.req;
}

function canBuyFont(font) {
  return coins >= font.price;
}

function isOwnedFrame(frameId) {
  return inventory.frames ? inventory.frames.indexOf(frameId) !== -1 : false;
}

function canBuyFrame(frame) {
  if (frame.requiresRoulette === "divine" && !jesusRewardUnlocked) return false;
  return true;
}

function buyPicture(pic) {
  if (isOwned(pic.file)) return;
  if (!canBuy(pic)) {
    if (pic.requiresBoosts && boostActivationsCount < pic.requiresBoosts) {
      showToast("Necesitas " + pic.requiresBoosts + " boosts activados", "error");
    } else if (coins < pic.price) {
      showToast("Monedas insuficientes", "error");
    } else {
      showToast("Necesitas " + formatNumber(pic.req) + " clicks totales", "error");
    }
    return;
  }
  coins -= pic.price;
  localStorage.setItem("chaosCoins", String(coins));
  coinNumberEl.textContent = formatNumber(coins);
  updateShopBalance();
  inventory.pictures.push(pic.file);
  saveInventory();
  showToast(pic.name + " comprado!", "success");
  playSoundSafe("assets/sounds/purchase.mp3");
  buildShop();
  checkAchievements();
}

function equipPicture(pic) {
  if (!isOwned(pic.file)) return;
  equipped.picture = pic.file;
  saveEquipped();
  showToast(pic.name + " equipado", "info");
  playSoundSafe("assets/sounds/equip.mp3");
  buildShop();
  updateProfile();
  checkAchievements();
}

function buyFont(font) {
  if (isOwnedFont(font.key)) return;
  if (!canBuyFont(font)) {
    showToast("Monedas insuficientes", "error");
    return;
  }
  coins -= font.price;
  localStorage.setItem("chaosCoins", String(coins));
  coinNumberEl.textContent = formatNumber(coins);
  updateShopBalance();
  inventory.fonts.push(font.key);
  saveInventory();
  showToast(font.name + " comprada!", "success");
  playSoundSafe("assets/sounds/purchase.mp3");
  buildShop();
  checkAchievements();
}

function equipFont(font) {
  if (!isOwnedFont(font.key)) return;
  equipped.font = font.key;
  saveEquipped();
  showToast(font.name + " equipada", "info");
  playSoundSafe("assets/sounds/equip.mp3");
  buildShop();
  updateProfile();
  checkAchievements();
}

function isOwnedSlogan(sloganKey) {
  return inventory.slogans.indexOf(sloganKey) !== -1;
}

function canBuySlogan(slogan) {
  if (slogan.requiresBoosts && boostActivationsCount < slogan.requiresBoosts) return false;
  if (slogan.requiresRoulette === "divine" && !jesusRewardUnlocked) return false;
  return coins >= slogan.price;
}

function buySlogan(slogan) {
  if (isOwnedSlogan(slogan.key)) return;
  if (!canBuySlogan(slogan)) {
    if (slogan.requiresBoosts && boostActivationsCount < slogan.requiresBoosts) {
      showToast("Necesitas " + slogan.requiresBoosts + " boosts activados", "error");
    } else {
      showToast("Monedas insuficientes", "error");
    }
    return;
  }
  coins -= slogan.price;
  localStorage.setItem("chaosCoins", String(coins));
  coinNumberEl.textContent = formatNumber(coins);
  updateShopBalance();
  inventory.slogans.push(slogan.key);
  saveInventory();
  showToast("\u201C" + slogan.name + "\u201D comprada!", "success");
  playSoundSafe("assets/sounds/purchase.mp3");
  buildShop();
  checkAchievements();
}

function equipSlogan(slogan) {
  if (!isOwnedSlogan(slogan.key)) return;
  equipped.slogan = slogan.key;
  saveEquipped();
  showToast("\u201C" + slogan.name + "\u201D equipada", "info");
  playSoundSafe("assets/sounds/equip.mp3");
  buildShop();
  updateProfile();
  checkAchievements();
}

function buildShopSection(title) {
  var h = document.createElement("div");
  h.className = "shop-section-header";
  h.textContent = title;
  return h;
}

function buildShopPicture(pic) {
  var owned = isOwned(pic.file);
  var equippedNow = equipped.picture === pic.file;
  var buyable = canBuy(pic);
  var secretLocked = pic.requiresBoosts && boostActivationsCount < pic.requiresBoosts;

  var item = document.createElement("div");
  item.className = "shop-item" + (owned ? " owned" : "") + (equippedNow ? " equipped" : "") + (!owned && !buyable ? " locked" : "") + (secretLocked ? " secret-locked" : "");

  var imgWrap = document.createElement("div");
  imgWrap.className = "shop-item-img-wrap";
  var img = document.createElement("img");
  img.className = "shop-item-img";
  img.src = pic.file;
  img.alt = pic.name;
  img.onerror = function() {
    this.style.background = "rgba(255,80,80,0.2)";
    this.alt = "img missing";
  };
  imgWrap.appendChild(img);
  if (secretLocked) {
    var lock = document.createElement("div");
    lock.className = "shop-item-lock";
    lock.textContent = "\uD83D\uDD12 " + pic.requiresBoosts + " boosts";
    imgWrap.appendChild(lock);
  }

  var info = document.createElement("div");
  info.className = "shop-item-info";

  var name = document.createElement("div");
  name.className = "shop-item-name";
  name.textContent = pic.name;

  var req = document.createElement("div");
  req.className = "shop-item-req";
  if (secretLocked) {
    var reqSpan = document.createElement("span");
    reqSpan.className = "no";
    reqSpan.textContent = "\uD83D\uDD12 " + pic.requiresBoosts + " boosts";
    req.appendChild(reqSpan);
  } else {
    var priceSpan = document.createElement("span");
    priceSpan.className = coins >= pic.price ? "ok" : "no";
    priceSpan.textContent = pic.price + " \uD83E\uDE99";
    var clicksSpan = document.createElement("span");
    clicksSpan.className = totalClicks >= pic.req ? "ok" : "no";
    clicksSpan.textContent = formatNumber(pic.req) + " clicks";
    req.appendChild(priceSpan);
    req.appendChild(clicksSpan);
  }

  info.appendChild(name);
  info.appendChild(req);

  var action = document.createElement("button");
  action.className = "shop-item-action";
  if (equippedNow) {
    action.classList.add("equipped");
    action.textContent = "EQUIPADO";
    action.disabled = true;
  } else if (owned) {
    action.classList.add("equip");
    action.textContent = "EQUIPAR";
    action.onclick = function() { equipPicture(pic); };
  } else {
    action.textContent = "COMPRAR";
    action.disabled = !buyable;
    action.onclick = function() { buyPicture(pic); };
  }

  item.appendChild(imgWrap);
  item.appendChild(info);
  item.appendChild(action);
  return item;
}

function buildShopFont(font) {
  var owned = isOwnedFont(font.key);
  var equippedNow = equipped.font === font.key;
  var buyable = canBuyFont(font);

  var item = document.createElement("div");
  item.className = "shop-item font-item" + (owned ? " owned" : "") + (equippedNow ? " equipped" : "") + (!owned && !buyable ? " locked" : "");

  var preview = document.createElement("div");
  preview.className = "shop-item-font-preview";
  preview.style.fontFamily = font.css;
  preview.textContent = font.sample;

  var info = document.createElement("div");
  info.className = "shop-item-info";

  var name = document.createElement("div");
  name.className = "shop-item-name";
  name.textContent = font.name;

  var req = document.createElement("div");
  req.className = "shop-item-req";
  var priceSpan = document.createElement("span");
  priceSpan.className = coins >= font.price ? "ok" : "no";
  priceSpan.textContent = font.price + " 🪙";
  req.appendChild(priceSpan);

  info.appendChild(name);
  info.appendChild(req);

  var action = document.createElement("button");
  action.className = "shop-item-action";
  if (equippedNow) {
    action.classList.add("equipped");
    action.textContent = "EQUIPADA";
    action.disabled = true;
  } else if (owned) {
    action.classList.add("equip");
    action.textContent = "EQUIPAR";
    action.onclick = function() { equipFont(font); };
  } else {
    action.textContent = "COMPRAR";
    action.disabled = !buyable;
    action.onclick = function() { buyFont(font); };
  }

  item.appendChild(preview);
  item.appendChild(info);
  item.appendChild(action);
  return item;
}

function buildShopSlogan(slogan) {
  var owned = isOwnedSlogan(slogan.key);
  var equippedNow = equipped.slogan === slogan.key;
  var buyable = canBuySlogan(slogan);
  var secretLocked = slogan.requiresBoosts && boostActivationsCount < slogan.requiresBoosts;

  var item = document.createElement("div");
  item.className = "shop-item slogan-item" + (owned ? " owned" : "") + (equippedNow ? " equipped" : "") + (!owned && !buyable ? " locked" : "") + (secretLocked ? " secret-locked" : "");

  var quote = document.createElement("div");
  quote.className = "shop-item-slogan-quote";
  quote.textContent = secretLocked ? "\uD83D\uDD12" : "\u201C";

  var info = document.createElement("div");
  info.className = "shop-item-info";

  var name = document.createElement("div");
  name.className = "shop-item-name";
  name.textContent = secretLocked ? "???" : slogan.name;

  var req = document.createElement("div");
  req.className = "shop-item-req";
  if (secretLocked) {
    var reqSpan = document.createElement("span");
    reqSpan.className = "no";
    reqSpan.textContent = "\uD83D\uDD12 " + slogan.requiresBoosts + " boosts";
    req.appendChild(reqSpan);
  } else {
    var priceSpan = document.createElement("span");
    priceSpan.className = coins >= slogan.price ? "ok" : "no";
    priceSpan.textContent = slogan.price + " \uD83E\uDE99";
    req.appendChild(priceSpan);
  }

  info.appendChild(name);
  info.appendChild(req);

  var action = document.createElement("button");
  action.className = "shop-item-action";
  if (equippedNow) {
    action.classList.add("equipped");
    action.textContent = "EQUIPADA";
    action.disabled = true;
  } else if (owned) {
    action.classList.add("equip");
    action.textContent = "EQUIPAR";
    action.onclick = function() { equipSlogan(slogan); };
  } else {
    action.textContent = "COMPRAR";
    action.disabled = !buyable;
    action.onclick = function() { buySlogan(slogan); };
  }

  item.appendChild(quote);
  item.appendChild(info);
  item.appendChild(action);
  return item;
}

function buildShop() {
  var list = document.getElementById("shopList");
  list.innerHTML = "";

  list.appendChild(buildShopSection("FOTOS DE PERFIL"));
  SHOP_PICTURES.forEach(function(pic) {
    list.appendChild(buildShopPicture(pic));
  });

  list.appendChild(buildShopSection("FUENTES"));
  SHOP_FONTS.forEach(function(font) {
    list.appendChild(buildShopFont(font));
  });

  list.appendChild(buildShopSection("FRASES"));
  SHOP_SLOGANS.forEach(function(slogan) {
    list.appendChild(buildShopSlogan(slogan));
  });

  if (boostsUnlocked()) {
    list.appendChild(buildShopSection("SECRETOS · 5 BOOSTS"));
    SHOP_SECRET_PICTURES.forEach(function(pic) {
      list.appendChild(buildShopPicture(pic));
    });
    SHOP_SECRET_SLOGANS.forEach(function(slogan) {
      list.appendChild(buildShopSlogan(slogan));
    });
  }

  if (jesusRewardUnlocked) {
    list.appendChild(buildShopSection("MARCOS · BENDICIÓN"));
    SHOP_FRAMES.forEach(function(frame) {
      list.appendChild(buildShopFrame(frame));
    });
  }

  // Achievement rewards shown in shop (if owned) - separate from regular shop
  var rewardSections = [
    { file: "assets/images/Rat\u00f3n_gamer.jpg", name: "Mouse Breaker", section: "MOUSE BREAKER" },
    { file: "assets/images/Nikola-Albert.webp", name: "Intelectual", section: "INTELECTUAL" },
    { file: "assets/images/medalla_de_oro.jpg", name: "Coleccionista", section: "COLECCIONISTA" },
    { file: "assets/images/Jesus_Payne.jpg", name: "Bendecido", section: "BENDECIDO" }
  ];
  var shownSections = {};
  rewardSections.forEach(function(r) {
    if (inventory.pictures.indexOf(r.file) >= 0) {
      if (!shownSections[r.section]) {
        list.appendChild(buildShopSection("RECOMPENSA · " + r.section));
        shownSections[r.section] = true;
      }
      list.appendChild(buildShopPicture({ file: r.file, name: r.name, isReward: true }));
    }
  });
}

function buildShopFrame(frame) {
  var owned = inventory.frames.indexOf(frame.id) !== -1;
  var equippedNow = equipped.frame === frame.id;
  var buyable = canBuyFrame(frame);

  var item = document.createElement("div");
  item.className = "shop-item frame-item" + (owned ? " owned" : "") + (equippedNow ? " equipped" : "") + (!owned && !buyable ? " locked" : "");

  var preview = document.createElement("div");
  preview.className = "shop-item-frame-preview";
  if (owned && frame.id === "jesus-blessing") {
    preview.classList.add("framed-jesus-blessing");
  }

  var info = document.createElement("div");
  info.className = "shop-item-info";

  var name = document.createElement("div");
  name.className = "shop-item-name";
  name.textContent = frame.name;

  var req = document.createElement("div");
  req.className = "shop-item-req";
  var reqSpan = document.createElement("span");
  reqSpan.className = "no";
  reqSpan.textContent = "\u2715 Bendición divina";
  req.appendChild(reqSpan);

  info.appendChild(name);
  info.appendChild(req);

  var action = document.createElement("button");
  action.className = "shop-item-action";
  if (equippedNow) {
    action.classList.add("equipped");
    action.textContent = "EQUIPADO";
    action.disabled = true;
  } else if (owned) {
    action.classList.add("equip");
    action.textContent = "EQUIPAR";
    action.onclick = function() { equipFrame(frame); };
  } else {
    action.textContent = "BLOQUEADO";
    action.disabled = true;
  }

  item.appendChild(preview);
  item.appendChild(info);
  item.appendChild(action);
  return item;
}

function equipFrame(frame) {
  equipped.frame = equipped.frame === frame.id ? null : frame.id;
  saveEquipped();
  updateProfile();
  buildShop();
}

function updateShopBalance() {
  document.getElementById("shopBalanceNum").textContent = formatNumber(coins);
}

function openShop() {
  shopOpen = true;
  document.getElementById("shopPanel").classList.add("open");
  updateShopBalance();
  buildShop();
}
function closeShop() {
  shopOpen = false;
  document.getElementById("shopPanel").classList.remove("open");
}

document.getElementById("toggleShop").addEventListener("click", function() {
  if (shopOpen) closeShop();
  else openShop();
});
document.getElementById("shopClose").addEventListener("click", closeShop);

/* ========================= */
/* COIN EVENTS SPAWNER (Fase 3) */
/* ========================= */

var coinEvent = null;
var nextCoinEventTime = Date.now() + 4000;
var COIN_EVENT_FILES = {
  cat: "assets/sounds/meow.mp3",
  sardine: "assets/sounds/splash.mp3"
};

var splashSound = null;
try {
  splashSound = new Audio("assets/sounds/splash.mp3");
  splashSound.volume = 0.4;
  splashSound.preload = "auto";
} catch (e) {}

function playSoundSafe(file, volume) {
  try {
    var s = new Audio(file);
    s.volume = volume || 0.4;
    s.play().catch(function() {});
  } catch (e) {}
}

function playSplash() {
  if (splashSound) {
    try {
      splashSound.currentTime = 0;
      splashSound.play().catch(function() {});
    } catch (e) {}
  }
}

function finishCoinEvent() {
  if (coinEvent && coinEvent.timeoutId) clearTimeout(coinEvent.timeoutId);
  coinEvent = null;
  nextCoinEventTime = Date.now() + 8000 + Math.random() * 12000;
}

function spawnFallingCat() {
  if (!canCreate("falling-cat")) return;
  var cat = document.createElement("div");
  cat.className = "falling-cat";
  cat.innerHTML = '<img src="assets/images/Gato.jpg" alt="cat" draggable="false">';
  cat.style.left = (5 + Math.random() * 85) + "%";
  document.body.appendChild(cat);

  var clicked = false;
  function clickHandler(e) {
    if (clicked) return;
    clicked = true;
    e.stopPropagation();
    addCoins(5, "event", true);
    playSoundSafe(COIN_EVENT_FILES.cat);
    finishCoinEvent();
    cat.classList.add("caught");
    setTimeout(function() { trackedRemove(cat, "falling-cat"); }, 500);
  }
  cat.addEventListener("click", clickHandler);

  coinEvent = { type: "cat", el: cat, timeoutId: null };
  setTimeout(function() { if (!clicked) cat.classList.add("falling"); }, 80);

  coinEvent.timeoutId = setTimeout(function() {
    if (clicked) return;
    cat.classList.add("missed");
    finishCoinEvent();
    setTimeout(function() { trackedRemove(cat, "falling-cat"); }, 300);
  }, 2500);
}

function spawnSardine() {
  if (!canCreate("sardine")) return;
  var fish = document.createElement("div");
  fish.className = "sardine";
  fish.innerHTML = '<img src="assets/images/Sardina.jpg" alt="sardine" draggable="false">';
  fish.style.bottom = (8 + Math.random() * 30) + "%";
  document.body.appendChild(fish);

  var clicked = false;
  function clickHandler(e) {
    if (clicked) return;
    clicked = true;
    e.stopPropagation();
    addCoins(5, "event", true);
    playSplash();
    finishCoinEvent();
    fish.classList.add("caught");
    setTimeout(function() { trackedRemove(fish, "sardine"); }, 500);
  }
  fish.addEventListener("click", clickHandler);

  coinEvent = { type: "sardine", el: fish, timeoutId: null };
  setTimeout(function() { if (!clicked) fish.classList.add("swimming"); }, 80);

  coinEvent.timeoutId = setTimeout(function() {
    if (clicked) return;
    fish.classList.add("missed");
    finishCoinEvent();
    setTimeout(function() { trackedRemove(fish, "sardine"); }, 300);
  }, 4000);
}

function spawnCoinButton() {
  if (!canCreate("coin-button")) return;
  var btn = document.createElement("div");
  btn.className = "coin-button";
  btn.innerHTML = "<span>+1 MONEDA</span>";
  btn.style.left = (8 + Math.random() * 75) + "%";
  btn.style.top = (18 + Math.random() * 55) + "%";
  document.body.appendChild(btn);

  var clicked = false;
  function clickHandler(e) {
    if (clicked) return;
    clicked = true;
    e.stopPropagation();
    addCoins(1, "normal");
    finishCoinEvent();
    btn.classList.add("caught");
    setTimeout(function() { trackedRemove(btn, "coin-button"); }, 400);
  }
  btn.addEventListener("click", clickHandler);

  coinEvent = { type: "coin-button", el: btn, timeoutId: null };

  coinEvent.timeoutId = setTimeout(function() {
    if (clicked) return;
    btn.classList.add("missed");
    finishCoinEvent();
    setTimeout(function() { trackedRemove(btn, "coin-button"); }, 300);
  }, 3000);
}

function spawnCoinEvent() {
  if (coinEvent) return;
  var r = Math.random();
  if (r < 0.30) spawnFallingCat();
  else if (r < 0.55) spawnSardine();
  else spawnCoinButton();
}

setInterval(function() {
  if (!coinEvent && Date.now() >= nextCoinEventTime) {
    spawnCoinEvent();
  }
}, 500);

/* ========================= */
/* PROFILE BAR (Fase 8) */
/* ========================= */

var PLACEHOLDER_PHOTO_SVG = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%23333'/><circle cx='50' cy='40' r='15' fill='%23666'/><path d='M 20 85 Q 50 60 80 85 L 80 100 L 20 100 Z' fill='%23666'/></svg>";

var playerName = localStorage.getItem("chaosPlayerName") || "Player";
var profilePhotoEl = document.getElementById("profilePhoto");
var profileNameEl = document.getElementById("profileName");
var profileSloganEl = document.getElementById("profileSlogan");
var profileEditEl = document.getElementById("profileEdit");
var DEFAULT_FONT = "'Bungee', cursive";

function getEquippedFont() {
  if (!equipped.font) return null;
  for (var i = 0; i < SHOP_FONTS.length; i++) {
    if (SHOP_FONTS[i].key === equipped.font) return SHOP_FONTS[i];
  }
  return null;
}

function getEquippedSlogan() {
  if (!equipped.slogan) return null;
  for (var i = 0; i < SHOP_SLOGANS.length; i++) {
    if (SHOP_SLOGANS[i].key === equipped.slogan) return SHOP_SLOGANS[i];
  }
  for (var j = 0; j < SHOP_SECRET_SLOGANS.length; j++) {
    if (SHOP_SECRET_SLOGANS[j].key === equipped.slogan) return SHOP_SECRET_SLOGANS[j];
  }
  return null;
}

function updateProfile() {
  if (equipped.picture) {
    profilePhotoEl.src = equipped.picture;
    profilePhotoEl.onerror = function() {
      this.onerror = null;
      this.src = PLACEHOLDER_PHOTO_SVG;
    };
  } else {
    profilePhotoEl.src = PLACEHOLDER_PHOTO_SVG;
  }

  var f = getEquippedFont();
  profileNameEl.style.fontFamily = f ? f.css : DEFAULT_FONT;

  var s = getEquippedSlogan();
  profileSloganEl.textContent = s ? "\u201C" + s.name + "\u201D" : "";

  profileNameEl.textContent = playerName;

  var wrap = document.getElementById("profilePhotoWrap");
  if (wrap) {
    wrap.classList.remove("framed-jesus-blessing");
    if (equipped.frame === "jesus-blessing") {
      wrap.classList.add("framed-jesus-blessing");
    }
  }
}

function startEditName() {
  if (profileNameEl.getAttribute("contenteditable") === "true") return;
  profileNameEl.setAttribute("contenteditable", "true");
  profileNameEl.focus();
  var range = document.createRange();
  range.selectNodeContents(profileNameEl);
  var sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
}

function commitEditName() {
  if (profileNameEl.getAttribute("contenteditable") !== "true") return;
  profileNameEl.setAttribute("contenteditable", "false");
  var raw = (profileNameEl.textContent || "").trim().slice(0, 20);
  if (!raw) raw = "Player";
  playerName = raw;
  localStorage.setItem("chaosPlayerName", playerName);
  profileNameEl.textContent = playerName;
  profileNameEl.blur();
}

function cancelEditName() {
  if (profileNameEl.getAttribute("contenteditable") !== "true") return;
  profileNameEl.setAttribute("contenteditable", "false");
  profileNameEl.textContent = playerName;
  profileNameEl.blur();
}

profileEditEl.addEventListener("click", function(e) {
  e.stopPropagation();
  startEditName();
});

profileNameEl.addEventListener("click", function() {
  startEditName();
});

profileNameEl.addEventListener("keydown", function(e) {
  if (e.key === "Enter") {
    e.preventDefault();
    commitEditName();
  } else if (e.key === "Escape") {
    e.preventDefault();
    cancelEditName();
  }
});

profileNameEl.addEventListener("blur", function() {
  if (profileNameEl.getAttribute("contenteditable") === "true") {
    commitEditName();
  }
});

profileNameEl.addEventListener("paste", function(e) {
  e.preventDefault();
  var text = (e.clipboardData || window.clipboardData).getData("text");
  document.execCommand("insertText", false, text);
});

updateProfile();

/* ========================= */
/* BOOST SYSTEM (Fase 2) */
/* ========================= */

var boostCharge = parseFloat(localStorage.getItem("chaosBoostCharge") || "0");
if (!isFinite(boostCharge) || isNaN(boostCharge)) boostCharge = 0;
var boostCooldownUntil = parseInt(localStorage.getItem("chaosBoostCooldownUntil") || "0", 10);
if (!isFinite(boostCooldownUntil) || isNaN(boostCooldownUntil)) boostCooldownUntil = 0;
var boostActiveUntil = parseInt(localStorage.getItem("chaosBoostActiveUntil") || "0", 10);
if (!isFinite(boostActiveUntil) || isNaN(boostActiveUntil)) boostActiveUntil = 0;
var boostActivationsCount = parseInt(localStorage.getItem("chaosBoostActivationsCount") || "0", 10);
if (!isFinite(boostActivationsCount) || isNaN(boostActivationsCount)) boostActivationsCount = 0;
var boostMilestone5Shown = localStorage.getItem("chaosBoostMilestone5") === "1";
var lastBoostClickTime = 0;

var boostBarEl = document.getElementById("boostBar");
var boostBarTrackEl = document.getElementById("boostBarTrack");
var boostBarLabelEl = document.getElementById("boostBarLabel");
var boostBarPercentEl = document.getElementById("boostBarPercent");
var boostCountEl = document.getElementById("boostCounterNumber");
var boostCounterEl = document.getElementById("boostCounter");
var boostBannerEl = document.getElementById("boostBanner");
var boostBannerSubEl = document.getElementById("boostBannerSub");

var BOOST_DURATION_MS = 10000;
var BOOST_COOLDOWN_MS = 30000;
var BOOST_CHARGE_PER_CLICK = 0.5;
var BOOST_DECAY_PER_100MS = 0.2;
var BOOST_DECAY_DELAY_MS = 800;
var BOOST_REQUIRED_FOR_UNLOCK = 5;

function saveBoost() {
  localStorage.setItem("chaosBoostCharge", String(boostCharge));
  localStorage.setItem("chaosBoostCooldownUntil", String(boostCooldownUntil));
  localStorage.setItem("chaosBoostActiveUntil", String(boostActiveUntil));
  localStorage.setItem("chaosBoostActivationsCount", String(boostActivationsCount));
  localStorage.setItem("chaosBoostMilestone5", boostMilestone5Shown ? "1" : "0");
}

function isBoostActive() {
  return boostActiveUntil > Date.now();
}
function isBoostCooldown() {
  return boostCooldownUntil > Date.now();
}
function getBoostMultiplier() {
  return isBoostActive() ? 2 : 1;
}
function boostsUnlocked() {
  return boostActivationsCount >= BOOST_REQUIRED_FOR_UNLOCK;
}

function applyBoostClick() {
  if (isBoostActive() || isBoostCooldown()) return;
  boostCharge = Math.min(100, boostCharge + BOOST_CHARGE_PER_CLICK);
  lastBoostClickTime = Date.now();
  saveBoost();
  if (boostCharge >= 100) {
    activateBoost();
  }
}

function decayBoost() {
  if (isBoostActive() || isBoostCooldown()) return;
  if (boostCharge <= 0) return;
  if (Date.now() - lastBoostClickTime < BOOST_DECAY_DELAY_MS) return;
  boostCharge = Math.max(0, boostCharge - BOOST_DECAY_PER_100MS);
  saveBoost();
}

function activateBoost() {
  boostCharge = 0;
  boostActiveUntil = Date.now() + BOOST_DURATION_MS;
  boostCooldownUntil = Date.now() + BOOST_DURATION_MS + BOOST_COOLDOWN_MS;
  boostActivationsCount += 1;

  addCoins(25, "boost", true);
  showBoostBanner();
  playSoundSafe("assets/sounds/powerup.mp3");

  boostCountEl.textContent = formatNumber(boostActivationsCount);

  if (!boostMilestone5Shown && boostActivationsCount >= BOOST_REQUIRED_FOR_UNLOCK) {
    boostMilestone5Shown = true;
    boostCounterEl.classList.add("milestone");
    setTimeout(function() { boostCounterEl.classList.remove("milestone"); }, 1200);
    setTimeout(function() {
      showToast("¡Mouse breaker desbloqueado! 5 boosts activados", "success");
      setTimeout(function() { showToast("Revisá la tienda, hay items secretos", "info"); }, 2500);
    }, 1800);
  }

  saveBoost();
  if (typeof buildShop === "function") buildShop();
  checkAchievements();
}

function showBoostBanner() {
  boostBannerSubEl.textContent = "+25 monedas · 10 segundos";
  boostBannerEl.classList.add("show");
  setTimeout(function() { boostBannerEl.classList.remove("show"); }, 1800);
}

function renderBoost() {
  var pct = Math.max(0, Math.min(100, boostCharge));
  boostBarEl.style.width = pct + "%";
  boostBarPercentEl.textContent = Math.floor(pct) + "%";

  if (isBoostActive()) {
    boostBarTrackEl.className = "boost-bar-track active";
    var secs = Math.ceil((boostActiveUntil - Date.now()) / 1000);
    boostBarLabelEl.textContent = "BOOST x2 · " + secs + "s";
    boostBarLabelEl.classList.add("show");
    chaosBtn.classList.add("boost-active");
    boostBarPercentEl.textContent = "x2";
  } else if (isBoostCooldown()) {
    boostBarTrackEl.className = "boost-bar-track cooldown";
    var secs = Math.ceil((boostCooldownUntil - Date.now()) / 1000);
    boostBarLabelEl.textContent = "COOLDOWN · " + secs + "s";
    boostBarLabelEl.classList.add("show");
    chaosBtn.classList.remove("boost-active");
    boostBarPercentEl.textContent = "CD";
  } else if (boostCharge >= 100) {
    boostBarTrackEl.className = "boost-bar-track ready";
    boostBarLabelEl.textContent = "¡LISTO!";
    boostBarLabelEl.classList.add("show");
    chaosBtn.classList.remove("boost-active");
    boostBarPercentEl.textContent = "100%";
  } else {
    boostBarTrackEl.className = "boost-bar-track";
    boostBarLabelEl.classList.remove("show");
    chaosBtn.classList.remove("boost-active");
  }

  boostCountEl.textContent = formatNumber(boostActivationsCount);
}

function boostLoop() {
  decayBoost();
  if (boostActiveUntil > 0 && boostActiveUntil <= Date.now() && !isBoostActive()) {
    boostActiveUntil = 0;
    saveBoost();
  }
  renderBoost();
  setTimeout(boostLoop, 100);
}
boostLoop();
renderBoost();

/* ========================= */
/* ROULETTE SYSTEM (Fase 10) */
/* ========================= */

var ROULETTE_PRIZES = [
  { id: "doge",     name: "Doge",              img: "assets/images/Doge.jpg",          weight: 25, tier: "common", isCollectible: true,  desc: "Un clásico" },
  { id: "agua",     name: "Agua en polvo",     img: "assets/images/Agua_en_polvo.jpg", weight: 25, tier: "common", isCollectible: true,  desc: "Solo échale agua" },
  { id: "rengoku",  name: "Rengoku dona",      img: "assets/images/Rengoku_dona.jpg",  weight: 10, tier: "rare",   isCollectible: true,  desc: "Créditos al panadero Akaza" },
  { id: "100coins", name: "100 monedas",       img: null,                                weight: 10, tier: "rare",   isCollectible: false, desc: "", coins: 100 },
  { id: "venpaca",  name: "Ven pa' acá",       img: "assets/images/Ven_paca.jpg",      weight: 10, tier: "rare",   isCollectible: true,  desc: "No vayas" },
  { id: "atun",     name: "Atún con mayonesa", img: "assets/images/Atun_con_mayonesa.jpg", weight: 15, tier: "mythic", isCollectible: true, desc: "Inumaki siendo Inumaki" },
  { id: "jackpot",  name: "Jackpot",           img: null,                                weight: 5,  tier: "jackpot", isCollectible: false, desc: "", coins: 500 }
];

var ROULETTE_SPIN_COST = 50;
var ROULETTE_SPIN_DURATION_MS = 7500;
var ROULETTE_CLICKS_PER_SPIN = 500;
var ROULETTE_SECTOR_COUNT = ROULETTE_PRIZES.length;
var ROULETTE_SECTOR_ANGLE = 360 / ROULETTE_SECTOR_COUNT;

var rouletteSpinsCount = parseInt(localStorage.getItem("chaosRouletteSpins") || "0", 10);
var rouletteCurrentRotation = 0;
var rouletteSpinning = false;

function saveRouletteState() {
  localStorage.setItem("chaosRouletteSpins", String(rouletteSpinsCount));
  localStorage.setItem("chaosJesusReward", jesusRewardUnlocked ? "1" : "0");
}

function isCollectibleOwned(id) {
  return inventory.collectibles.indexOf(id) !== -1;
}

function getRouletteClicksThreshold() {
  return (rouletteSpinsCount + 1) * ROULETTE_CLICKS_PER_SPIN;
}

function rollPrize() {
  var totalWeight = 0;
  for (var i = 0; i < ROULETTE_PRIZES.length; i++) totalWeight += ROULETTE_PRIZES[i].weight;
  var roll = Math.random() * totalWeight;
  var acc = 0;
  for (var j = 0; j < ROULETTE_PRIZES.length; j++) {
    acc += ROULETTE_PRIZES[j].weight;
    if (roll < acc) return ROULETTE_PRIZES[j];
  }
  return ROULETTE_PRIZES[ROULETTE_PRIZES.length - 1];
}

function getTierColor(tier) {
  if (tier === "common")  return "#ffc107";
  if (tier === "rare")    return "#9c27b0";
  if (tier === "mythic")  return "#f44336";
  if (tier === "jackpot") return "#ff5722";
  return "#666";
}

function buildRouletteWheel() {
  var inner = document.getElementById("rouletteWheelInner");
  inner.innerHTML = "";
  var cx = 150, cy = 150, r = 140;
  for (var i = 0; i < ROULETTE_PRIZES.length; i++) {
    var prize = ROULETTE_PRIZES[i];
    var startAngle = i * ROULETTE_SECTOR_ANGLE - 90;
    var endAngle = (i + 1) * ROULETTE_SECTOR_ANGLE - 90;
    var startRad = startAngle * Math.PI / 180;
    var endRad = endAngle * Math.PI / 180;
    var x1 = cx + r * Math.cos(startRad);
    var y1 = cy + r * Math.sin(startRad);
    var x2 = cx + r * Math.cos(endRad);
    var y2 = cy + r * Math.sin(endRad);
    var largeArc = ROULETTE_SECTOR_ANGLE > 180 ? 1 : 0;
    var d = "M" + cx + "," + cy + " L" + x1 + "," + y1 + " A" + r + "," + r + " 0 " + largeArc + " 1 " + x2 + "," + y2 + " Z";
    var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", d);
    path.setAttribute("fill", getTierColor(prize.tier));
    path.setAttribute("class", "roulette-wheel-sector-bg");
    inner.appendChild(path);

    var midAngle = (startAngle + endAngle) / 2;
    var midRad = midAngle * Math.PI / 180;
    var imgCx = cx + (r * 0.62) * Math.cos(midRad);
    var imgCy = cy + (r * 0.62) * Math.sin(midRad);
    var clipId = "roul-clip-" + i;
    var clipPath = document.createElementNS("http://www.w3.org/2000/svg", "clipPath");
    clipPath.setAttribute("id", clipId);
    var clipCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    clipCircle.setAttribute("cx", imgCx);
    clipCircle.setAttribute("cy", imgCy);
    clipCircle.setAttribute("r", 18);
    clipPath.appendChild(clipCircle);
    var defs = inner.querySelector("defs") || (function() {
      var d = document.createElementNS("http://www.w3.org/2000/svg", "defs");
      inner.insertBefore(d, inner.firstChild);
      return d;
    })();
    defs.appendChild(clipPath);

    var bgCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    bgCircle.setAttribute("cx", imgCx);
    bgCircle.setAttribute("cy", imgCy);
    bgCircle.setAttribute("r", 18);
    bgCircle.setAttribute("fill", "#fff");
    inner.appendChild(bgCircle);

    if (prize.img) {
      var image = document.createElementNS("http://www.w3.org/2000/svg", "image");
      image.setAttributeNS("http://www.w3.org/1999/xlink", "href", prize.img);
      image.setAttribute("href", prize.img);
      image.setAttribute("x", imgCx - 16);
      image.setAttribute("y", imgCy - 16);
      image.setAttribute("width", 32);
      image.setAttribute("height", 32);
      image.setAttribute("clip-path", "url(#" + clipId + ")");
      image.setAttribute("preserveAspectRatio", "xMidYMid slice");
      inner.appendChild(image);
    } else {
      var bgC = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      bgC.setAttribute("cx", imgCx);
      bgC.setAttribute("cy", imgCy);
      bgC.setAttribute("r", 18);
      bgC.setAttribute("fill", prize.tier === "jackpot" ? "#ff5722" : "#9c27b0");
      inner.appendChild(bgC);

      var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("x", imgCx);
      text.setAttribute("y", imgCy + (prize.tier === "jackpot" ? -1 : 4));
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("fill", "#fff");
      text.setAttribute("font-family", "Bungee, cursive");
      text.setAttribute("font-size", prize.tier === "jackpot" ? "11" : "12");
      text.setAttribute("font-weight", "bold");
      if (prize.tier === "jackpot") {
        text.textContent = "\u2726";
        text.setAttribute("fill", "#ffd700");
        text.setAttribute("font-size", "18");
        text.setAttribute("y", imgCy + 6);
      } else {
        text.textContent = "\uD83E\uDE99";
        text.setAttribute("font-size", "14");
      }
      inner.appendChild(text);
    }
  }
}

function updateRouletteInfo() {
  var costEl = document.getElementById("rouletteCost");
  var reqEl = document.getElementById("rouletteReq");
  costEl.textContent = ROULETTE_SPIN_COST;
  reqEl.textContent = formatNumber(getRouletteClicksThreshold());
  costEl.parentElement.className = "roulette-cost" + (coins < ROULETTE_SPIN_COST ? " no" : "");
  reqEl.parentElement.className = "roulette-req" + (totalClicks < getRouletteClicksThreshold() ? " no" : "");
  document.getElementById("rouletteSpinBtn").disabled =
    rouletteSpinning || coins < ROULETTE_SPIN_COST || totalClicks < getRouletteClicksThreshold();
}

function spinRoulette() {
  if (rouletteSpinning) return;
  if (coins < ROULETTE_SPIN_COST) { showToast("Monedas insuficientes", "error"); return; }
  if (totalClicks < getRouletteClicksThreshold()) {
    showToast("Necesitas " + formatNumber(getRouletteClicksThreshold()) + " clicks", "error");
    return;
  }

  rouletteSpinning = true;
  coins -= ROULETTE_SPIN_COST;
  localStorage.setItem("chaosCoins", String(coins));
  coinNumberEl.textContent = formatNumber(coins);
  if (typeof updateShopBalance === "function") updateShopBalance();

  var prize = rollPrize();
  var prizeIndex = ROULETTE_PRIZES.indexOf(prize);
  var prizeCenterAngle = prizeIndex * ROULETTE_SECTOR_ANGLE + ROULETTE_SECTOR_ANGLE / 2;
  var spins = 5 + Math.floor(Math.random() * 3);
  rouletteCurrentRotation = rouletteCurrentRotation + spins * 360 - prizeCenterAngle;
  var wheelEl = document.getElementById("rouletteWheel");
  wheelEl.style.transition = "transform " + ROULETTE_SPIN_DURATION_MS + "ms cubic-bezier(0.05, 0.85, 0.15, 1.0)";
  wheelEl.style.transform = "rotate(" + rouletteCurrentRotation + "deg)";

  try {
    var rouletteSound = new Audio("assets/sounds/roulette.mp3");
    rouletteSound.volume = 0.6;
    rouletteSound.play().catch(function() {});
  } catch (e) {}

  document.getElementById("rouletteResult").textContent = "";
  document.getElementById("rouletteResult").className = "roulette-result";
  document.getElementById("rouletteSpinBtn").disabled = true;
  updateRouletteInfo();

  setTimeout(function() { deliverRoulettePrize(prize); }, ROULETTE_SPIN_DURATION_MS + 200);
}

function deliverRoulettePrize(prize) {
  rouletteSpinsCount += 1;
  var resultEl = document.getElementById("rouletteResult");
  var isNew = false;
  var isDup = false;
  var divineUnlocked = false;

  if (prize.isCollectible) {
    if (isCollectibleOwned(prize.id)) {
      isDup = true;
      addCoins(25, "roulette-dup", false);
      resultEl.textContent = prize.name + " · +25 🪙";
      resultEl.className = "roulette-result dup";
    } else {
      isNew = true;
      inventory.collectibles.push(prize.id);
      addCoins(50, "roulette-new", true);
      resultEl.textContent = "🎉 " + prize.name;
      resultEl.className = "roulette-result win";
      showToast("🎉 ¡NUEVO! " + prize.name, "success");
    }
  } else if (prize.id === "jackpot") {
    addCoins(prize.coins, "roulette", true);
    resultEl.textContent = "💎 ¡" + prize.coins + " MONEDAS!";
    resultEl.className = "roulette-result jackpot";
    if (!jesusRewardUnlocked) {
      unlockDivineReward(prize);
      divineUnlocked = true;
    }
  } else if (prize.coins) {
    addCoins(prize.coins, "roulette", false);
    resultEl.textContent = "+" + prize.coins + " 🪙";
    resultEl.className = "roulette-result";
  }

  if (prize.tier === "mythic" && isDup && !jesusRewardUnlocked) {
    unlockDivineReward(prize);
    divineUnlocked = true;
  }

  saveInventory();
  saveRouletteState();
  rouletteTotalSpins++;
  localStorage.setItem("chaosRouletteTotalSpins", String(rouletteTotalSpins));
  rouletteSpinning = false;
  updateRouletteInfo();
  if (typeof buildShop === "function") buildShop();
  if (typeof buildCollection === "function") buildCollection();
  checkAchievements();

  if (divineUnlocked) {
    setTimeout(function() {
      showDivineCelebration();
    }, 800);
  }
}

function unlockDivineReward(prize) {
  jesusRewardUnlocked = true;
  if (inventory.pictures.indexOf("assets/images/Jesus_Payne.jpg") === -1) {
    inventory.pictures.push("assets/images/Jesus_Payne.jpg");
  }
  if (inventory.slogans.indexOf("jesus-blesses") === -1) {
    inventory.slogans.push("jesus-blesses");
  }
  if (inventory.frames.indexOf("jesus-blessing") === -1) {
    inventory.frames.push("jesus-blessing");
  }
  saveRouletteState();
  saveInventory();
}

function showDivineCelebration() {
  var resultEl = document.getElementById("rouletteResult");
  resultEl.textContent = "✝ JESÚS ME BENDICE ✝";
  resultEl.className = "roulette-result divine";
  showToast("✝ ¡BENDICIÓN DESBLOQUEADA! Marco + frase", "success");
  if (typeof updateProfile === "function") updateProfile();
  setTimeout(function() { showToast("Equipá el marco en la tienda (MARCOS)", "info"); }, 2800);
}

function openRoulette() {
  buildRouletteWheel();
  updateRouletteInfo();
  document.getElementById("rouletteModal").classList.add("show");
  rouletteCurrentRotation = 0;
  document.getElementById("rouletteWheel").style.transition = "none";
  document.getElementById("rouletteWheel").style.transform = "rotate(0deg)";
  setTimeout(function() {
    document.getElementById("rouletteWheel").style.transition = "";
  }, 50);
}
function closeRoulette() {
  document.getElementById("rouletteModal").classList.remove("show");
  document.getElementById("rouletteResult").textContent = "";
  document.getElementById("rouletteResult").className = "roulette-result";
}

document.getElementById("toggleRoulette").addEventListener("click", openRoulette);
document.getElementById("rouletteClose").addEventListener("click", closeRoulette);
document.getElementById("rouletteSpinBtn").addEventListener("click", spinRoulette);
document.getElementById("rouletteModal").addEventListener("click", function(e) {
  if (e.target.id === "rouletteModal") closeRoulette();
});

/* ========================= */
/* COLLECTIBLE FULLSCREEN */
/* ========================= */

function openCollectibleFullscreen(prize) {
  var imgEl = document.getElementById("collectibleFullscreenImg");
  var nameEl = document.getElementById("collectibleFullscreenName");
  var tierEl = document.getElementById("collectibleFullscreenTier");
  var descEl = document.getElementById("collectibleFullscreenDesc");

  imgEl.src = prize.img;
  imgEl.onerror = function() { this.src = PLACEHOLDER_PHOTO_SVG; };
  nameEl.textContent = prize.name;

  var tierLabel = prize.tier === "common" ? "COMÚN" : prize.tier === "rare" ? "RARO" : "MÍTICO";
  tierEl.textContent = "— " + tierLabel + " —";
  tierEl.className = "collectible-fullscreen-tier " + prize.tier;

  descEl.textContent = prize.desc || "";
  descEl.style.display = prize.desc ? "block" : "none";

  document.getElementById("collectibleFullscreen").classList.add("show");
}
function closeCollectibleFullscreen() {
  document.getElementById("collectibleFullscreen").classList.remove("show");
}

document.getElementById("collectibleFullscreenClose").addEventListener("click", closeCollectibleFullscreen);
document.getElementById("collectibleFullscreen").addEventListener("click", function(e) {
  if (e.target.id === "collectibleFullscreen") closeCollectibleFullscreen();
});

/* ========================= */
/* PROFILE FRAME UPDATE (init) */
/* ========================= */

(function() {
  var wrap = document.getElementById("profilePhotoWrap");
  if (wrap) {
    wrap.classList.remove("framed-jesus-blessing");
    if (equipped.frame === "jesus-blessing") {
      wrap.classList.add("framed-jesus-blessing");
    }
  }
})();

buildCollection();
checkAchievements();

/* ========================= */
/* DEBUG HELPERS (console) */
/* ========================= */

window.__chaosDebug = {
  giveClicks: function(n) {
    if (typeof n !== "number") n = 99999;
    localStorage.setItem("totalClicks", String(n));
    localStorage.setItem("clicks", String(n));
    totalClicks = n;
    if (typeof updateClickCounter === "function") updateClickCounter();
    if (typeof checkAchievements === "function") checkAchievements();
    console.log("✓ totalClicks = " + n);
  },
  giveCoins: function(n) {
    if (typeof n !== "number") n = 99999;
    localStorage.setItem("chaosCoins", String(n));
    coins = n;
    if (typeof coinNumberEl !== "undefined" && coinNumberEl) {
      coinNumberEl.textContent = formatNumber(n);
    }
    if (typeof checkAchievements === "function") checkAchievements();
    console.log("✓ coins = " + n);
  },
  giveBoosts: function(n) {
    if (typeof n !== "number") n = 100;
    localStorage.setItem("chaosBoostActivationsCount", String(n));
    boostActivationsCount = n;
    localStorage.setItem("chaosBoostMilestone5", "1");
    boostMilestone5Shown = true;
    if (typeof boostCountEl !== "undefined" && boostCountEl) {
      boostCountEl.textContent = formatNumber(n);
    }
    if (typeof checkAchievements === "function") checkAchievements();
    console.log("✓ boostActivationsCount = " + n);
  },
  giveRouletteSpins: function(n) {
    if (typeof n !== "number") n = 100;
    localStorage.setItem("chaosRouletteTotalSpins", String(n));
    localStorage.setItem("chaosRouletteSpins", String(n));
    rouletteTotalSpins = n;
    rouletteSpinsCount = n;
    if (typeof checkAchievements === "function") checkAchievements();
    console.log("✓ rouletteTotalSpins = " + n);
  },
  giveCollectibles: function() {
    var collectibles = ["doge", "agua", "rengoku", "venpaca", "atun"];
    inventory.collectibles = collectibles.slice();
    localStorage.setItem("chaosInventory", JSON.stringify(inventory));
    if (typeof checkAchievements === "function") checkAchievements();
    console.log("✓ All 5 collectibles granted");
  },
  giveVideos: function() {
    unlockedVideos = [
      { name: "Avioncito", file: "assets/videos/Avioncito.mp4" },
      { name: "Tesla Bailando", file: "assets/videos/Tesla_bailando.mp4" },
      { name: "Gojo en Bici", file: "assets/videos/Gojo_bici.mp4" }
    ];
    localStorage.setItem("chaosVideos", JSON.stringify(unlockedVideos));
    if (typeof checkAchievements === "function") checkAchievements();
    console.log("✓ All 3 videos unlocked");
  },
  giveFacts: function() {
    var FACTS_LOCAL = (typeof FACTS !== "undefined") ? FACTS : [];
    if (FACTS_LOCAL.length === 0) {
      console.log("✗ No FACTS array available");
      return;
    }
    unlockedFacts = FACTS_LOCAL.slice();
    localStorage.setItem("chaosFacts", JSON.stringify(unlockedFacts));
    if (typeof checkAchievements === "function") checkAchievements();
    console.log("✓ All " + FACTS_LOCAL.length + " facts unlocked");
  },
  giveAll: function() {
    this.giveClicks(99999);
    this.giveCoins(99999);
    this.giveBoosts(100);
    this.giveRouletteSpins(100);
    this.giveCollectibles();
    this.giveVideos();
    this.giveFacts();
    // Buy all fonts (so Tipografo achievement unlocks)
    if (typeof SHOP_FONTS !== "undefined" && typeof inventory !== "undefined") {
      for (var f = 0; f < SHOP_FONTS.length; f++) {
        if (inventory.fonts.indexOf(SHOP_FONTS[f].key) === -1) {
          inventory.fonts.push(SHOP_FONTS[f].key);
        }
      }
      if (typeof saveInventory === "function") saveInventory();
    }
    // Buy all regular slogans
    if (typeof SHOP_SLOGANS !== "undefined" && typeof inventory !== "undefined") {
      for (var s = 0; s < SHOP_SLOGANS.length; s++) {
        if (inventory.slogans.indexOf(SHOP_SLOGANS[s].key) === -1) {
          inventory.slogans.push(SHOP_SLOGANS[s].key);
        }
      }
      if (typeof saveInventory === "function") saveInventory();
    }
    // Buy all secret slogans (mouse-breaker, jesus-blesses)
    if (typeof SHOP_SECRET_SLOGANS !== "undefined" && typeof inventory !== "undefined") {
      for (var ss = 0; ss < SHOP_SECRET_SLOGANS.length; ss++) {
        if (inventory.slogans.indexOf(SHOP_SECRET_SLOGANS[ss].key) === -1) {
          inventory.slogans.push(SHOP_SECRET_SLOGANS[ss].key);
        }
      }
      if (typeof saveInventory === "function") saveInventory();
    }
    // Buy all secret pictures (Ratón_gamer.jpg)
    if (typeof SHOP_SECRET_PICTURES !== "undefined" && typeof inventory !== "undefined") {
      for (var sp = 0; sp < SHOP_SECRET_PICTURES.length; sp++) {
        if (inventory.pictures.indexOf(SHOP_SECRET_PICTURES[sp].file) === -1) {
          inventory.pictures.push(SHOP_SECRET_PICTURES[sp].file);
        }
      }
      if (typeof saveInventory === "function") saveInventory();
    }
    // Buy all regular pictures (so Multitud achievement unlocks)
    if (typeof SHOP_PICTURES !== "undefined" && typeof inventory !== "undefined") {
      for (var pp = 0; pp < SHOP_PICTURES.length; pp++) {
        if (inventory.pictures.indexOf(SHOP_PICTURES[pp].file) === -1) {
          inventory.pictures.push(SHOP_PICTURES[pp].file);
        }
      }
      if (typeof saveInventory === "function") saveInventory();
    }
    // Equip first slogan (so Frase Marcada achievement unlocks)
    if (typeof SHOP_SLOGANS !== "undefined" && SHOP_SLOGANS.length > 0 && typeof equipped !== "undefined" && typeof saveEquipped === "function") {
      if (!equipped.slogan && inventory.slogans.length > 0) {
        equipped.slogan = inventory.slogans[0];
        saveEquipped();
      }
    }
    // Simulate 3 cycles of reaching 100% chaos (for Loco Completo achievement)
    if (typeof chaosReachedHundredCount !== "undefined") {
      // Use the giveHundred helper to increment properly
      chaosReachedHundredCount = 0;
      localStorage.setItem("chaosReachedHundredCount", "0");
      for (var cyc = 0; cyc < 3; cyc++) {
        chaosReachedHundredCount++;
        localStorage.setItem("chaosReachedHundredCount", String(chaosReachedHundredCount));
      }
    }
    if (typeof jesusRewardUnlocked !== "undefined") {
      jesusRewardUnlocked = true;
      localStorage.setItem("chaosJesusReward", "1");
      // Also add the divine-reward items (jesus-blesses slogan, jesus-blessing frame)
      if (typeof inventory !== "undefined") {
        if (inventory.slogans.indexOf("jesus-blesses") === -1) {
          inventory.slogans.push("jesus-blesses");
        }
        if (inventory.frames.indexOf("jesus-blessing") === -1) {
          inventory.frames.push("jesus-blessing");
        }
        if (typeof saveInventory === "function") saveInventory();
      }
    }
    // Apply rewards for all achievements with rewards
    if (typeof ACHIEVEMENTS !== "undefined" && typeof applyAchievementReward === "function") {
      var rewardAchs = ["mouse_breaker", "intelectual", "coleccionista", "bendecido", "completista"];
      for (var i = 0; i < rewardAchs.length; i++) {
        applyAchievementReward(rewardAchs[i]);
      }
    }
    if (typeof checkAchievements === "function") checkAchievements();
    console.log("✓ Everything granted! Reload to see all effects.");
  },
  reset: function() {
    localStorage.clear();
    location.reload();
  },
  help: function() {
    console.log(
      "CHAOS BUTTON DEBUG COMMANDS:\n" +
      "  __chaosDebug.giveClicks(99999)      - Set total clicks\n" +
      "  __chaosDebug.giveCoins(99999)       - Set coins\n" +
      "  __chaosDebug.giveBoosts(100)        - Set boost activations\n" +
      "  __chaosDebug.giveRouletteSpins(100) - Set roulette total spins\n" +
      "  __chaosDebug.giveCollectibles()     - Get all 5 collectibles\n" +
      "  __chaosDebug.giveVideos()           - Unlock all 3 videos\n" +
      "  __chaosDebug.giveFacts()            - Unlock all facts\n" +
      "  __chaosDebug.giveAll()              - EVERYTHING (max stats + all items)\n" +
      "  __chaosDebug.reset()                - Clear all localStorage and reload\n" +
      "  __chaosDebug.help()                 - Show this help"
    );
  }
};

console.log("💡 Debug commands available: type __chaosDebug.help()");

})();

