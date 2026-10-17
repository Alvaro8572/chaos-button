
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

function safeJSON(key, fallback) {
  try {
    var raw = localStorage.getItem(key);
    if (raw === null || raw === undefined || raw === "") return fallback;
    return JSON.parse(raw);
  } catch (e) {
    console.warn("[chaos] corrupted localStorage key '" + key + "', resetting to fallback");
    try { localStorage.removeItem(key); } catch (e2) {}
    return fallback;
  }
}

function safeNumber(key, fallback, isInt) {
  var raw = localStorage.getItem(key);
  if (raw === null || raw === undefined || raw === "") return fallback;
  var n = isInt ? parseInt(raw, 10) : parseFloat(raw);
  if (!isFinite(n) || isNaN(n)) {
    console.warn("[chaos] corrupted number key '" + key + "', resetting to fallback");
    try { localStorage.removeItem(key); } catch (e) {}
    return fallback;
  }
  return n;
}

var soundEnabled = safeJSON("chaosSoundEnabled", true);

var inventory = safeJSON("chaosInventory", {"pictures":[],"fonts":[],"accessories":[],"slogans":[],"frames":[],"collectibles":[]});
if (!inventory.pictures) inventory.pictures = [];
if (!inventory.fonts) inventory.fonts = [];
if (!inventory.accessories) inventory.accessories = [];
if (!inventory.slogans) inventory.slogans = [];
if (!inventory.frames) inventory.frames = [];
if (!inventory.collectibles) inventory.collectibles = [];

var equipped = safeJSON("chaosEquipped", {"picture":null,"font":null,"accessory":null,"slogan":null,"frame":null});
if (!equipped.picture) equipped.picture = null;
if (!equipped.slogan) equipped.slogan = null;
if (!equipped.frame) equipped.frame = null;

var shopOpen = false;

var chaosTimers = { setTimeoutIds: [], intervalIds: [] };
function chaosSetTimeout(fn, ms) {
  var id = setTimeout(function() {
    var idx = chaosTimers.setTimeoutIds.indexOf(id);
    if (idx !== -1) chaosTimers.setTimeoutIds.splice(idx, 1);
    fn();
  }, ms);
  chaosTimers.setTimeoutIds.push(id);
  return id;
}
function chaosSetInterval(fn, ms) {
  var id = setInterval(fn, ms);
  chaosTimers.intervalIds.push(id);
  return id;
}
function clearAllChaosTimers() {
  chaosTimers.setTimeoutIds.forEach(function(id) { clearTimeout(id); });
  chaosTimers.intervalIds.forEach(function(id) { clearInterval(id); });
  chaosTimers.setTimeoutIds = [];
  chaosTimers.intervalIds = [];
}

var jesusRewardUnlocked = localStorage.getItem("chaosJesusReward") === "1";
var repetidoMsg = document.getElementById("repetidoMsg");

var clickSound = new Audio("assets/sounds/mouse-click-sound.mp3");
clickSound.volume = 0.7;
clickSound.preload = "auto";
var lastSoundIndex = -1;
var lastSoundTime = 0;
var SOUND_COOLDOWN = 10000;

// Pre-instantiated Audio objects reused per sound file (no per-click allocation)
var soundInstances = SOUNDS.map(function(src) {
  var a = new Audio(src);
  a.volume = 0.5;
  a.preload = "auto";
  return a;
});

function playRandomSound() {
  if (!soundEnabled) return;
  var now = Date.now();
  if (now - lastSoundTime < SOUND_COOLDOWN) return;

  var available = [];
  for (var i = 0; i < soundInstances.length; i++) {
    if (i !== lastSoundIndex) available.push(i);
  }
  if (available.length === 0) return;

  var idx = available[Math.floor(Math.random() * available.length)];
  lastSoundIndex = idx;
  lastSoundTime = now;

  var sound = soundInstances[idx];
  try {
    sound.currentTime = 0;
    sound.play().catch(function() {});
  } catch (e) {}
}

function playClickSound() {
  if (!soundEnabled) return;
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
  "Los tiburones existian antes que los árboles.",
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

// `clicks` resets every chaos cycle; `totalClicks` is the persistent historical count.
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

var totalClicks = safeNumber("totalClicks", 0, true);
var clickCounterEl = document.getElementById("clickCounter");
var clickCounterNumber = document.getElementById("clickCounterNumber");
var clickCounterTickTimeout = null;
var lastMilestoneShown = safeNumber("lastMilestoneShown", 0, true);
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

var coins = safeNumber("chaosCoins", 0, true);
var totalCoinsEarned = safeNumber("chaosTotalCoinsEarned", 0, true);
var coinDisplayEl = document.getElementById("coinDisplay");
var coinNumberEl = document.getElementById("coinNumber");
var coinTickTimeout = null;
var coinSound = null;

coinNumberEl.textContent = formatNumber(coins);

try {
  coinSound = new Audio("assets/sounds/purchase.mp3");
  coinSound.volume = 0.3;
  coinSound.preload = "auto";
  coinSound.addEventListener("error", function() { coinSound = null; });
} catch (e) { coinSound = null; }

function addCoins(amount, source, isBig) {
  coins += amount;
  localStorage.setItem("chaosCoins", String(coins));
  totalCoinsEarned += amount;
  localStorage.setItem("chaosTotalCoinsEarned", String(totalCoinsEarned));
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

  // Memory fragment triggers (clicks-based)
  if (typeof checkMemoryTrigger === "function") checkMemoryTrigger("click");

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
  "virus-overlay": 1,
  "hackerman-overlay": 1,
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

function trackedRemove(el, className) {
  if (el.parentNode) el.parentNode.removeChild(el);
  releaseElement(className);
}

// Load saved facts from localStorage
var unlockedFacts = safeJSON("chaosFacts", []);
// Dedup legacy data (one-time migration)
(function() {
  var seen = {};
  var deduped = [];
  for (var i = 0; i < unlockedFacts.length; i++) {
    if (!seen[unlockedFacts[i]]) { seen[unlockedFacts[i]] = true; deduped.push(unlockedFacts[i]); }
  }
  if (deduped.length !== unlockedFacts.length) {
    unlockedFacts = deduped;
    localStorage.setItem("chaosFacts", JSON.stringify(unlockedFacts));
  }
})();
var unlockedListEl = document.getElementById("unlockedList");
if (unlockedListEl) unlockedListEl.innerHTML = "";
if (unlockedFacts.length > 0) {
  unlockedFacts.forEach(function(fact, i) {
    var item = document.createElement("div");
    item.className = "unlocked-item show";
    item.textContent = (i + 1) + ". " + fact;
    document.getElementById("unlockedList").appendChild(item);
  });
  document.getElementById("unlockedCount").textContent = unlockedFacts.length + " / " + FACTS.length;
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
  this.hue = pickThemedHue();
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
  // Pick a base hue from the active theme if equipped, otherwise random.
  // BurstParticle spreads each particle +/- 20 around this base, so the whole
  // burst stays within the theme's hue family.
  var hue = pickThemedHue();
  for (var i = 0; i < count; i++) {
    if (burstParticles.length < 200) {
      burstParticles.push(new BurstParticle(x, y, hue));
    }
  }
}

// Helper: returns a numeric HUE (0-360) derived from the active theme's
// palette when one is equipped, or a random hue for the default 'chaos'
// theme. Used by all chaos visuals so colored effects stay on-palette.
function pickThemedHue() {
  if (typeof equippedTheme === "undefined") return Math.random() * 360;
  var t = SHOP_THEMES.filter(function(th) { return th.key === equippedTheme; })[0];
  if (!t || !t.swatch || t.key === "chaos") return Math.random() * 360;
  // 80% primary swatch (the dominant theme color), 20% secondary.
  // This keeps glows/particles on the theme's signature hue and avoids
  // the visual feeling "too cyan/blue" when the secondary is a cool color.
  var pick = Math.random() < 0.8 ? t.swatch[0] : t.swatch[1];
  return hexToHue(pick);
}

function hexToHue(hex) {
  // "#rrggbb" or "rrggbb" -> numeric HSL hue 0-360
  var h = (hex || "").replace("#", "");
  if (h.length !== 6) return Math.random() * 360;
  var r = parseInt(h.substring(0, 2), 16) / 255;
  var g = parseInt(h.substring(2, 4), 16) / 255;
  var b = parseInt(h.substring(4, 6), 16) / 255;
  var max = Math.max(r, g, b);
  var min = Math.min(r, g, b);
  var d = max - min;
  if (d === 0) return 0;
  var hue;
  if (max === r) hue = ((g - b) / d) % 6;
  else if (max === g) hue = (b - r) / d + 2;
  else hue = (r - g) / d + 4;
  hue = hue * 60;
  if (hue < 0) hue += 360;
  return hue;
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
  // Pull hue from active theme so symbols stay on-palette
  sym.style.color = "hsl(" + pickThemedHue() + ", 100%, 60%)";
  sym.style.fontSize = (18 + Math.random() * 24 + Math.min(chaosLevel, 40)) + "px";
  document.body.appendChild(sym);
  setTimeout(function() { trackedRemove(sym, "chaos-symbol"); }, 1200);
}

/* ========================= */
/* FACT SYSTEM */
/* ========================= */

var unlockedList = document.getElementById("unlockedList");
var unlockedCount = document.getElementById("unlockedCount");
var unlockedPanel = document.getElementById("unlockedPanel");

function showRepetido() {
  repetidoMsg.classList.add("show");
  setTimeout(function() { repetidoMsg.classList.remove("show"); }, 3000);
}

function addToSidebar(fact) {
  if (unlockedFacts.indexOf(fact) !== -1) return;
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
  var displayLevel = Math.floor(chaosLevel);
  if (chaosBar) {
    var pct = Math.max(0, Math.min(100, chaosLevel));
    chaosBar.style.width = pct.toFixed(2) + "%";
  }
  if (chaosLevelSpan) {
    chaosLevelSpan.textContent = displayLevel + "%";
  }
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
            // Use themed hue for shockwave borders instead of hardcoded yellows.
            wave.style.borderColor = "hsla(" + pickThemedHue() + ", 90%, 60%, " + (idx === 2 ? 0.5 : 0.9 - idx * 0.2) + ")";
            document.body.appendChild(wave);
            setTimeout(function() { trackedRemove(wave, "shockwave"); }, 900);
          }, idx * 100);
        })(i);
      }

      var cx = window.innerWidth / 2;
      var cy = window.innerHeight / 2;
      for (var j = 0; j < 50; j++) {
        burstParticles.push(new BurstParticle(cx, cy, pickThemedHue()));
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
        sym.style.color = "hsl(" + pickThemedHue() + ", 100%, 65%)";
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
      // Portal rings use themed hues so the event stays on-palette
      var baseHue = pickThemedHue();
      var colors = [
        "hsl(" + baseHue + ", 100%, 60%)",
        "hsl(" + ((baseHue + 30) % 360) + ", 100%, 60%)",
        "hsl(" + ((baseHue + 60) % 360) + ", 100%, 60%)"
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
      // Avoid duplicating the injected style on repeated triggers
      var existing = document.getElementById("glitch-event-style");
      if (existing) existing.parentNode.removeChild(existing);
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
      var strobe = chaosSetInterval(function() {
        document.body.style.background = colors[count % colors.length];
        count++;
        if (count > 12) {
          clearInterval(strobe);
          var idx = chaosTimers.intervalIds.indexOf(strobe);
          if (idx !== -1) chaosTimers.intervalIds.splice(idx, 1);
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
            col.style.color = "hsl(" + pickThemedHue() + ", 100%, " + (50 + Math.random() * 30) + "%)";
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

      // Supernova waves fade through themed hues with varying alpha
      var baseHue = pickThemedHue();
      var colors = [
        "hsla(" + baseHue + ", 100%, 95%, 0.95)",
        "hsla(" + ((baseHue + 15) % 360) + ", 100%, 70%, 0.9)",
        "hsla(" + ((baseHue + 30) % 360) + ", 100%, 55%, 0.8)",
        "hsla(" + ((baseHue + 45) % 360) + ", 100%, 50%, 0.6)"
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
        burstParticles.push(new BurstParticle(cx, cy, pickThemedHue()));
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
      // Confetti pieces use themed hues so they stay on-palette.
      // Generate 10 distinct hues around the theme's primary hue.
      var baseConfettiHue = pickThemedHue();
      var palette = [];
      for (var p = 0; p < 10; p++) {
        var ph = (baseConfettiHue + p * 30) % 360;
        palette.push("hsl(" + ph + ", 100%, 60%)");
      }
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
      var reserved = 0;
      if (canCreate("aurora-layer")) reserved++;
      if (canCreate("aurora-layer")) reserved++;
      if (reserved < 2) {
        for (var r = 0; r < reserved; r++) releaseElement("aurora-layer");
        return;
      }
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
  var total = 0;
  for (var i = 0; i < EVENTS.length; i++) total += EVENTS[i].chance;
  if (total <= 0) return;
  var roll = Math.random() * total;
  var cumulative = 0;
  for (var j = 0; j < EVENTS.length; j++) {
    cumulative += EVENTS[j].chance;
    if (roll < cumulative) {
      EVENTS[j].execute();
      return;
    }
  }
}

function fxCleanup(el, ms) {
  setTimeout(function() { if (el.parentNode) el.parentNode.removeChild(el); }, ms);
}

var PRO_THEME_EFFECTS = {
  void: function() {
    var portal = document.createElement("div");
    portal.className = "fx-void-portal";
    document.body.appendChild(portal);
    fxCleanup(portal, 1200);
    for (var i = 0; i < 14; i++) {
      var spark = document.createElement("div");
      spark.className = "fx-void-spark";
      var angle = Math.random() * 6.283;
      var dist = 70 + Math.random() * 130;
      spark.style.left = (window.innerWidth / 2) + "px";
      spark.style.top = (window.innerHeight / 2) + "px";
      spark.style.setProperty("--dx", (Math.cos(angle) * dist).toFixed(0) + "px");
      spark.style.setProperty("--dy", (Math.sin(angle) * dist).toFixed(0) + "px");
      document.body.appendChild(spark);
      fxCleanup(spark, 1000);
    }
  },
  gold: function() {
    for (var i = 0; i < 22; i++) {
      (function(idx) {
        setTimeout(function() {
          var coin = document.createElement("div");
          coin.className = "fx-coin";
          coin.textContent = "🪙";
          coin.style.left = (Math.random() * 96) + "%";
          var dur = 1 + Math.random() * 1.2;
          coin.style.animationDuration = dur + "s";
          document.body.appendChild(coin);
          fxCleanup(coin, dur * 1000 + 200);
        }, idx * 30);
      })(i);
    }
  },
  blood: function() {
    for (var i = 0; i < 16; i++) {
      (function(idx) {
        setTimeout(function() {
          var drip = document.createElement("div");
          drip.className = "fx-blood";
          drip.style.left = (Math.random() * 100) + "%";
          drip.style.height = (18 + Math.random() * 46) + "px";
          var dur = 0.9 + Math.random() * 0.8;
          drip.style.animationDuration = dur + "s";
          document.body.appendChild(drip);
          fxCleanup(drip, dur * 1000 + 200);
        }, idx * 35);
      })(i);
    }
  },
  fire: function() {
    for (var i = 0; i < 26; i++) {
      (function(idx) {
        setTimeout(function() {
          var ember = document.createElement("div");
          ember.className = "fx-ember";
          ember.style.left = (Math.random() * 100) + "%";
          ember.style.setProperty("--drift", ((Math.random() - 0.5) * 90).toFixed(0) + "px");
          var dur = 1 + Math.random() * 1;
          ember.style.animationDuration = dur + "s";
          document.body.appendChild(ember);
          fxCleanup(ember, dur * 1000 + 200);
        }, idx * 25);
      })(i);
    }
  }
};

var lastThemeEffectTime = 0;

function triggerThemeEffect() {
  var now = Date.now();
  if (now - lastThemeEffectTime < 1500) return;
  var theme = SHOP_THEMES.filter(function(t) { return t.key === equippedTheme; })[0];
  if (!theme || theme.tier !== 2) return;
  var fn = PRO_THEME_EFFECTS[theme.key];
  if (!fn) return;
  lastThemeEffectTime = now;
  fn();
}

function resetEverything() {
  if (isResetting) return;
  isResetting = true;

  clearAllChaosTimers();

  clicks = 0;
  chaosLevel = 0;
  hasCountedHundredThisCycle = false;
  lastFontIndex = -1;
  burstParticles = [];

  document.body.style.cssText = "";
  document.body.style.fontFamily = "Orbitron, monospace";

  title.style.cssText = "";
  title.style.fontFamily = "Orbitron, monospace";

  chaosBtn.style.cssText = "";
  chaosBtn.style.backgroundSize = "300% 100%";
  chaosBtn.style.border = "2px solid rgba(255,255,255,0.3)";

  // Restore themed background. The CSS variables for the active theme
  // (set via [data-theme="..."] selectors) apply once the inline
  // background is cleared, so the body naturally goes back to the
  // theme's --bg-dark or the themed gradient applied by chaos().
  // We don't need to set anything here — removing the inline style
  // reverts to the CSS rule for [data-theme="X"] body { background }.
  var themedBg = getComputedStyle(document.documentElement).getPropertyValue("--bg-dark").trim();
  if (themedBg) document.body.style.background = themedBg;
  else document.body.style.background = "#0a0a0f";

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

  chaosSetTimeout(function() { isResetting = false; }, 500);
}

function chaos() {
  if (isResetting) return;

  applyBoostClick();

  clicks++;
  chaosLevel = Math.min(100, (clicks / 200) * 100);
  updateChaosMeter();
  updateClickCounter();

  var rect = chaosBtn.getBoundingClientRect();
  var cx = rect.left + rect.width / 2;
  var cy = rect.top + rect.height / 2;

  // Resolve active theme once per click so chaos visuals stay on-palette.
  var activeTheme = SHOP_THEMES.filter(function(t) { return t.key === equippedTheme; })[0];
  var onTheme = activeTheme && activeTheme.key !== "chaos" && activeTheme.swatch;

  // Title color — derive from active theme so colors stay on-palette
  var color1;
  if (onTheme) {
    // Build HSL from the themed hue so the title can shift lightness
    // naturally without breaking out of the palette.
    color1 = "hsl(" + pickThemedHue() + ", 100%, 60%)";
  } else {
    color1 = randomHsl(100, 60);
  }
  title.style.color = color1;

  // Button glow
  chaosBtn.style.borderColor = color1;
  chaosBtn.style.boxShadow = "0 0 25px " + color1;

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
    // hue-rotate destroys theme colors — skip when a theme is equipped
    if (!onTheme) {
      document.body.style.filter = "hue-rotate(" + Math.floor(Math.random() * 360) + "deg)";
    } else {
      document.body.style.filter = "";
    }
  } else {
    document.body.style.letterSpacing = (Math.random() * 15 * (chaosLevel / 50)) + "px";
  }

  // Random event
  if (Math.random() < 0.15) {
    triggerRandomEvent();
  }

  if (Math.random() < 0.08) {
    triggerThemeEffect();
  }

  // Coin event (1.2% per click + timer)
  if (!coinEvent && Math.random() < 0.012) {
    spawnCoinEvent();
  }

  // Collectibles (comun 0.55%, raro 0.1%, legendario 0.01% por click)
  trySpawnCollectible();

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

  // Late-cycle risk: as chaos climbs past 90%, each click has a rising chance
  // of resetting the chaos meter to 0. Caps at 3% per click at 99%.
  // The first 90% is a safe zone (free grinding); only the final 10%
  // is tense, with a gentle ramp to 3%.
  if (chaosLevel >= 90 && chaosLevel < 100) {
    var lateResetChance = ((chaosLevel - 90) / 9) * 0.03;
    if (Math.random() < lateResetChance) {
      chaosLevel = 0;
      clicks = 0;
      hasCountedHundredThisCycle = false;
      updateChaosMeter();
      logEl.innerText = "\u26a0\ufe0f El caos se contuvo a tiempo...";
      logEl.classList.remove("panicked");
      void logEl.offsetWidth;
      logEl.classList.add("panicked");
      return;
    }
  }

  // 100% reset - always happens at 100
  if (chaosLevel >= 100) {
    if (chaosLevel === 100 && !hasCountedHundredThisCycle) {
      chaosReachedHundredCount++;
      localStorage.setItem("chaosReachedHundredCount", String(chaosReachedHundredCount));
      hasCountedHundredThisCycle = true;
      if (chaos100NumberEl) chaos100NumberEl.textContent = chaosReachedHundredCount;
      logEl.innerText = "🔥 100% caos alcanzado por " + (chaosReachedHundredCount === 1 ? "primera" : chaosReachedHundredCount + "ª") + " vez";
      if (typeof checkAcumulador === "function") checkAcumulador();
    }
    // 40% chance to trigger boss fight, 60% chance to just reset (harder to enter boss)
    if (Math.random() < 0.4) {
      localStorage.setItem("chaosPendingReset", "1");
      var kills = parseInt(localStorage.getItem("chaosBossKills") || "0", 10) || 0;
      var nextLevel = kills + 1;
      if (nextLevel > 10) nextLevel = 10;
      // Reset clicks/chaosLevel NOW to prevent the in-flight chaos() calls from
      // counting clicks during the 400ms window before the redirect fires.
      hasCountedHundredThisCycle = false;
      chaosLevel = 0;
      clicks = 0;
      updateChaosMeter();
      setTimeout(function() {
        if (typeof window.startBossArena === "function") {
          window.startBossArena(nextLevel);
        }
      }, 400);
    } else {
      // 60% — keep playing, reset chaosLevel but don't teleport
      hasCountedHundredThisCycle = false;
      chaosLevel = 0;
      clicks = 0;
      updateChaosMeter();
      logEl.innerText = "El caos se contuvo... esta vez.";
    }
    checkAchievements();
    return;
  }

  // No random reset: only the boss fight teleports user at 100%.

  checkAchievements();
}

// Button click
chaosBtn.addEventListener("click", function() {
  playClickSound();
  chaos();
});

// Keyboard shortcut: Enter/Space triggers chaos ONLY when no editable element or input has focus
document.addEventListener("keydown", function(e) {
  if (e.key === "Enter" || e.key === " ") {
    var t = e.target;
    var tag = t && t.tagName ? t.tagName.toLowerCase() : "";
    var isEditable = t && (t.isContentEditable || tag === "input" || tag === "textarea" || tag === "select");
    var isOtherButton = (tag === "button" && t !== chaosBtn) || (t && typeof t.getAttribute === "function" && t.getAttribute("role") === "button");
    if (isEditable || isOtherButton) return;
    e.preventDefault();
    playClickSound();
    chaos();
  } else if (e.key === "Escape") {
    // Escape closes the topmost open overlay/panel
    closeTopmostOverlay();
  }
});

// Close the most recently opened overlay/panel
function closeTopmostOverlay() {
  if (typeof isMenuOpen === "function" && isMenuOpen()) {
    closeMenu();
  } else if (document.getElementById("memoryFinal").classList.contains("show")) {
    closeMemoryFinal();
  } else if (document.getElementById("memoryFragment").classList.contains("show")) {
    closeMemoryFragment();
  } else if (typeof isMemoryOpen === "function" && isMemoryOpen()) {
    closeMemory();
  } else if (document.getElementById("collectibleFullscreen").classList.contains("show")) {
    document.getElementById("collectibleFullscreen").classList.remove("show");
  } else if (document.getElementById("rouletteModal").classList.contains("show")) {
    closeRoulette();
  } else if (document.getElementById("shopPanel").classList.contains("open")) {
    document.getElementById("shopPanel").classList.remove("open");
    shopOpen = false;
  } else if (document.getElementById("unlockedPanel").classList.contains("open")) {
    document.getElementById("unlockedPanel").classList.remove("open");
    sidebarOpen = false;
  } else if (document.getElementById("achievementsPanel").classList.contains("open")) {
    document.getElementById("achievementsPanel").classList.remove("open");
    achievementsOpen = false;
  } else if (document.getElementById("infoPanel").classList.contains("open")) {
    closeInfo();
  } else if (document.getElementById("statsPanel").classList.contains("open")) {
    closeStats();
  } else if (document.getElementById("collectiblesPanel").classList.contains("open")) {
    closeCollectibles();
  } else if (document.getElementById("factPanel").classList.contains("visible")) {
    document.getElementById("factPanel").classList.remove("visible");
  }
}

// Ambient symbols
chaosSetInterval(function() {
  if (Math.random() < 0.4 && chaosLevel > 0) spawnChaosSymbol();
}, 3000);

// Clear transform/filter/letterSpacing periodically
chaosSetInterval(function() {
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
  { file: "assets/images/Knight.jpg",   name: "Knight",    price: 60,  req: 2750 },
  { file: "assets/images/Gumball.jpg",         name: "Gumball",        price: 20,  req: 100 },
  { file: "assets/images/darwin.jpg",          name: "Darwin",         price: 20,  req: 100 },
  { file: "assets/images/agnes-tachyon.jpg",   name: "Agnes Tachyon",  price: 30,  req: 300 },
  { file: "assets/images/pessi.jpg",            name: "Pessi",          price: 30,  req: 300 },
  { file: "assets/images/camellonaldo.jpg",     name: "Camellonaldo",   price: 40,  req: 800 },
  { file: "assets/images/pan.jpg",              name: "Pan",            price: 40,  req: 800 },
  { file: "assets/images/big-mac.jpg",          name: "Big Mac",        price: 50,  req: 1500 },
  { file: "assets/images/killian-dictador.jpg",  name: "Killian",        price: 50,  req: 1500 }
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
  { id: "jesus-blessing", name: "Bendición de Jesús", price: 0, requiresRoulette: "divine", isSecret: true },
  { id: "gold-complete",  name: "Completista",        price: 0, isReward: true }
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
  { id: "first_blood",  tier: "bronze", name: "First Blood",         desc: "Derrota al Chaos God por primera vez", category: "boss",    reward: null },

  // PLATA (5)
  { id: "clickeador_pro",tier: "silver", name: "Clickeador Pro",      desc: "Alcanzá 5,000 clicks",                category: "clicks",  reward: null },
  { id: "slider",       tier: "silver", name: "Slider",              desc: "Comprá 3 fotos de perfil",            category: "fotos",   reward: null },
  { id: "first_boost",  tier: "silver", name: "First Boost",         desc: "Activá tu primer boost",              category: "clicks",  reward: null },
  { id: "espia",        tier: "silver", name: "Espía",               desc: "Comprá 3 frases",                     category: "frases",  reward: null },

  // ORO (15)
  { id: "bot_frenesi",  tier: "gold",   name: "Bot Frenesí",         desc: "Alcanzá 25,000 clicks",               category: "clicks",  reward: null },
  { id: "multitud",     tier: "gold",   name: "Multitud",            desc: "Comprá 6 fotos de perfil",            category: "fotos",   reward: null },
  { id: "mouse_breaker",tier: "gold",   name: "Mouse Breaker",       desc: "Alcanzá 50,000 clicks",               category: "clicks",  reward: { type: "picture", file: "assets/images/Ratón_gamer.jpg" } },
  { id: "ruletero",     tier: "gold",   name: "Ruletero",            desc: "Girá la ruleta 5 veces",             category: "coleccion", reward: null },
  { id: "loco_completo",tier: "gold",   name: "Loco Completo",       desc: "Llegá a 100% caos 3 veces",           category: "clicks",  reward: null },
  { id: "tipografo",    tier: "gold",   name: "Tipógrafo",           desc: "Comprá todas las 5 fuentes",          category: "frases",  reward: null },
  { id: "intelectual",  tier: "gold",   name: "Intelectual",         desc: "Desbloqueá todos los hechos",         category: "hechos",  reward: { type: "picture", file: "assets/images/Nikola-Albert.webp" } },
  { id: "espia_pro",    tier: "gold",   name: "Espía Pro",           desc: "Comprá 6 frases",                     category: "frases",  reward: null },
  { id: "riqueza",      tier: "gold",   name: "Riqueza",             desc: "Acumulá 1,000 monedas",               category: "clicks",  reward: null },
  { id: "marmolista",   tier: "gold",   name: "Marmolista",          desc: "Activá 25 boosts",                    category: "clicks",  reward: null },
  { id: "boss_slayer",  tier: "gold",   name: "Boss Slayer",         desc: "Derrota al Chaos God 5 veces",        category: "boss",    reward: { type: "picture", file: "assets/boss.jpg" } },
  { id: "ruleta_maestra",tier: "gold",  name: "Ruleta Maestra",      desc: "Girá la ruleta 25 veces",             category: "coleccion", reward: null },
  { id: "coleccionista",tier: "gold",   name: "Coleccionista",       desc: "Desbloqueá todos los logros de Colección", category: "coleccion", reward: { type: "picture", file: "assets/images/medalla_de_oro.jpg" } },
  { id: "maratonista",  tier: "gold",   name: "Maratonista",         desc: "Activá 10 boosts",                    category: "clicks",  reward: null },
  { id: "bendecido",    tier: "gold",   name: "Bendecido",           desc: "Recibí la bendición divina",          category: "coleccion", reward: { type: "picture", file: "assets/images/Jesus_Payne.jpg" } },
  { id: "completista",  tier: "gold",   name: "Completista",         desc: "Desbloqueá todos los logros",         category: "clicks",  reward: { type: "frame", id: "gold-complete" } },
  { id: "primer_collectible", tier: "bronze", name: "Primer Collectible", desc: "Agarra tu primer collectible", category: "collectibles", reward: null },
  { id: "coleccionista_comun", tier: "silver", name: "Coleccionista Común", desc: "Agarra los 5 Comunes al menos una vez", category: "collectibles", reward: null },
  { id: "ojo_raro", tier: "silver", name: "Ojo Raro", desc: "Agarra los 2 Raros al menos una vez", category: "collectibles", reward: null },
  { id: "cazador_legendario", tier: "gold", name: "Cazador Legendario", desc: "Agarra tu primer Legendario", category: "collectibles", reward: null },
  { id: "maestro_del_caos", tier: "gold", name: "Maestro del Caos", desc: "Agarra los 2 Legendarios al menos una vez", category: "collectibles", reward: null },
  { id: "bien_armado", tier: "silver", name: "Bien Armado", desc: "Gana una pelea usando 2 armas distintas", category: "arsenal", reward: null },
  { id: "coleccionista_arsenal", tier: "gold", name: "Coleccionista del Arsenal", desc: "Compra al menos 1 de cada una de las 5 armas", category: "arsenal", reward: null },
  { id: "destructor_armado", tier: "silver", name: "Destructor Armado", desc: "Inflige 200 HP de da\u00f1o total con armas", category: "arsenal", reward: null },
  { id: "racha_3", tier: "silver", name: "Racha de 3", desc: "Ingres\u00e1 3 d\u00edas seguidos", category: "daily", reward: null },
  { id: "racha_7", tier: "gold",   name: "Racha de 7", desc: "Ingres\u00e1 7 d\u00edas seguidos", category: "daily", reward: null }
];

var achievementsUnlocked = safeJSON("chaosAchievements", []);
if (!Array.isArray(achievementsUnlocked)) achievementsUnlocked = [];

var chaosReachedHundredCount = safeNumber("chaosReachedHundredCount", 0, true);
var hasCountedHundredThisCycle = false;
var rouletteTotalSpins = safeNumber("chaosRouletteSpins", safeNumber("chaosRouletteTotalSpins", 0, true), true);

function isAchievementUnlocked(id) {
  return achievementsUnlocked.indexOf(id) !== -1;
}

function unlockAchievement(id) {
  var ach = ACHIEVEMENTS.find(function(a) { return a.id === id; });
  if (!ach) return false;
  var wasUnlocked = isAchievementUnlocked(id);

  // Always apply reward (even if already unlocked) to fix missing rewards
  applyAchievementReward(id);

  if (wasUnlocked) return false;

  achievementsUnlocked.push(id);
  localStorage.setItem("chaosAchievements", JSON.stringify(achievementsUnlocked));
  showAchievementNotification(ach);

  // Memory fragment: first achievement
  if (typeof checkMemoryTrigger === "function") checkMemoryTrigger("achievement");

  if (typeof checkAcumulador === "function") checkAcumulador();

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
  if (id === "boss_slayer" && typeof ownedThemes !== "undefined" && Array.isArray(ownedThemes) && ownedThemes.indexOf("fire") === -1) {
    ownedThemes.push("fire");
    safeJSON_set("chaosOwnedThemes", ownedThemes);
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
      case "curador":      unlocked = false; break;
      case "ruletero":     unlocked = rouletteTotalSpins >= 5; break;
      case "ruleta_maestra":unlocked = rouletteTotalSpins >= 25; break;
      case "intelectual":  unlocked = unlockedFacts.length >= FACTS.length; break;
      case "bendecido":    unlocked = jesusRewardUnlocked; break;
      case "first_blood":  unlocked = (parseInt(localStorage.getItem("chaosBossKills"), 10) || 0) >= 1; break;
      case "primer_collectible": unlocked = Object.keys(collectedCounts).some(function(k){ return (collectedCounts[k]||0) > 0; }); break;
      case "coleccionista_comun": unlocked = COLLECTIBLES.filter(function(c){return c.tier==="comun";}).every(function(c){ return (collectedCounts[c.id]||0) > 0; }); break;
      case "ojo_raro": unlocked = COLLECTIBLES.filter(function(c){return c.tier==="raro";}).every(function(c){ return (collectedCounts[c.id]||0) > 0; }); break;
      case "cazador_legendario": unlocked = COLLECTIBLES.filter(function(c){return c.tier==="legendario";}).some(function(c){ return (collectedCounts[c.id]||0) > 0; }); break;
      case "maestro_del_caos": unlocked = COLLECTIBLES.filter(function(c){return c.tier==="legendario";}).every(function(c){ return (collectedCounts[c.id]||0) > 0; }); break;
      case "bien_armado": unlocked = (localStorage.getItem("chaosWonWithTwoWeapons") === "1"); break;
      case "coleccionista_arsenal": {
        var ars = {};
        try { ars = JSON.parse(localStorage.getItem("chaosArsenal") || "{}"); } catch (e) {}
        var arsIds = ["pollo","bazooka","katana","trex","plus4"];
        unlocked = arsIds.every(function(id){ return ars[id] && (ars[id].bought||0) >= 1; });
        break;
      }
      case "destructor_armado": unlocked = (parseInt(localStorage.getItem("chaosWeaponDamage") || "0", 10) >= 200); break;
      case "racha_3": unlocked = (dailyState && typeof dailyState.streak === "number" && dailyState.streak >= 3); break;
      case "racha_7": unlocked = (dailyState && typeof dailyState.streak === "number" && dailyState.streak >= 7); break;
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
var achievementsBtn = null;
var achievementsPanel = document.getElementById("achievementsPanel");
var achievementsCloseBtn = document.getElementById("achievementsClose");

if (achievementsBtn) {
  achievementsBtn.addEventListener("click", function() {
    achievementsOpen = !achievementsOpen;
    if (achievementsOpen) {
      achievementsPanel.classList.add("open");
      achievementsBtn.setAttribute("aria-expanded", "true");
      buildAchievements();
    } else {
      achievementsPanel.classList.remove("open");
      achievementsBtn.setAttribute("aria-expanded", "false");
    }
  });
}
achievementsCloseBtn.addEventListener("click", function() {
  achievementsPanel.classList.remove("open");
  achievementsOpen = false;
  if (achievementsBtn) achievementsBtn.setAttribute("aria-expanded", "false");
});
achievementsPanel.addEventListener("click", function(e) {
  if (e.target === achievementsPanel) {
    achievementsPanel.classList.remove("open");
    achievementsOpen = false;
  }
});

function migrateAssetPaths() {
  var migrated = false;

  if (Array.isArray(inventory.pictures)) {
    inventory.pictures = inventory.pictures.map(function(p) {
      if (typeof p === "string" && p.indexOf("assets/") !== 0 && /\.(jpg|jpeg|png|webp)$/i.test(p)) {
        migrated = true;
        return "assets/images/" + p;
      }
      return p;
    });
  }

  // inventory.collectibles are IDs (e.g. "doge", "agua"), NOT paths.
  // Migration: undo any previous buggy prepending of "assets/images/"
  if (Array.isArray(inventory.collectibles)) {
    inventory.collectibles = inventory.collectibles.map(function(id) {
      if (typeof id === "string" && id.indexOf("assets/images/") === 0) {
        migrated = true;
        return id.replace(/^assets\/images\//, "");
      }
      return id;
    });
  }

  if (equipped.picture && typeof equipped.picture === "string" && equipped.picture.indexOf("assets/") !== 0 && /\.(jpg|jpeg|png|webp)$/i.test(equipped.picture)) {
    equipped.picture = "assets/images/" + equipped.picture;
    migrated = true;
  }

  if (migrated) {
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
  // Secret slogans (mouse-breaker, jesus-blesses) require external conditions.
  // Only allow equipping them if the requirements are still met.
  if (slogan.requiresBoosts || slogan.requiresRoulette) {
    if (!canBuySlogan(slogan)) {
      showToast("No cumplís los requisitos", "error");
      return;
    }
  }
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

function buildShopTabs() {
  var tabsContainer = document.getElementById("shopTabs");
  if (!tabsContainer) return;

  tabsContainer.innerHTML = "";

  var tabs = [
    { key: "items",  label: "ITEMS" },
    { key: "themes", label: "TEMAS" }
  ];

  tabs.forEach(function(tab) {
    var btn = document.createElement("button");
    btn.className = "shop-tab" + (shopTab === tab.key ? " active" : "");
    btn.textContent = tab.label;
    btn.setAttribute("data-tab", tab.key);
    btn.addEventListener("click", function() {
      shopTab = tab.key;
      buildShop();
    });
    tabsContainer.appendChild(btn);
  });
}

function buildShopThemes() {
  var list = document.getElementById("shopList");

  list.appendChild(buildShopSection("TEMAS"));

  var grid = document.createElement("div");
  grid.className = "theme-grid";
  list.appendChild(grid);

  SHOP_THEMES.forEach(function(theme) {
    var swatch = document.createElement("div");
    swatch.className = "theme-swatch tier-" + theme.tier;
    if (theme.key === equippedTheme) swatch.classList.add("equipped");
    if (isThemeOwned(theme.key)) swatch.classList.add("owned");

    var colors = theme.swatch;
    var gradientCss = theme.key === "chaos"
      ? "linear-gradient(135deg, #ff0055, #ffcc00, #00ff88, #aa00ff, #ff0055)"
      : "linear-gradient(135deg, " + colors[0] + ", " + colors[1] + ")";

    var preview = document.createElement("div");
    preview.className = "theme-preview";
    preview.style.background = gradientCss;
    swatch.appendChild(preview);

    var name = document.createElement("div");
    name.className = "theme-name";
    name.textContent = theme.name;
    swatch.appendChild(name);

    var badgeText = theme.tier === 2 ? "PRO" : (theme.price === 0 ? "GRATIS" : "");
    if (badgeText) {
      var badge = document.createElement("div");
      badge.className = "theme-badge";
      badge.textContent = badgeText;
      swatch.appendChild(badge);
    }

    var action = document.createElement("button");
    action.className = "theme-action";
    if (theme.key === equippedTheme) {
      action.classList.add("equipped");
      action.textContent = "EQUIPADO";
      action.disabled = true;
    } else if (isThemeOwned(theme.key)) {
      action.classList.add("equip");
      action.textContent = "EQUIPAR";
      action.onclick = function() { equipTheme(theme.key); };
    } else if (theme.rewardOnly) {
      action.classList.add("reward");
      action.textContent = theme.rewardHint || "RECOMPENSA";
      action.disabled = true;
    } else {
      action.classList.add("buy");
      action.textContent = theme.price + " 🪙";
      if (coins < theme.price) action.classList.add("cannot-afford");
      action.onclick = function() { buyTheme(theme); };
    }
    swatch.appendChild(action);

    grid.appendChild(swatch);
  });
}

function buildShopItems() {
  var list = document.getElementById("shopList");

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

  var blessingFrames = SHOP_FRAMES.filter(function(f) { return f.requiresRoulette === "divine"; });
  var rewardFrames = SHOP_FRAMES.filter(function(f) { return f.isReward && inventory.frames.indexOf(f.id) !== -1; });

  if (jesusRewardUnlocked && blessingFrames.length > 0) {
    list.appendChild(buildShopSection("MARCOS · BENDICIÓN"));
    blessingFrames.forEach(function(frame) {
      list.appendChild(buildShopFrame(frame));
    });
  }

  if (rewardFrames.length > 0) {
    list.appendChild(buildShopSection("RECOMPENSA · MARCOS"));
    rewardFrames.forEach(function(frame) {
      list.appendChild(buildShopFrame(frame));
    });
  }

  // Achievement rewards shown in shop (if owned) - separate from regular shop
  // Only show rewards that are NOT already listed in regular shop sections.
  var rewardSections = [
    { file: "assets/images/Rat\u00f3n_gamer.jpg", name: "Mouse Breaker", section: "MOUSE BREAKER" },
    { file: "assets/images/Nikola-Albert.webp", name: "Intelectual", section: "INTELECTUAL" },
    { file: "assets/images/medalla_de_oro.jpg", name: "Coleccionista", section: "COLECCIONISTA" },
    { file: "assets/images/Jesus_Payne.jpg", name: "Bendecido", section: "BENDECIDO" }
  ];
  // Build set of file paths already shown in regular shop sections
  var alreadyShownFiles = {};
  SHOP_PICTURES.forEach(function(p) { alreadyShownFiles[p.file] = true; });
  SHOP_SECRET_PICTURES.forEach(function(p) { alreadyShownFiles[p.file] = true; });

  var shownSections = {};
  rewardSections.forEach(function(r) {
    if (inventory.pictures.indexOf(r.file) >= 0 && !alreadyShownFiles[r.file]) {
      if (!shownSections[r.section]) {
        list.appendChild(buildShopSection("RECOMPENSA · " + r.section));
        shownSections[r.section] = true;
      }
      list.appendChild(buildShopPicture({ file: r.file, name: r.name, isReward: true }));
    }
  });
}

function buildShop() {
  var list = document.getElementById("shopList");
  list.innerHTML = "";

  buildShopTabs();

  if (shopTab === "themes") {
    buildShopThemes();
  } else {
    buildShopItems();
  }
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
  if (frame.requiresRoulette === "divine") {
    reqSpan.textContent = "\u2715 Bendición divina";
  } else if (frame.isReward) {
    reqSpan.textContent = "\u2715 Recompensa de logro";
  } else {
    reqSpan.textContent = "\u2715 No disponible";
  }
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
  if (!soundEnabled) return;
  try {
    var s = new Audio(file);
    s.volume = volume || 0.4;
    s.play().catch(function() {});
    // Release the Audio object once playback ends so the browser can GC it.
    s.onended = function() {
      s.src = "";
      s.onended = null;
    };
  } catch (e) {}
}

function playSplash() {
  if (!soundEnabled) return;
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

var COLLECTIBLES = [
  { id: "gato", name: "Gato", src: "assets/images/gato.png", sound: "assets/sounds/meow.mp3", tier: "comun", desc: "Un gato que cae del cielo." },
  { id: "sardina", name: "Sardina", src: "assets/images/sardina.png", sound: "assets/sounds/splash.mp3", tier: "comun", desc: "Una sardina que nada." },
  { id: "sandwich", name: "Sandwich de Vainilla", src: "assets/images/vanilla-sandwich.png", sound: "assets/sounds/crunchy-bite.mp3", tier: "comun", desc: "Un sandwich crujiente." },
  { id: "c", name: "La C del Caos", src: "assets/images/c.png", sound: "assets/sounds/magic-fairy.mp3", tier: "comun", desc: "La letra C, brillando con caos." },
  { id: "refresco", name: "Refresco Zuko", src: "assets/images/refresco-zuko.png", sound: "assets/sounds/cola-sound-effect.mp3", tier: "raro", desc: "Un refresco en zigzag." },
  { id: "honguito", name: "Honguito Mágico", src: "assets/images/honguito.png", sound: "assets/sounds/mario-64-lets-a-go.mp3", tier: "raro", desc: "Un hongo que gira y crece." },
  { id: "amongus", name: "Among Us", src: "assets/images/amongus.png", sound: "assets/sounds/emergency-meeting-among-us.mp3", tier: "legendario", desc: "Un tripulante sospechoso." },
  { id: "pizzaguy", name: "Pizza Guy", src: "assets/images/pizza-guy.png", sound: "assets/sounds/pizza-roblox.mp3", tier: "legendario", desc: "El repartidor que esquiva.", house: "assets/images/house.png" }
];

var WEAPONS = [
  { id: "pollo", name: "Pollo Kentucky", src: "assets/images/pollo-kentucky.png", price: 50, tier: "comun", effect: "time", value: 5, desc: "+5s al reloj del boss." },
  { id: "bazooka", name: "Bazooka", src: "assets/images/bazooka.png", price: 100, tier: "comun", effect: "burst", value: 25, desc: "-25 HP instantáneo al boss." },
  { id: "katana", name: "Katana", src: "assets/images/katana.png", price: 120, tier: "comun", effect: "autoclick", rate: 1, duration: 5000, desc: "+1 click/seg automático por 5s." },
  { id: "trex", name: "T-Rex", src: "assets/images/t-rex.png", price: 220, tier: "mitico", effect: "combo", burst: 50, rate: 1, duration: 3000, desc: "-50 HP + +1 click/seg por 3s." },
  { id: "plus4", name: "+4", src: "assets/images/plus4.png", price: 240, tier: "mitico", effect: "autoclick", rate: 4, duration: 1000, desc: "+4 clicks/seg por 1s." }
];

var arsenal = safeJSON("chaosArsenal", {});

var activeCollectible = null;
var collectedCounts = safeJSON("chaosCollected", {});

function saveCollected() {
  safeJSON_set("chaosCollected", collectedCounts);
}

function isCollected(id) {
  return (collectedCounts[id] || 0) > 0;
}

function getCollectCount(id) {
  return collectedCounts[id] || 0;
}

function collectItem(c) {
  if (!c || c.caught) return;
  c.caught = true;
  var id = c.id;
  collectedCounts[id] = (collectedCounts[id] || 0) + 1;
  saveCollected();
  if (c.sound) playSoundSafe(c.sound);
  if (id === "gato" || id === "sardina") addCoins(5, "collectible-" + id, true);
  if (typeof showToast === "function") showToast("¡" + c.name + "!", "success");
  if (typeof checkAchievements === "function") checkAchievements();
  if (typeof checkAcumulador === "function") checkAcumulador();
  if (c.el && c.el.parentNode) {
    c.el.classList.add("collected");
    setTimeout(function() { if (c.el.parentNode) c.el.parentNode.removeChild(c.el); }, 400);
  }
  if (c === activeCollectible) activeCollectible = null;
}

function makeBasicCollectible(c) {
  if (activeCollectible) return null;
  var el = document.createElement("div");
  el.className = "collectible collectible-" + c.id + " tier-" + c.tier;
  el.innerHTML = '<img src="' + c.src + '" alt="' + c.name + '" draggable="false">';
  el.style.left = (5 + Math.random() * 85) + "%";
  el.style.top = (20 + Math.random() * 50) + "%";
  document.body.appendChild(el);
  var obj = { id: c.id, name: c.name, src: c.src, sound: c.sound, el: el, caught: false };
  activeCollectible = obj;
  el.addEventListener("click", function(e) { e.stopPropagation(); collectItem(obj); });
  setTimeout(function() {
    if (!obj.caught && obj === activeCollectible) {
      if (el.parentNode) el.parentNode.removeChild(el);
      activeCollectible = null;
    }
  }, 8000);
  return obj;
}

function spawnSandwich() {
  if (activeCollectible) return;
  var c = COLLECTIBLES.find(function(x) { return x.id === "sandwich"; });
  if (!c) return;
  var el = document.createElement("div");
  el.className = "collectible collectible-sandwich tier-" + c.tier;
  el.innerHTML = '<img src="' + c.src + '" alt="' + c.name + '" draggable="false">';
  document.body.appendChild(el);
  var obj = { id: c.id, name: c.name, src: c.src, sound: c.sound, el: el, caught: false };
  activeCollectible = obj;

  function place() {
    el.style.left = (5 + Math.random() * 85) + "%";
    el.style.top = (15 + Math.random() * 55) + "%";
  }
  place();
  el.addEventListener("click", function(e) { e.stopPropagation(); collectItem(obj); });

  var cycle = setInterval(function() {
    if (obj.caught) { clearInterval(cycle); return; }
    el.classList.add("collectible-hidden");
    setTimeout(function() {
      if (obj.caught) return;
      place();
      el.classList.remove("collectible-hidden");
    }, 250);
  }, 2000);

  setTimeout(function() {
    clearInterval(cycle);
    if (!obj.caught && obj === activeCollectible) {
      if (el.parentNode) el.parentNode.removeChild(el);
      activeCollectible = null;
    }
  }, 12000);
}

function spawnRefresco() {
  if (activeCollectible) return;
  var c = COLLECTIBLES.find(function(x) { return x.id === "refresco"; });
  if (!c) return;
  var el = document.createElement("div");
  el.className = "collectible collectible-refresco tier-" + c.tier + " zigzag";
  el.innerHTML = '<img src="' + c.src + '" alt="' + c.name + '" draggable="false">';
  document.body.appendChild(el);
  var obj = { id: c.id, name: c.name, src: c.src, sound: c.sound, el: el, caught: false };
  activeCollectible = obj;
  el.addEventListener("click", function(e) { e.stopPropagation(); collectItem(obj); });
  setTimeout(function() {
    if (!obj.caught && obj === activeCollectible) {
      if (el.parentNode) el.parentNode.removeChild(el);
      activeCollectible = null;
    }
  }, 8000);
}

function spawnHonguito() {
  if (activeCollectible) return;
  var c = COLLECTIBLES.find(function(x) { return x.id === "honguito"; });
  if (!c) return;
  var el = document.createElement("div");
  el.className = "collectible collectible-honguito tier-" + c.tier;
  el.innerHTML = '<img src="' + c.src + '" alt="' + c.name + '" draggable="false">';
  el.style.left = "50%";
  el.style.top = "50%";
  el.style.marginLeft = "-40px";
  el.style.marginTop = "-40px";
  document.body.appendChild(el);
  var obj = { id: c.id, name: c.name, src: c.src, sound: c.sound, el: el, caught: false, catchable: false };
  activeCollectible = obj;

  el.addEventListener("click", function(e) {
    e.stopPropagation();
    if (!obj.catchable) return;
    collectItem(obj);
  });

  el.classList.add("honguito-growing");
  setTimeout(function() {
    if (obj.caught) return;
    el.classList.remove("honguito-growing");
    el.classList.add("honguito-still");
    obj.catchable = true;
  }, 1200);
  setTimeout(function() {
    if (obj.caught) return;
    el.classList.remove("honguito-still");
    el.classList.add("honguito-shrinking");
    obj.catchable = false;
  }, 2200);
  setTimeout(function() {
    if (!obj.caught && obj === activeCollectible) {
      if (el.parentNode) el.parentNode.removeChild(el);
      activeCollectible = null;
    }
  }, 3400);
}

function spawnAmongus() {
  if (activeCollectible) return;
  var c = COLLECTIBLES.find(function(x) { return x.id === "amongus"; });
  if (!c) return;
  var el = document.createElement("div");
  el.className = "collectible collectible-amongus tier-" + c.tier;
  el.innerHTML = '<img src="' + c.src + '" alt="' + c.name + '" draggable="false">';
  el.style.top = (15 + Math.random() * 55) + "%";
  document.body.appendChild(el);
  var obj = { id: c.id, name: c.name, src: c.src, sound: c.sound, el: el, caught: false, dodges: 0 };
  activeCollectible = obj;

  el.classList.add("amongus-move");
  playSoundSafe(c.sound);

  el.addEventListener("click", function(e) {
    e.stopPropagation();
    if (obj.caught) return;
    if (obj.dodges < 2) {
      obj.dodges++;
      el.style.top = (15 + Math.random() * 55) + "%";
      el.classList.remove("amongus-move");
      void el.offsetWidth;
  el.classList.add("amongus-move");
    } else {
      collectItem(obj);
    }
  });

  setTimeout(function() {
    if (!obj.caught && obj === activeCollectible) {
      if (el.parentNode) el.parentNode.removeChild(el);
      activeCollectible = null;
    }
  }, 5000);
}

function spawnHouse(pizzaObj) {
  var el = document.createElement("div");
  el.className = "collectible-house";
  el.innerHTML = '<img src="assets/images/house.png" alt="casa" draggable="false">';
  el.style.left = "85%";
  el.style.top = "35%";
  document.body.appendChild(el);
  el.classList.add("house-fall");
  pizzaObj.houseEl = el;
  el.addEventListener("click", function(e) {
    e.stopPropagation();
    if (pizzaObj.houseDestroyed) return;
    pizzaObj.houseDestroyed = true;
    if (pizzaObj.arrivedTimer) clearTimeout(pizzaObj.arrivedTimer);
    el.classList.add("house-destroyed");
    var pizzaEl = pizzaObj.el;
    if (pizzaEl) {
      var rect = pizzaEl.getBoundingClientRect();
      pizzaEl.classList.remove("pizzaguy-move");
      pizzaEl.style.left = rect.left + "px";
      pizzaEl.style.top = rect.top + "px";
    }
    setTimeout(function() { if (el.parentNode) el.parentNode.removeChild(el); }, 300);
  });
  setTimeout(function() {
    if (el.parentNode) el.parentNode.removeChild(el);
  }, 10000);
}

function spawnPizzaGuy() {
  if (activeCollectible) return;
  var c = COLLECTIBLES.find(function(x) { return x.id === "pizzaguy"; });
  if (!c) return;
  var el = document.createElement("div");
  el.className = "collectible collectible-pizzaguy tier-" + c.tier;
  el.innerHTML = '<img src="' + c.src + '" alt="' + c.name + '" draggable="false">';
  el.style.top = (15 + Math.random() * 45) + "%";
  document.body.appendChild(el);
  var obj = { id: c.id, name: c.name, src: c.src, sound: c.sound, el: el, caught: false, houseDestroyed: false };
  activeCollectible = obj;

  el.classList.add("pizzaguy-move");
  spawnHouse(obj);
  playSoundSafe(c.sound);

  el.addEventListener("click", function(e) {
    e.stopPropagation();
    if (obj.caught) return;
    if (!obj.houseDestroyed) {
      el.style.top = (15 + Math.random() * 45) + "%";
    } else {
      collectItem(obj);
    }
  });

  obj.arrivedTimer = setTimeout(function() {
    if (obj.caught || obj.houseDestroyed) return;
    var rect = el.getBoundingClientRect();
    el.classList.remove("pizzaguy-move");
    el.style.left = rect.left + "px";
  }, 3500);

  setTimeout(function() {
    if (obj.arrivedTimer) clearTimeout(obj.arrivedTimer);
    if (!obj.caught && obj === activeCollectible) {
      if (el.parentNode) el.parentNode.removeChild(el);
      if (obj.houseEl && obj.houseEl.parentNode) obj.houseEl.parentNode.removeChild(obj.houseEl);
      activeCollectible = null;
    }
  }, 10000);
}

function spawnCollectibleById(id) {
  switch (id) {
    case "gato":
    case "c": spawnFalling(id); break;
    case "sardina": spawnSardine(); break;
    case "sandwich": spawnSandwich(); break;
    case "refresco": spawnRefresco(); break;
    case "honguito": spawnHonguito(); break;
    case "amongus": spawnAmongus(); break;
    case "pizzaguy": spawnPizzaGuy(); break;
    default:
      var c = COLLECTIBLES.find(function(x) { return x.id === id; });
      if (c) makeBasicCollectible(c);
  }
}

function trySpawnCollectible() {
  if (activeCollectible) return;
  var r = Math.random();
  var comunChance = 0.0055;
  var raroChance = 0.001;
  var legChance = 0.0001;
  var total = comunChance + raroChance + legChance;
  if (r >= total) return;
  var tier;
  if (r < comunChance) tier = "comun";
  else if (r < comunChance + raroChance) tier = "raro";
  else tier = "legendario";
  var pool = COLLECTIBLES.filter(function(c) { return c.tier === tier; });
  if (pool.length === 0) return;
  var pick = pool[Math.floor(Math.random() * pool.length)];
  spawnCollectibleById(pick.id);
}

function spawnFalling(id) {
  if (activeCollectible) return;
  var c = COLLECTIBLES.find(function(x) { return x.id === id; });
  if (!c) return;
  if (!canCreate("falling-cat")) return;
  var el = document.createElement("div");
  el.className = "falling-cat collectible collectible-" + id + " tier-" + c.tier;
  el.innerHTML = '<img src="' + c.src + '" alt="' + c.name + '" draggable="false">';
  el.style.left = (5 + Math.random() * 85) + "%";
  document.body.appendChild(el);

  var obj = { id: c.id, name: c.name, src: c.src, sound: c.sound, el: el, caught: false };
  activeCollectible = obj;

  el.addEventListener("click", function(e) {
    if (obj.caught) return;
    e.stopPropagation();
    collectItem(obj);
  });

  setTimeout(function() { if (!obj.caught) el.classList.add("falling"); }, 80);

  setTimeout(function() {
    if (obj.caught) return;
    el.classList.add("missed");
    if (el.parentNode) el.parentNode.removeChild(el);
    if (obj === activeCollectible) activeCollectible = null;
    trackedRemove(el, "falling-cat");
  }, 2500);
}

function spawnSardine() {
  if (activeCollectible) return;
  if (!canCreate("sardine")) return;
  var fish = document.createElement("div");
  fish.className = "sardine collectible collectible-sardine";
  fish.innerHTML = '<img src="assets/images/sardina.png" alt="sardine" draggable="false">';
  fish.style.bottom = (8 + Math.random() * 30) + "%";
  document.body.appendChild(fish);

  var obj = { id: "sardina", name: "Sardina", src: "assets/images/sardina.png", sound: "assets/sounds/splash.mp3", el: fish, caught: false };
  activeCollectible = obj;

  function clickHandler(e) {
    if (obj.caught) return;
    e.stopPropagation();
    collectItem(obj);
  }
  fish.addEventListener("click", clickHandler);

  setTimeout(function() { if (!obj.caught) fish.classList.add("swimming"); }, 80);

  setTimeout(function() {
    if (obj.caught) return;
    fish.classList.add("missed");
    if (fish.parentNode) fish.parentNode.removeChild(fish);
    if (obj === activeCollectible) activeCollectible = null;
    trackedRemove(fish, "sardine");
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
  spawnCoinButton();
}

chaosSetInterval(function() {
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
  var raw = (profileNameEl.textContent || "").trim().slice(0, 15);
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
  // Modern browsers: execCommand is deprecated but still works as a fallback.
  // Prefer direct textContent manipulation when possible.
  var selection = window.getSelection();
  if (!selection || !selection.rangeCount) return;
  selection.deleteFromDocument();
  selection.getRangeAt(0).insertNode(document.createTextNode(text));
  selection.collapseToEnd();
});

updateProfile();

// Sound toggle wiring
var soundToggleEl = document.getElementById("soundToggle");
var soundIconEl = document.getElementById("soundIcon");
function renderSoundToggle() {
  if (!soundToggleEl || !soundIconEl) return;
  soundIconEl.textContent = soundEnabled ? "🔊" : "🔇";
  if (soundEnabled) soundToggleEl.classList.remove("muted");
  else soundToggleEl.classList.add("muted");
  soundToggleEl.title = soundEnabled ? "Sonido ON (click para silenciar)" : "Sonido OFF (click para activar)";
}
if (soundToggleEl) {
  renderSoundToggle();
  soundToggleEl.addEventListener("click", function() {
    soundEnabled = !soundEnabled;
    try { localStorage.setItem("chaosSoundEnabled", JSON.stringify(soundEnabled)); } catch (e) {}
    renderSoundToggle();
  });
}

// Render initial chaos 100 counter (fix: was showing 0 on reload)
if (chaos100NumberEl) {
  chaos100NumberEl.textContent = chaosReachedHundredCount;
}

/* ========================= */
/* BOOST SYSTEM (Fase 2) */
/* ========================= */

var boostCharge = safeNumber("chaosBoostCharge", 0);
var boostCooldownUntil = safeNumber("chaosBoostCooldownUntil", 0, true);
var boostActiveUntil = safeNumber("chaosBoostActiveUntil", 0, true);
var boostActivationsCount = safeNumber("chaosBoostActivationsCount", 0, true);
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
var BOOST_CHARGE_PER_CLICK = 0.15;
var BOOST_DECAY_PER_100MS = 0.2;
var BOOST_DECAY_DELAY_MS = 800;
var BOOST_REQUIRED_FOR_UNLOCK = 5;

var lastBoostSave = 0;
var BOOST_SAVE_THROTTLE_MS = 1000;

function saveBoost() {
  localStorage.setItem("chaosBoostCharge", String(boostCharge));
  localStorage.setItem("chaosBoostCooldownUntil", String(boostCooldownUntil));
  localStorage.setItem("chaosBoostActiveUntil", String(boostActiveUntil));
  localStorage.setItem("chaosBoostActivationsCount", String(boostActivationsCount));
  localStorage.setItem("chaosBoostMilestone5", boostMilestone5Shown ? "1" : "0");
  lastBoostSave = Date.now();
}

function saveBoostIfDue() {
  if (Date.now() - lastBoostSave >= BOOST_SAVE_THROTTLE_MS) saveBoost();
}

function isBoostActive() {
  return boostActiveUntil > Date.now();
}
function isBoostCooldown() {
  return boostCooldownUntil > Date.now();
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
  saveBoostIfDue();
}

function activateBoost() {
  boostCharge = 0;
  boostActiveUntil = Date.now() + BOOST_DURATION_MS;
  boostCooldownUntil = Date.now() + BOOST_DURATION_MS + BOOST_COOLDOWN_MS;
  boostActivationsCount += 1;

  addCoins(25, "boost", true);
  showBoostBanner();
  playSoundSafe("assets/sounds/powerup.mp3");
  if (typeof checkMemoryTrigger === "function") checkMemoryTrigger("boost");

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
  boostBarEl.style.width = pct.toFixed(2) + "%";
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

  var beforeText = boostCountEl.textContent;
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
// Safety net: force an extra render after the first event loop tick
setTimeout(renderBoost, 0);
setTimeout(renderBoost, 100);

/* ========================= */
/* ROULETTE SYSTEM (Fase 10) */
/* ========================= */

var ROULETTE_TIPS = [
  "Equipá un tema PRO para ver efectos exclusivos.",
  "Los legendarios son rarísimos: paciencia.",
  "Activá boosts para ganar el doble de monedas.",
  "Enter o Espacio también disparan el caos.",
  "Llegá al 100% de caos para pelear contra el boss.",
  "Coleccioná las 8 apariciones para los logros.",
  "El botón de caos cambia de color con el tema.",
  "Girá la ruleta para invocar collectibles.",
  "El jackpot te da 500 monedas.",
  "Comprá marcos en la tienda para personalizar tu perfil."
];

function randomTip() {
  return ROULETTE_TIPS[Math.floor(Math.random() * ROULETTE_TIPS.length)];
}

var ROULETTE_PRIZES = [
  { id: "nada1", type: "nada", weight: 10 },
  { id: "nada2", type: "nada", weight: 10 },
  { id: "nada3", type: "nada", weight: 10 },
  { id: "nada4", type: "nada", weight: 10 },
  { id: "collectible", type: "collectible", weight: 20 },
  { id: "monedas", type: "monedas", weight: 20 },
  { id: "consejo", type: "consejo", weight: 15 },
  { id: "jackpot", type: "jackpot", weight: 5 }
];

var ROULETTE_SPIN_COST = 50;
var ROULETTE_SPIN_DURATION_MS = 7500;
var ROULETTE_CLICKS_PER_SPIN = 2000;
var ROULETTE_SECTOR_COUNT = ROULETTE_PRIZES.length;
var ROULETTE_SECTOR_ANGLE = 360 / ROULETTE_SECTOR_COUNT;

var rouletteSpinsCount = safeNumber("chaosRouletteSpins", rouletteTotalSpins, true);
var rouletteCurrentRotation = 0;
var rouletteSpinning = false;

function saveRouletteState() {
  localStorage.setItem("chaosRouletteSpins", String(rouletteSpinsCount));
  localStorage.setItem("chaosJesusReward", jesusRewardUnlocked ? "1" : "0");
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

function getTierColor(type) {
  if (type === "nada") return "#2a2a35";
  if (type === "collectible") return "#9c27b0";
  if (type === "monedas") return "#ffc107";
  if (type === "consejo") return "#00bcd4";
  if (type === "jackpot") return "#ff5722";
  return "#666";
}

function buildRouletteWheel() {
  var inner = document.getElementById("rouletteWheelInner");
  inner.innerHTML = "";
  var cx = 150, cy = 150, r = 140;
  var emojiByType = { "nada": "✖", "collectible": "🎁", "monedas": "🪙", "consejo": "💡", "jackpot": "💎" };
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
    path.setAttribute("fill", getTierColor(prize.type));
    path.setAttribute("class", "roulette-wheel-sector-bg");
    inner.appendChild(path);

    var midAngle = (startAngle + endAngle) / 2;
    var midRad = midAngle * Math.PI / 180;
    var imgCx = cx + (r * 0.62) * Math.cos(midRad);
    var imgCy = cy + (r * 0.62) * Math.sin(midRad);

    var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", imgCx);
    text.setAttribute("y", imgCy + 7);
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("font-size", "18");
    text.textContent = emojiByType[prize.type] || "?";
    inner.appendChild(text);
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
  var midAngle = prizeIndex * ROULETTE_SECTOR_ANGLE + ROULETTE_SECTOR_ANGLE / 2 - 90;
  var spins = 5 + Math.floor(Math.random() * 3);
  rouletteCurrentRotation = (Math.floor(rouletteCurrentRotation / 360) + spins) * 360 + (-90 - midAngle);
  var wheelEl = document.getElementById("rouletteWheel");
  wheelEl.style.transition = "transform " + ROULETTE_SPIN_DURATION_MS + "ms cubic-bezier(0.05, 0.85, 0.15, 1.0)";
  wheelEl.style.transform = "rotate(" + rouletteCurrentRotation + "deg)";

  try {
    playSoundSafe("assets/sounds/roulette.mp3", 0.6);
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
  var divineUnlocked = false;

  if (typeof checkMemoryTrigger === "function") checkMemoryTrigger("roulette");

  if (prize.type === "nada") {
    resultEl.textContent = "💨 NADA";
    resultEl.className = "roulette-result";
  } else if (prize.type === "collectible") {
    if (activeCollectible && activeCollectible.el && activeCollectible.el.parentNode) {
      activeCollectible.el.parentNode.removeChild(activeCollectible.el);
      activeCollectible = null;
    }
    var pool = COLLECTIBLES.filter(function(c) { return c.tier !== "legendario"; });
    var pick = pool[Math.floor(Math.random() * pool.length)];
    spawnCollectibleById(pick.id);
    resultEl.textContent = "🎁 ¡" + pick.name + " apareció!";
    resultEl.className = "roulette-result win";
  } else if (prize.type === "monedas") {
    addCoins(100, "roulette", false);
    resultEl.textContent = "+100 🪙";
    resultEl.className = "roulette-result";
  } else if (prize.type === "consejo") {
    resultEl.textContent = "💡 " + randomTip();
    resultEl.className = "roulette-result tip";
  } else if (prize.type === "jackpot") {
    addCoins(500, "roulette", true);
    resultEl.textContent = "💎 ¡500 MONEDAS!";
    resultEl.className = "roulette-result jackpot";
    if (!jesusRewardUnlocked) {
      unlockDivineReward(prize);
      divineUnlocked = true;
    }
  }

  saveRouletteState();
  rouletteTotalSpins++;
  rouletteSpinsCount = rouletteTotalSpins;
  localStorage.setItem("chaosRouletteSpins", String(rouletteTotalSpins));
  localStorage.removeItem("chaosRouletteTotalSpins");
  rouletteSpinning = false;
  updateRouletteInfo();
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

// toggleRoulette was removed - roulette now opens from the menu
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

var unlockedFragments = safeJSON("chaosMemoryFragments", []);
var MEMORY_FRAGMENTS = [];

checkAchievements();
updateChaosMeter();

// Handle pending reset from boss fight (or any other cause)
if (localStorage.getItem("chaosPendingReset") === "1") {
  localStorage.removeItem("chaosPendingReset");
  setTimeout(function() { resetEverything(); }, 100);
}

// Check if user just unlocked boss_slayer
if (localStorage.getItem("chaosUnlockedBossSlayer") === "1") {
  localStorage.removeItem("chaosUnlockedBossSlayer");
  setTimeout(function() {
    var unlocked = [];
    try { unlocked = JSON.parse(localStorage.getItem("chaosAchievements") || "[]"); } catch (e) {}
    var ach = ACHIEVEMENTS.filter(function(a) { return a.id === "boss_slayer"; })[0];
    if (ach) showAchievementNotification(ach);
  }, 1500);
}

/* ========================= */
/* CUSTOM THEMES               */
/* ========================= */

var SHOP_THEMES = [
  { key: "chaos",     name: "CAOS",        price: 0,  tier: 0, swatch: ["#ff0055", "#ffcc00"] },
  { key: "matrix",    name: "MATRIX",      price: 10, tier: 1, swatch: ["#00ff41", "#003b00"] },
  { key: "hellfire",  name: "HELLFIRE",    price: 10, tier: 1, swatch: ["#ff3300", "#ff9900"] },
  { key: "ocean",     name: "OCEAN",       price: 10, tier: 1, swatch: ["#39cccc", "#001f3f"] },
  { key: "toxic",     name: "TOXIC",       price: 10, tier: 1, swatch: ["#ccff00", "#76ff03"] },
  { key: "cyberpunk", name: "CYBERPUNK",   price: 10, tier: 1, swatch: ["#ff00ff", "#00ffff"] },
  { key: "sunset",    name: "SUNSET",      price: 10, tier: 1, swatch: ["#ff6b35", "#ff2975"] },
  { key: "fire",      name: "FUEGO",       price: 0,  tier: 2, swatch: ["#ff4500", "#ffcc00"], rewardOnly: true, rewardHint: "BOSS SLAYER" },
  { key: "void",      name: "VOID",        price: 50, tier: 2, swatch: ["#b026ff", "#00f0ff"] },
  { key: "gold",      name: "GOLD RUSH",   price: 50, tier: 2, swatch: ["#ffd700", "#ffaa00"] },
  { key: "blood",     name: "BLOOD MOON",  price: 50, tier: 2, swatch: ["#dc143c", "#8b0000"] }
];

var ownedThemes = safeJSON("chaosOwnedThemes", ["chaos"]);
if (!Array.isArray(ownedThemes)) ownedThemes = ["chaos"];
if (ownedThemes.indexOf("chaos") === -1) ownedThemes.push("chaos");
var equippedTheme = safeJSON("chaosEquippedTheme", "chaos");
if (ownedThemes.indexOf(equippedTheme) === -1 || !SHOP_THEMES.some(function(t) { return t.key === equippedTheme; })) {
  equippedTheme = "chaos";
}
var shopTab = "items"; // "items" or "themes"

function safeJSON_set(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {}
}

function isThemeOwned(themeKey) {
  return ownedThemes.indexOf(themeKey) !== -1;
}

function buyTheme(theme) {
  if (isThemeOwned(theme.key)) return;
  if (theme.rewardOnly) {
    showToast("Solo se obtiene como recompensa", "error");
    return;
  }
  if (coins < theme.price) {
    showToast("Monedas insuficientes", "error");
    return;
  }
  coins -= theme.price;
  localStorage.setItem("chaosCoins", String(coins));
  coinNumberEl.textContent = formatNumber(coins);
  if (shopOpen) updateShopBalance();
  ownedThemes.push(theme.key);
  safeJSON_set("chaosOwnedThemes", ownedThemes);
  showToast(theme.name + " comprado!", "success");
  playSoundSafe("assets/sounds/purchase.mp3");
  buildShop();
  checkAchievements();
}

function equipTheme(themeKey) {
  if (!isThemeOwned(themeKey)) {
    showToast("Tema no desbloqueado", "error");
    return;
  }
  equippedTheme = themeKey;
  safeJSON_set("chaosEquippedTheme", equippedTheme);
  applyTheme(themeKey);
  showToast("Tema equipado", "info");
  buildShop();
}

function applyTheme(themeKey) {
  var theme = SHOP_THEMES.filter(function(t) { return t.key === themeKey; })[0];
  var key = theme ? themeKey : "chaos";
  document.documentElement.setAttribute("data-theme", key);
  var meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", (theme && theme.swatch) ? theme.swatch[0] : "#ff0055");
}

// Apply saved theme on boot
applyTheme(equippedTheme);

// Reward-only themes granted by already-unlocked achievements
if (isAchievementUnlocked("boss_slayer")) applyAchievementReward("boss_slayer");

/* ========================= */
/* MEMORY FRAGMENTS            */
/* ========================= */
/* "El último humano" — narrative that unlocks as you play.
   8 fragments triggered by player actions. When all 8 are found,
   the final modal reveals the complete story. */

var MEMORY_FRAGMENTS = [
  {
    id: 1,
    trigger: "first_click",
    req: "Haz click en el botón",
    icon: "🔘",
    text: "Hola, botón. Soy yo otra vez."
  },
  {
    id: 2,
    trigger: "1000_clicks",
    req: "1.000 clicks",
    icon: "💭",
    text: "A veces siento que me escuchás. ¿Me escuchás?"
  },
  {
    id: 3,
    trigger: "5000_clicks",
    req: "5.000 clicks",
    icon: "📷",
    text: "Encontré una foto tuya en la basura. ¿Es esto un recuerdo?"
  },
  {
    id: 4,
    trigger: "first_achievement",
    req: "Desbloquea tu primer logro",
    icon: "🏆",
    text: "Hoy fue un buen día. Cliqueé mucho. Te extrañé."
  },
  {
    id: 5,
    trigger: "first_roulette",
    req: "Gira la ruleta por primera vez",
    icon: "🎰",
    text: "Giré la rueda del destino. No hay destino. Solo azar."
  },
  {
    id: 6,
    trigger: "first_boost",
    req: "Activa tu primer boost",
    icon: "⚡",
    text: "Por un segundo sentí que estaba vivo. Como vos."
  },
  {
    id: 7,
    trigger: "50000_clicks",
    req: "50.000 clicks",
    icon: "🌫️",
    text: "Ayer encontré a otro. No era humano tampoco. Solo números."
  },
  {
    id: 8,
    trigger: "loco_completo",
    req: "Logro 'Loco Completo' (3 ciclos de 100% caos)",
    icon: "🕯️",
    text: "Botón. Si me estás leyendo, hacé un último click por mí. Te lo pido. Por favor."
  }
];

function hasFragment(id) {
  return unlockedFragments.indexOf(id) !== -1;
}

function unlockMemoryFragment(id) {
  if (hasFragment(id)) return;
  unlockedFragments.push(id);
  safeJSON_set("chaosMemoryFragments", unlockedFragments);
  showMemoryFragment(id);
  updateMemoryMenuState();
}

function checkAcumulador() {
  if (typeof unlockedFragments !== "undefined" && unlockedFragments.indexOf(8) !== -1) return;
  var cao100 = chaosReachedHundredCount >= 1;
  var allCol = COLLECTIBLES.every(function(c){ return (collectedCounts[c.id]||0) > 0; });
  var boss10 = false;
  try { boss10 = localStorage.getItem("chaosDefeatedBossLevel10") === "1"; } catch (e) {}
  if (cao100 && allCol && boss10 && typeof unlockMemoryFragment === "function") {
    unlockMemoryFragment(8);
  }
}

function updateMemoryMenuState() {
  var el = document.getElementById("menuMemoryState");
  if (el) el.textContent = unlockedFragments.length + " / 8";
}

function showMemoryFragment(id) {
  var frag = MEMORY_FRAGMENTS.filter(function(f) { return f.id === id; })[0];
  if (!frag) return;

  var overlay = document.getElementById("memoryFragment");
  var numEl = document.getElementById("memoryFragmentNumber");
  var textEl = document.getElementById("memoryFragmentText");
  if (!overlay || !numEl || !textEl) return;

  numEl.textContent = "#" + id + " · " + frag.icon;
  textEl.textContent = frag.text;
  overlay.classList.add("show");

  // If this was the 8th fragment, show the final after this fades
  if (id === 8) {
    setTimeout(function() {
      overlay.classList.remove("show");
      setTimeout(function() { showMemoryFinal(); }, 400);
    }, 5800);
  } else {
    setTimeout(function() { overlay.classList.remove("show"); }, 6000);
  }
}

function closeMemoryFragment() {
  var overlay = document.getElementById("memoryFragment");
  if (overlay) overlay.classList.remove("show");
}

function showMemoryFinal() {
  var overlay = document.getElementById("memoryFinal");
  var listEl = document.getElementById("memoryFinalList");
  if (!overlay || !listEl) return;

  listEl.innerHTML = "";
  MEMORY_FRAGMENTS.forEach(function(f) {
    var item = document.createElement("div");
    item.className = "memory-final-item";
    var num = document.createElement("span");
    num.className = "memory-final-item-num";
    num.textContent = "#" + f.id + " · " + f.icon;
    item.appendChild(num);
    var txt = document.createElement("div");
    txt.textContent = f.text;
    item.appendChild(txt);
    listEl.appendChild(item);
  });

  overlay.classList.add("show");
}

function closeMemoryFinal() {
  var overlay = document.getElementById("memoryFinal");
  if (overlay) overlay.classList.remove("show");
}

function checkMemoryTrigger(eventName) {
  // Clicks-based
  if (eventName === "click") {
    if (!hasFragment(1)) unlockMemoryFragment(1);
    if (typeof totalClicks !== "undefined" && totalClicks >= 1000 && !hasFragment(2)) unlockMemoryFragment(2);
    if (typeof totalClicks !== "undefined" && totalClicks >= 5000 && !hasFragment(3)) unlockMemoryFragment(3);
    if (typeof totalClicks !== "undefined" && totalClicks >= 50000 && !hasFragment(7)) unlockMemoryFragment(7);
  }

  // Achievement-based (eventName = "achievement" with id passed via totalClicks? no - use direct calls)
  if (eventName === "achievement") {
    if (!hasFragment(4)) unlockMemoryFragment(4);
    if (!hasFragment(8)) {
      // Will be triggered by loco_completo specifically
    }
  }

  if (eventName === "boost") {
    if (!hasFragment(6)) unlockMemoryFragment(6);
  }

  if (eventName === "roulette") {
    if (!hasFragment(5)) unlockMemoryFragment(5);
  }
}

function buildMemory() {
  var list = document.getElementById("memoryList");
  var progress = document.getElementById("memoryProgress");
  if (!list) return;

  list.innerHTML = "";
  if (progress) progress.textContent = unlockedFragments.length + " / 8";

  MEMORY_FRAGMENTS.forEach(function(frag) {
    var card = document.createElement("div");
    card.className = "memory-card " + (hasFragment(frag.id) ? "unlocked" : "locked");

    var num = document.createElement("div");
    num.className = "memory-card-num";
    num.textContent = "#" + frag.id;
    card.appendChild(num);

    var icon = document.createElement("div");
    icon.className = "memory-card-icon";
    icon.textContent = hasFragment(frag.id) ? frag.icon : "🔒";
    card.appendChild(icon);

    var text = document.createElement("div");
    text.className = "memory-card-text";
    text.textContent = hasFragment(frag.id) ? frag.text : "???";
    card.appendChild(text);

    if (!hasFragment(frag.id)) {
      var req = document.createElement("div");
      req.className = "memory-card-req";
      req.textContent = frag.req;
      card.appendChild(req);
    }

    card.addEventListener("click", function() {
      if (hasFragment(frag.id)) {
        showMemoryFragment(frag.id);
      } else {
        showToast(frag.req, "info");
      }
    });

    list.appendChild(card);
  });
}

function isMemoryOpen() {
  var p = document.getElementById("memoryPanel");
  return p && p.classList.contains("open");
}

function openMemory() {
  var p = document.getElementById("memoryPanel");
  if (!p) return;
  p.classList.add("open");
  buildMemory();
}

function closeMemory() {
  var p = document.getElementById("memoryPanel");
  if (!p) return;
  p.classList.remove("open");
}

function openInfo() {
  var p = document.getElementById("infoPanel");
  if (!p) return;
  p.classList.add("open");
}

function closeInfo() {
  var p = document.getElementById("infoPanel");
  if (!p) return;
  p.classList.remove("open");
}

function buildCollectiblesPanel() {
  var content = document.getElementById("collectiblesPanelContent");
  if (!content) return;
  content.innerHTML = "";
  var tiers = [
    { key: "comun", label: "COMÚN" },
    { key: "raro", label: "RARO" },
    { key: "legendario", label: "LEGENDARIO" }
  ];
  tiers.forEach(function(tier) {
    var header = document.createElement("div");
    header.className = "collectibles-tier-header tier-" + tier.key;
    header.textContent = tier.label;
    content.appendChild(header);

    var grid = document.createElement("div");
    grid.className = "collectibles-grid";
    COLLECTIBLES.filter(function(c) { return c.tier === tier.key; }).forEach(function(c) {
      var card = document.createElement("div");
      var count = getCollectCount(c.id);
      var owned = count > 0;
      card.className = "collectible-card tier-" + c.tier + (owned ? " owned" : " locked");
      if (tier.key === "legendario" && owned) card.classList.add("gold-glow");

      var imgWrap = document.createElement("div");
      imgWrap.className = "collectible-card-img-wrap";
      var img = document.createElement("img");
      img.src = c.src;
      img.alt = c.name;
      img.className = "collectible-card-img";
      img.onerror = function() { this.style.background = "rgba(255,80,80,0.2)"; };
      imgWrap.appendChild(img);
      if (!owned) {
        var lock = document.createElement("div");
        lock.className = "collectible-card-lock";
        lock.textContent = "🔒";
        imgWrap.appendChild(lock);
      }
      card.appendChild(imgWrap);

      var name = document.createElement("div");
      name.className = "collectible-card-name";
      name.textContent = owned ? c.name : "???";
      card.appendChild(name);

      var countEl = document.createElement("div");
      countEl.className = "collectible-card-count";
      countEl.textContent = owned ? "x" + count : "—";
      card.appendChild(countEl);

      grid.appendChild(card);
    });
    content.appendChild(grid);
  });
}

function openCollectibles() {
  var p = document.getElementById("collectiblesPanel");
  if (!p) return;
  buildCollectiblesPanel();
  p.classList.add("open");
}

function closeCollectibles() {
  var p = document.getElementById("collectiblesPanel");
  if (!p) return;
  p.classList.remove("open");
}

function getWeaponBought(id) { return (arsenal[id] && arsenal[id].bought) || 0; }
function getWeaponUsed(id) { return (arsenal[id] && arsenal[id].used) || 0; }
function saveArsenal() { safeJSON_set("chaosArsenal", arsenal); }
function refreshArsenal() { arsenal = safeJSON("chaosArsenal", {}); }

function buyWeapon(id) {
  var w = WEAPONS.find(function(x) { return x.id === id; });
  if (!w) return;
  if (coins < w.price) return;
  coins -= w.price;
  try { localStorage.setItem("chaosCoins", String(coins)); } catch (e) {}
  var cn = document.getElementById("coinNumber");
  if (cn) cn.textContent = coins;
  if (!arsenal[id]) arsenal[id] = { bought: 0, used: 0 };
  arsenal[id].bought += 1;
  saveArsenal();
  buildArsenalPanel();
}

function buildArsenalPanel() {
  var content = document.getElementById("arsenalPanelContent");
  if (!content) return;
  content.innerHTML = "";
  var tiers = [{ key: "comun", label: "COMÚN" }, { key: "mitico", label: "MÍTICO" }];
  tiers.forEach(function(tier) {
    var header = document.createElement("div");
    header.className = "collectibles-tier-header tier-" + tier.key;
    header.textContent = tier.label;
    content.appendChild(header);
    var grid = document.createElement("div");
    grid.className = "collectibles-grid";
    WEAPONS.filter(function(w) { return w.tier === tier.key; }).forEach(function(w) {
      var bought = getWeaponBought(w.id);
      var used = getWeaponUsed(w.id);
      var owned = bought > 0;
      var card = document.createElement("div");
      card.className = "collectible-card tier-" + w.tier + (owned ? " owned" : " locked");
      if (tier.key === "mitico" && owned) card.classList.add("gold-glow");
      var imgWrap = document.createElement("div");
      imgWrap.className = "collectible-card-img-wrap";
      var img = document.createElement("img");
      img.src = w.src; img.alt = w.name; img.className = "collectible-card-img";
      img.onerror = function() { this.style.background = "rgba(255,80,80,0.2)"; };
      imgWrap.appendChild(img);
      if (!owned) {
        var lock = document.createElement("div");
        lock.className = "collectible-card-lock";
        lock.textContent = "🔒";
        imgWrap.appendChild(lock);
      }
      card.appendChild(imgWrap);
      var name = document.createElement("div");
      name.className = "collectible-card-name";
      name.textContent = owned ? w.name : "???";
      card.appendChild(name);
      var counts = document.createElement("div");
      counts.className = "collectible-card-count";
      counts.textContent = owned ? (bought + " comprada, " + used + " usada") : "—";
      card.appendChild(counts);
      var buy = document.createElement("button");
      buy.className = "weapon-buy-btn";
      buy.textContent = "Comprar (" + w.price + " 🪙)";
      buy.disabled = coins < w.price;
      buy.addEventListener("click", function(e) { e.stopPropagation(); buyWeapon(w.id); });
      card.appendChild(buy);
      var desc = document.createElement("div");
      desc.className = "weapon-desc";
      desc.textContent = w.desc;
      card.appendChild(desc);
      grid.appendChild(card);
    });
    content.appendChild(grid);
  });
}

function openArsenal() {
  var p = document.getElementById("arsenalPanel");
  if (!p) return;
  refreshArsenal();
  buildArsenalPanel();
  p.classList.add("open");
}

function closeArsenal() {
  var p = document.getElementById("arsenalPanel");
  if (p) p.classList.remove("open");
}

function openStats() {
  var p = document.getElementById("statsPanel");
  if (!p) return;
  document.getElementById("statClicks").textContent = String(totalClicks);
  document.getElementById("statCoinsCurrent").textContent = String(coins);
  document.getElementById("statCoinsTotal").textContent = String(totalCoinsEarned);
  document.getElementById("statBoosts").textContent = String(boostActivationsCount);
  document.getElementById("statHundred").textContent = String(chaosReachedHundredCount);
  document.getElementById("statAchievements").textContent = achievementsUnlocked.length + " / " + (typeof ACHIEVEMENTS !== "undefined" ? ACHIEVEMENTS.length : 25);
  var hasTrueEnding = unlockedFragments.indexOf(8) !== -1;
  var teEl = document.getElementById("statTrueEnding");
  var teRow = document.getElementById("statTrueEndingRow");
  if (hasTrueEnding) {
    teEl.textContent = "SÍ";
    teRow.classList.add("stat-done");
    teRow.classList.remove("stat-pending");
  } else {
    teEl.textContent = "NO";
    teRow.classList.add("stat-pending");
    teRow.classList.remove("stat-done");
  }
  p.classList.add("open");
}

function closeStats() {
  var p = document.getElementById("statsPanel");
  if (!p) return;
  p.classList.remove("open");
}

// Initialize menu state and wire up close button
updateMemoryMenuState();
var memoryPanelClose = document.getElementById("memoryPanelClose");
if (memoryPanelClose) {
  memoryPanelClose.addEventListener("click", function() { closeMemory(); });
}
var memoryFragmentClose = document.getElementById("memoryFragmentClose");
if (memoryFragmentClose) {
  memoryFragmentClose.addEventListener("click", function() { closeMemoryFragment(); });
}
var memoryFinalCloseBtn = document.getElementById("memoryFinalClose");
if (memoryFinalCloseBtn) {
  memoryFinalCloseBtn.addEventListener("click", function() { closeMemoryFinal(); });
}
var infoPanelCloseBtn = document.getElementById("infoPanelClose");
if (infoPanelCloseBtn) {
  infoPanelCloseBtn.addEventListener("click", function() { closeInfo(); });
}
var statsPanelCloseBtn = document.getElementById("statsPanelClose");
if (statsPanelCloseBtn) {
  statsPanelCloseBtn.addEventListener("click", function() { closeStats(); });
}
var collectiblesPanelCloseBtn = document.getElementById("collectiblesPanelClose");
if (collectiblesPanelCloseBtn) {
  collectiblesPanelCloseBtn.addEventListener("click", function() { closeCollectibles(); });
var arsenalPanelCloseBtn = document.getElementById("arsenalPanelClose");
if (arsenalPanelCloseBtn) arsenalPanelCloseBtn.addEventListener("click", closeArsenal);
}
// Click backdrop to close fragment overlay
var memoryFragmentEl = document.getElementById("memoryFragment");
if (memoryFragmentEl) {
  memoryFragmentEl.addEventListener("click", function(e) {
    if (e.target === memoryFragmentEl) closeMemoryFragment();
  });
}
var memoryFinalEl = document.getElementById("memoryFinal");
if (memoryFinalEl) {
  memoryFinalEl.addEventListener("click", function(e) {
    if (e.target === memoryFinalEl) closeMemoryFinal();
  });
}

/* ========================= */
/* HAMBURGER MENU             */
/* ========================= */

var menuPanel = document.getElementById("menuPanel");
var menuBackdrop = document.getElementById("menuBackdrop");
var menuToggle = document.getElementById("menuToggle");
var menuClose = document.getElementById("menuClose");
var menuSoundToggle = document.getElementById("menuSoundToggle");
var menuSoundState = document.getElementById("menuSoundState");
var menuStats = document.getElementById("menuStats");
var menuOpen = false;
var menuCategory = null;

function isMenuOpen() { return menuOpen; }

function openMenu() {
  if (menuOpen) return;
  menuOpen = true;
  menuCategory = null;
  menuPanel.classList.add("open");
  menuBackdrop.classList.add("show");
  menuToggle.setAttribute("aria-expanded", "true");

  renderMenu();
  staggerMenu();

  updateMenuSoundState();
  updateMenuStats();
}

function staggerMenu() {
  var items = menuPanel.querySelectorAll(".menu-item");
  items.forEach(function(item) { item.classList.remove("show"); });
  items.forEach(function(item, i) {
    setTimeout(function() { item.classList.add("show"); }, 50 + i * 50);
  });
}

function renderMenu() {
  var list = document.getElementById("menuList");
  var sub = document.getElementById("menuSubList");
  if (!list || !sub) return;

  if (menuCategory) {
    // Mostrar subcategorías de la categoría activa
    list.querySelectorAll(".menu-item[data-section]").forEach(function(el){ el.style.display = "none"; });
    list.querySelectorAll(".menu-item.menu-category").forEach(function(el){ el.style.display = "none"; });

    var items = [];
    if (menuCategory === "tienda") {
      items = [
        { section: "shop", icon: "⚡", label: "TIENDA" },
        { section: "arsenal", icon: "⚔️", label: "ARSENAL" },
        { section: "roulette", icon: "🎰", label: "RULETA" }
      ];
    } else if (menuCategory === "progreso") {
      items = [
        { section: "achievements", icon: "🏆", label: "LOGROS" },
        { section: "collection", icon: "📦", label: "COLECCION" },
        { section: "memory", icon: "🕯️", label: "MEMORIA" },
        { section: "stats", icon: "📊", label: "STATS" },
        { section: "unlocked", icon: "📋", label: "HECHOS" }
      ];
    }

    sub.innerHTML = "";
    var back = document.createElement("button");
    back.className = "menu-item menu-back show";
    back.setAttribute("aria-label", "Volver al menú principal");
    back.innerHTML = '<span class="menu-icon">←</span><span class="menu-label">VOLVER</span>';
    back.addEventListener("click", function(e) {
      e.stopPropagation();
      menuCategory = null;
      renderMenu();
      staggerMenu();
    });
    sub.appendChild(back);

    items.forEach(function(it) {
      var b = document.createElement("button");
      b.className = "menu-item show";
      b.setAttribute("data-section", it.section);
      b.innerHTML = '<span class="menu-icon">' + it.icon + '</span><span class="menu-label">' + it.label + '</span>';
      b.addEventListener("click", function(e) {
        e.stopPropagation();
        navigateToSection(it.section);
      });
      sub.appendChild(b);
    });
  } else {
    // Menú principal
    list.querySelectorAll(".menu-item[data-section]").forEach(function(el){ el.style.display = ""; });
    list.querySelectorAll(".menu-item.menu-category").forEach(function(el){ el.style.display = ""; });
    sub.innerHTML = "";
  }
}

function closeMenu() {
  if (!menuOpen) return;
  menuOpen = false;
  menuCategory = null;
  menuPanel.classList.remove("open");
  menuBackdrop.classList.remove("show");
  menuToggle.setAttribute("aria-expanded", "false");
}

function toggleMenu() {
  if (menuOpen) closeMenu();
  else openMenu();
}

function updateMenuStats() {
  var clicksText = formatNumber(typeof totalClicks !== "undefined" ? totalClicks : 0);
  var coinsText = formatNumber(typeof coins !== "undefined" ? coins : 0);
  if (menuStats) menuStats.textContent = clicksText + " CLICKS · " + coinsText + " 🪙";
}

function updateMenuSoundState() {
  if (menuSoundState) menuSoundState.textContent = soundEnabled ? "ON" : "OFF";
}

// Map data-section to actual action
function navigateToSection(section) {
  var tiendaSections = ["shop", "arsenal", "roulette"];
  var progresoSections = ["achievements", "collection", "memory", "stats", "unlocked"];

  if (tiendaSections.indexOf(section) !== -1 || progresoSections.indexOf(section) !== -1) {
    // Si ya estamos dentro de la categoría, abrir la sección y cerrar menú
    if (menuCategory) {
      closeMenu();
    } else {
      // Abrir la categoría correspondiente y mostrar sus subcategorías
      if (tiendaSections.indexOf(section) !== -1) {
        menuCategory = "tienda";
      } else {
        menuCategory = "progreso";
      }
      renderMenu();
      staggerMenu();
    }
    return;
  }

  closeMenu();
  switch (section) {
    case "shop":
      if (typeof openShop === "function") openShop();
      break;
    case "roulette":
      if (typeof openRoulette === "function") openRoulette();
      break;
    case "daily-rewards":
      if (typeof openDailyRewards === "function") openDailyRewards();
      break;
    case "unlocked":
      sidebarOpen = !sidebarOpen;
      if (sidebarOpen) {
        unlockedPanel.classList.add("open");
      } else {
        unlockedPanel.classList.remove("open");
      }
      break;
    case "achievements":
      achievementsOpen = !achievementsOpen;
      if (achievementsOpen) {
        achievementsPanel.classList.add("open");
        if (typeof buildAchievements === "function") buildAchievements();
      } else {
        achievementsPanel.classList.remove("open");
      }
      break;
    case "collection":
      if (typeof openCollectibles === "function") openCollectibles();
      break;
    case "profile":
      // Pulse the profile bar to indicate it's interactive
      var profileBar = document.getElementById("profileBar");
      if (profileBar) {
        profileBar.classList.remove("pulse-attention");
        void profileBar.offsetWidth;
        profileBar.classList.add("pulse-attention");
      }
      break;
    case "memory":
      if (typeof openMemory === "function") openMemory();
      break;
    case "info":
      if (typeof openInfo === "function") openInfo();
      break;
    case "arsenal":
      if (typeof openArsenal === "function") openArsenal();
      break;
    case "stats":
      if (typeof openStats === "function") openStats();
      break;
  }
}

// Wire up menu items
if (menuToggle) {
  menuToggle.addEventListener("click", function(e) {
    e.stopPropagation();
    toggleMenu();
  });
}

if (menuClose) {
  menuClose.addEventListener("click", function(e) {
    e.stopPropagation();
    closeMenu();
  });
}

if (menuBackdrop) {
  menuBackdrop.addEventListener("click", function() {
    closeMenu();
  });
}

document.querySelectorAll(".menu-item[data-section]").forEach(function(item) {
  item.addEventListener("click", function() {
    var section = item.getAttribute("data-section");
    navigateToSection(section);
  });
});

if (menuSoundToggle) {
  menuSoundToggle.addEventListener("click", function() {
    if (typeof soundEnabled !== "undefined") {
      soundEnabled = !soundEnabled;
      try { localStorage.setItem("chaosSoundEnabled", JSON.stringify(soundEnabled)); } catch (e) {}
      if (typeof renderSoundToggle === "function") renderSoundToggle();
      updateMenuSoundState();
    }
  });
}

// Update menu stats periodically (when sound toggle changes coins)
setInterval(function() {
  if (menuOpen) updateMenuStats();
}, 1000);

/* ========================= */
/* DEBUG HELPERS (console) — gated by ?debug=1 or window.DEBUG_MODE */
/* ========================= */

var CHAOS_DEBUG_ENABLED = (typeof window !== "undefined") &&
  (window.DEBUG_MODE === true ||
   (window.location && /[?&]debug=1\b/.test(window.location.search)) ||
   (window.location && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")));

if (CHAOS_DEBUG_ENABLED) {

window.__chaosDebug = {
  spawnGato: function() { if (typeof spawnCollectibleById === "function") spawnCollectibleById("gato"); else console.warn("spawnCollectibleById not available"); },
  spawnSardina: function() { if (typeof spawnCollectibleById === "function") spawnCollectibleById("sardina"); },
  spawnSandwich: function() { if (typeof spawnCollectibleById === "function") spawnCollectibleById("sandwich"); },
  spawnC: function() { if (typeof spawnCollectibleById === "function") spawnCollectibleById("c"); },
  spawnRefresco: function() { if (typeof spawnCollectibleById === "function") spawnCollectibleById("refresco"); },
  spawnHonguito: function() { if (typeof spawnCollectibleById === "function") spawnCollectibleById("honguito"); },
  spawnAmongus: function() { if (typeof spawnCollectibleById === "function") spawnCollectibleById("amongus"); },
  spawnPizzaGuy: function() { if (typeof spawnCollectibleById === "function") spawnCollectibleById("pizzaguy"); },
  clearCollectible: function() { if (activeCollectible && activeCollectible.el && activeCollectible.el.parentNode) activeCollectible.el.parentNode.removeChild(activeCollectible.el); activeCollectible = null; console.log("✓ collectible cleared"); },
  getCollection: function() { console.log(JSON.stringify(collectedCounts, null, 2)); },
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
    localStorage.setItem("chaosRouletteSpins", String(n));
    localStorage.removeItem("chaosRouletteTotalSpins");
    rouletteTotalSpins = n;
    rouletteSpinsCount = n;
    if (typeof checkAchievements === "function") checkAchievements();
    console.log("✓ rouletteTotalSpins = " + n);
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
      "  __chaosDebug.giveFacts()            - Unlock all facts\n" +
      "  __chaosDebug.spawnGato()            - Spawn Gato\n" +
      "  __chaosDebug.spawnSardina()         - Spawn Sardina\n" +
      "  __chaosDebug.spawnSandwich()        - Spawn Sandwich\n" +
      "  __chaosDebug.spawnC()               - Spawn La C\n" +
      "  __chaosDebug.spawnRefresco()        - Spawn Refresco\n" +
      "  __chaosDebug.spawnHonguito()        - Spawn Honguito\n" +
      "  __chaosDebug.spawnAmongus()         - Spawn Among Us\n" +
      "  __chaosDebug.spawnPizzaGuy()        - Spawn Pizza Guy\n" +
      "  __chaosDebug.getCollection()        - Show collected counts\n" +
      "  __chaosDebug.giveAll()              - EVERYTHING (max stats + all items)\n" +
      "  __chaosDebug.reset()                - Clear all localStorage and reload\n" +
      "  __chaosDebug.help()                 - Show this help"
    );
  }
};

console.log("💡 Debug commands available: type __chaosDebug.help()");

} // end if CHAOS_DEBUG_ENABLED

document.addEventListener("chaosBossEnd", function() {
  if (typeof resetEverything === "function") resetEverything();
  if (typeof checkAchievements === "function") checkAchievements();
  if (typeof checkAcumulador === "function") checkAcumulador();
});

/* ============================================
   DAILY REWARDS — Sistema de recompensas diarias
   ============================================
   - Ciclo de 7 días que se reinicia si el jugador pasa más de 1 día sin ingresar.
   - El día 1 es siempre reclamable al primer ingreso del ciclo.
   - Días 2-7 se desbloquean conforme avanzan los días UTC.
   - Racha (streak) se mide por ingreso consecutivo; bestStreak se guarda aparte.
   - Logros racha_3 y racha_7 se otorgan en checkAchievements().
*/

var DAILY_REWARDS = [
  { day: 1, type: "coins",     amount: 20,  icon: "🪙",  name: "20 monedas de bienvenida" },
  { day: 2, type: "coins",     amount: 50,  icon: "🪙",  name: "50 monedas" },
  { day: 3, type: "pro-theme",          icon: "🎨",  name: "Un tema PRO al azar" },
  { day: 4, type: "clicks",     amount: 5000, icon: "👆", name: "+5,000 clicks" },
  { day: 5, type: "picture",   file: "assets/images/deal-with-it.png", icon: "😎", name: "Foto de perfil exclusiva (Deal With It)" },
  { day: 6, type: "combo",     coins: 75,  icon: "🪙",  name: "75 monedas" },
  { day: 7, type: "mega",      icon: "🏆", name: "Foto exclusiva (Noob), 3 T-Rex gratis y 100 monedas", coins: 100, picture: "assets/images/noob.png" }
];

var dailyState = safeJSON("chaosDailyState", null);
if (!dailyState || typeof dailyState !== "object") {
  dailyState = { claimedDays: [], currentDay: 1, streak: 0, bestStreak: 0, lastLoginDay: null };
} else {
  if (!Array.isArray(dailyState.claimedDays)) dailyState.claimedDays = [];
  if (typeof dailyState.currentDay !== "number") dailyState.currentDay = 1;
  if (typeof dailyState.streak !== "number") dailyState.streak = 0;
  if (typeof dailyState.bestStreak !== "number") dailyState.bestStreak = 0;
}

function getUTCDayKey() {
  var d = new Date();
  var y = d.getUTCFullYear();
  var m = String(d.getUTCMonth() + 1);
  if (m.length < 2) m = "0" + m;
  var day = String(d.getUTCDate());
  if (day.length < 2) day = "0" + day;
  return y + "-" + m + "-" + day;
}

function diffDaysUTC(a, b) {
  if (!a) return Infinity;
  var da = new Date(a + "T00:00:00Z").getTime();
  var db = new Date(b + "T00:00:00Z").getTime();
  return Math.round((db - da) / 86400000);
}

function persistDailyState() {
  safeJSON_set("chaosDailyState", dailyState);
}

function rolloverDailyCycleOnLogin() {
  var today = getUTCDayKey();
  var last = dailyState.lastLoginDay;
  if (!last) {
    // Primer login: arranca el ciclo en día 1
    dailyState.streak = 1;
    dailyState.currentDay = 1;
    dailyState.claimedDays = [];
  } else {
    var diff = diffDaysUTC(last, today);
    if (diff === 0) {
      // Mismo día: no pasa nada
    } else {
      // Pasó al menos 1 día
      if (diff === 1) {
        // Día consecutivo: racha +1, el día anterior se salta si no se reclamó
        dailyState.streak += 1;
        if (!isDailyRewardClaimed(dailyState.currentDay)) {
          dailyState.claimedDays.push(dailyState.currentDay);
        }
        dailyState.currentDay += 1;
        if (dailyState.currentDay > 7) {
          dailyState.currentDay -= 7;
          dailyState.claimedDays = [];
        }
      } else {
        // Se pasó más de un día sin login: se rompe la racha, reinicia ciclo
        dailyState.streak = 1;
        dailyState.claimedDays = [];
        dailyState.currentDay = 1;
      }
      if (dailyState.streak > dailyState.bestStreak) {
        dailyState.bestStreak = dailyState.streak;
      }
    }
  }
  dailyState.lastLoginDay = today;
  persistDailyState();
}

// Inicializa el ciclo al cargar la página
rolloverDailyCycleOnLogin();

function pickRandomProTheme() {
  // PRO tier (tier 2) excluding rewardOnly (fire, BOSS SLAYER) — listamos void/gold/blood
  var pool = ["void", "gold", "blood"];
  return pool[Math.floor(Math.random() * pool.length)];
}

function grantDailyReward(reward) {
  switch (reward.type) {
    case "coins":
      coins += reward.amount;
      totalCoinsEarned = (typeof totalCoinsEarned === "number" ? totalCoinsEarned : 0) + reward.amount;
      try { localStorage.setItem("chaosCoins", String(coins)); } catch (e) {}
      safeNumber_set("chaosTotalCoinsEarned", totalCoinsEarned);
      break;
    case "combo":
      coins += reward.coins;
      totalCoinsEarned = (typeof totalCoinsEarned === "number" ? totalCoinsEarned : 0) + reward.coins;
      try { localStorage.setItem("chaosCoins", String(coins)); } catch (e) {}
      safeNumber_set("chaosTotalCoinsEarned", totalCoinsEarned);
      break;
    case "clicks":
      totalClicks += reward.amount;
      try { localStorage.setItem("totalClicks", String(totalClicks)); } catch (e) {}
      break;
    case "picture":
      if (inventory.pictures.indexOf(reward.file) === -1) {
        inventory.pictures.push(reward.file);
        safeJSON_set("chaosInventory", inventory);
      }
      break;
    case "pro-theme":
      var t = pickRandomProTheme();
      if (ownedThemes.indexOf(t) === -1) {
        ownedThemes.push(t);
        safeJSON_set("chaosOwnedThemes", ownedThemes);
      }
      return { type: "pro-theme", themeKey: t };
    case "mega": {
      var coinsToAdd = reward.coins || 0;
      coins += coinsToAdd;
      totalCoinsEarned = (typeof totalCoinsEarned === "number" ? totalCoinsEarned : 0) + coinsToAdd;
      try { localStorage.setItem("chaosCoins", String(coins)); } catch (e) {}
      safeNumber_set("chaosTotalCoinsEarned", totalCoinsEarned);
      if (reward.picture && inventory.pictures.indexOf(reward.picture) === -1) {
        inventory.pictures.push(reward.picture);
        safeJSON_set("chaosInventory", inventory);
      }
      // 3 T-Rex gratis al arsenal (stock)
      if (!arsenal.trex) arsenal.trex = { bought: 0, used: 0 };
      arsenal.trex.bought = (arsenal.trex.bought || 0) + 3;
      saveArsenal();
      return { type: "mega" };
    }
  }
}

function safeNumber_set(key, value) {
  // Mirror of safeNumber's persistence pattern for writeable integer counters
  try { localStorage.setItem(key, String(value)); } catch (e) {}
}

function isDailyRewardClaimed(day) {
  return dailyState.claimedDays.indexOf(day) !== -1;
}

function isCycleComplete() {
  // Ciclo actual = las 7 recompensas reclamadas (currentDay puede ser 7 o menos)
  if (dailyState.claimedDays.length < 7) return false;
  for (var i = 1; i <= 7; i++) {
    if (!isDailyRewardClaimed(i)) return false;
  }
  return true;
}

function claimDailyReward(day) {
  if (isDailyRewardClaimed(day)) return false;
  if (day !== dailyState.currentDay) return false;
  var reward = DAILY_REWARDS[day - 1];
  if (!reward) return false;
  var extra = grantDailyReward(reward);
  dailyState.claimedDays.push(day);
  persistDailyState();
  // Refresh UI
  if (typeof coinNumberEl !== "undefined" && coinNumberEl) {
    coinNumberEl.textContent = formatNumber(coins);
  }
  if (typeof coinDisplayEl !== "undefined" && coinDisplayEl) {
    coinDisplayEl.classList.remove("tick");
    void coinDisplayEl.offsetWidth;
    coinDisplayEl.classList.add("tick");
  }
  var msg;
  if (reward.type === "pro-theme" && extra && extra.themeKey) {
    var th = SHOP_THEMES.filter(function(t){ return t.key === extra.themeKey; })[0];
    msg = "¡Tema PRO desbloqueado: " + (th ? th.name : extra.themeKey.toUpperCase()) + "!";
  } else if (reward.type === "mega") {
    msg = "¡DÍA 7! Noob + 3 T-Rex + 100 🪙";
  } else if (reward.type === "coins") {
    msg = "¡+" + reward.amount + " 🪙!";
  } else if (reward.type === "clicks") {
    msg = "¡+" + reward.amount.toLocaleString() + " clicks!";
  } else if (reward.type === "picture") {
    msg = "¡Foto exclusiva desbloqueada!";
  } else if (reward.type === "combo") {
    msg = "¡+" + reward.coins + " 🪙!";
  } else {
    msg = "¡Recompensa reclamada!";
  }
  showToast(msg, "success");
  if (typeof checkAchievements === "function") checkAchievements();
  updateDailyRewardsMenuBadge();
  buildDailyRewardsPanel();
  return true;
}

function buildDailyRewardsPanel() {
  var grid = document.getElementById("dailyRewardsGrid");
  var info = document.getElementById("dailyRewardsStreakInfo");
  if (!grid) return;
  grid.innerHTML = "";
  if (info) {
    info.textContent = "Racha actual: " + dailyState.streak + " día(s) · Récord: " + dailyState.bestStreak + " día(s)";
  }
  if (isCycleComplete()) {
    grid.classList.add("cycle-complete");
    var done = document.createElement("div");
    done.className = "daily-cycle-complete";
    done.innerHTML =
      '<div class="daily-cycle-complete-emoji">🏆</div>' +
      '<div class="daily-cycle-complete-title">¡Ya reclamaste todas las recompensas!</div>' +
      '<div class="daily-cycle-complete-sub">Volvé mañana para un nuevo ciclo.</div>';
    grid.appendChild(done);
    return;
  }
  grid.classList.remove("cycle-complete");
  DAILY_REWARDS.forEach(function(r) {
    var card = document.createElement("div");
    card.className = "daily-reward-card";
    if (r.day === 7) card.classList.add("full-width", "final");
    var claimed = isDailyRewardClaimed(r.day);
    var isCurrent = (r.day === dailyState.currentDay);
    if (claimed) card.classList.add("claimed");
    else if (!isCurrent) card.classList.add("locked");
    if (isCurrent && !claimed) card.classList.add("current");

    var dayLabel = document.createElement("div");
    dayLabel.className = "daily-reward-day";
    dayLabel.textContent = "DÍA " + r.day;
    card.appendChild(dayLabel);

    var iconWrap = document.createElement("div");
    iconWrap.className = "daily-reward-icon-wrap";
    var iconEl;
    if (r.type === "picture") {
      iconEl = document.createElement("img");
      iconEl.className = "daily-reward-icon";
      iconEl.src = r.file;
      iconEl.alt = r.name;
      iconEl.onerror = function() {
        iconEl.style.display = "none";
        var fallback = document.createElement("div");
        fallback.className = "daily-reward-icon emoji";
        fallback.textContent = r.icon;
        iconWrap.appendChild(fallback);
      };
    } else if (r.type === "mega") {
      iconEl = document.createElement("img");
      iconEl.className = "daily-reward-icon";
      iconEl.src = r.picture;
      iconEl.alt = r.name;
      iconEl.onerror = function() {
        iconEl.style.display = "none";
        var fallback = document.createElement("div");
        fallback.className = "daily-reward-icon emoji";
        fallback.textContent = r.icon;
        iconWrap.appendChild(fallback);
      };
    } else {
      iconEl = document.createElement("div");
      iconEl.className = "daily-reward-icon emoji";
      iconEl.textContent = r.icon;
    }
    iconWrap.appendChild(iconEl);
    card.appendChild(iconWrap);

    var nameEl = document.createElement("div");
    nameEl.className = "daily-reward-name";
    nameEl.textContent = r.name;
    card.appendChild(nameEl);

    var btn = document.createElement("button");
    btn.className = "daily-reward-claim";
    if (claimed) {
      btn.textContent = "RECLAMADO";
      btn.disabled = true;
    } else if (isCurrent) {
      if (r.day === 7) {
        btn.textContent = "RECLAMAR";
        btn.classList.add("gold");
        btn.onclick = function() { claimDailyReward(r.day); };
      } else {
        btn.textContent = "RECLAMAR";
        btn.classList.add("green");
        btn.onclick = function() { claimDailyReward(r.day); };
      }
    } else {
      btn.textContent = "BLOQUEADO";
      btn.disabled = true;
    }
    card.appendChild(btn);
    grid.appendChild(card);
  });
}

function openDailyRewards() {
  rolloverDailyCycleOnLogin();
  var p = document.getElementById("dailyRewardsPanel");
  if (!p) return;
  buildDailyRewardsPanel();
  p.classList.add("open");
}

function closeDailyRewards() {
  var p = document.getElementById("dailyRewardsPanel");
  if (p) p.classList.remove("open");
}

function updateDailyRewardsMenuBadge() {
  var badge = document.getElementById("menuDailyRewardsState");
  if (!badge) return;
  if (dailyState.currentDay <= 7 && !isDailyRewardClaimed(dailyState.currentDay)) {
    badge.textContent = "D" + dailyState.currentDay;
  } else {
    badge.textContent = "";
  }
}

updateDailyRewardsMenuBadge();

var dailyRewardsClose = document.getElementById("dailyRewardsPanelClose");
if (dailyRewardsClose) {
  dailyRewardsClose.addEventListener("click", closeDailyRewards);
}

var _dailyAutoOpenedThisSession = false;
function autoOpenDailyRewardsIfNeeded() {
  if (_dailyAutoOpenedThisSession) return;
  // Auto-abrir si hay una recompensa pendiente (día actual no reclamada) o si el ciclo está completo
  var hasPending = dailyState.currentDay >= 1 && dailyState.currentDay <= 7 && !isDailyRewardClaimed(dailyState.currentDay);
  var cycleDone = isCycleComplete();
  if (hasPending || cycleDone) {
    _dailyAutoOpenedThisSession = true;
    openDailyRewards();
  }
}
// Llamar después de un pequeño delay para que la UI principal termine de inicializar
setTimeout(autoOpenDailyRewardsIfNeeded, 600);

// Re-evaluar cada minuto para refrescar el ciclo si cambia el día UTC
var _lastSeenDay = getUTCDayKey();
setInterval(function() {
  var today = getUTCDayKey();
  if (today !== _lastSeenDay) {
    _lastSeenDay = today;
    // Resetear el flag para que el auto-open se dispare si hay nueva recompensa
    _dailyAutoOpenedThisSession = false;
    rolloverDailyCycleOnLogin();
    updateDailyRewardsMenuBadge();
    autoOpenDailyRewardsIfNeeded();
  }
}, 60000);

})();

