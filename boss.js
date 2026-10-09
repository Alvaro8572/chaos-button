/* ============================================
   Chaos Button — Boss Fight (in-page overlay module)
   ============================================
   Loaded by index.html. The boss UI lives in #bossArena on the
   same page (no separate tab, no navigation). startBossArena(level)
   shows the arena and starts the fight; closeBossArena() hides it
   and dispatches a "chaosBossEnd" event so app.js can reset the meter. */

(function() {
  "use strict";

  var BOSS_STAGES = [
    { level: 1, hp: 50 },
    { level: 2, hp: 75 },
    { level: 3, hp: 100 },
    { level: 4, hp: 125 },
    { level: 5, hp: 150 },
    { level: 6, hp: 175 },
    { level: 7, hp: 200 },
    { level: 8, hp: 225 },
    { level: 9, hp: 250 },
    { level: 10, hp: 275 }
  ];

  var MUSIC_FILES = [
    "assets/music-boss-1.mp3",
    "assets/music-boss-2.mp3",
    "assets/music-boss-3.mp3"
  ];
  var BOSS_MUSIC_VOLUME = 0.5;
  var TIME_LIMIT = 25;
  var REWARD_COINS = 50;
  var SLAYER_THRESHOLD = 5;
  var SLAYER_REWARD_COINS = 100;

  var $name, $timer, $hpFill, $hpText, $btn, $btnText, $msg, $imgWrap, $imgOverlay, $audio, $arena;
  var bossLevel = 1;
  var currentStage;
  var bossHp, timeLeft, totalClicks;
  var fightActive = false;
  var timerInterval = null;
  var bossMusicFade = null;

  function fadeBossMusic(target, ms, onDone) {
    if (!$audio) { if (onDone) onDone(); return; }
    if (bossMusicFade) clearInterval(bossMusicFade);
    var start = $audio.volume;
    var t0 = Date.now();
    bossMusicFade = setInterval(function() {
      var k = Math.min(1, (Date.now() - t0) / ms);
      $audio.volume = start + (target - start) * k;
      if (k >= 1) {
        clearInterval(bossMusicFade);
        bossMusicFade = null;
        if (onDone) onDone();
      }
    }, 40);
  }

  function updateHpBar() {
    var pct = Math.max(0, (bossHp / currentStage.hp) * 100);
    $hpFill.style.width = pct + "%";
    $hpText.textContent = bossHp + " / " + currentStage.hp;
    if (bossHp <= currentStage.hp * 0.3) {
      $hpFill.style.background = "linear-gradient(90deg, #ff0000, #ff8800)";
    } else if (bossHp <= currentStage.hp * 0.6) {
      $hpFill.style.background = "linear-gradient(90deg, #ff8800, #ffcc00)";
    }
  }

  function showMessage(text, color) {
    $msg.textContent = text;
    $msg.style.color = color || "#fff";
    $msg.style.textShadow = "0 0 12px " + (color || "#fff") + ", 0 0 24px " + (color || "#fff");
  }

  function flashBoss() {
    $imgWrap.classList.remove("boss-hit");
    void $imgWrap.offsetWidth;
    $imgWrap.classList.add("boss-hit");
  }

  function startFight() {
    fightActive = true;
    $name.textContent = "BOSS #" + bossLevel;
    $timer.textContent = timeLeft;
    $timer.style.color = "#fff";
    updateHpBar();
    showMessage("");

    if ($audio) {
      var idx = Math.floor(Math.random() * MUSIC_FILES.length);
      $audio.src = MUSIC_FILES[idx];
      $audio.volume = 0;
      var p = $audio.play();
      if (p && p.catch) p.catch(function() {});
      fadeBossMusic(BOSS_MUSIC_VOLUME, 800);
    }
  }

  function bossHit() {
    if (!fightActive) return;
    totalClicks++;
    bossHp--;
    flashBoss();
    updateHpBar();
    if (navigator.vibrate) navigator.vibrate(15);
    if (bossHp <= 0) winFight();
  }

  function tryUnlockBossSlayer() {
    var achievements = [];
    try {
      achievements = JSON.parse(localStorage.getItem("chaosAchievements") || "[]");
    } catch (e) { achievements = []; }
    if (achievements.indexOf("boss_slayer") !== -1) return false;
    achievements.push("boss_slayer");
    localStorage.setItem("chaosAchievements", JSON.stringify(achievements));

    var inventory = { pictures: [], fonts: [], accessories: [], slogans: [], frames: [], collectibles: [] };
    try {
      inventory = JSON.parse(localStorage.getItem("chaosInventory") || "null") || inventory;
    } catch (e) {}
    if (!inventory.pictures) inventory.pictures = [];
    if (inventory.pictures.indexOf("assets/boss.jpg") === -1) {
      inventory.pictures.push("assets/boss.jpg");
    }
    if (!inventory.frames) inventory.frames = [];
    localStorage.setItem("chaosInventory", JSON.stringify(inventory));

    var equipped = { picture: null, font: null, accessory: null, slogan: null, frame: null };
    try {
      equipped = JSON.parse(localStorage.getItem("chaosEquipped") || "null") || equipped;
    } catch (e) {}
    if (!equipped.picture) equipped.picture = null;
    localStorage.setItem("chaosEquipped", JSON.stringify(equipped));

    var currentCoins = parseInt(localStorage.getItem("chaosCoins"), 10) || 0;
    localStorage.setItem("chaosCoins", String(currentCoins + SLAYER_REWARD_COINS));
    localStorage.setItem("chaosUnlockedBossSlayer", "1");
    return true;
  }

  function winFight() {
    fightActive = false;
    if (timerInterval) clearInterval(timerInterval);
    if ($audio) {
      fadeBossMusic(0, 400, function() {
        $audio.pause();
        $audio.currentTime = 0;
        $audio.volume = BOSS_MUSIC_VOLUME;
      });
    }
    var newKills = (parseInt(localStorage.getItem("chaosBossKills"), 10) || 0) + 1;
    localStorage.setItem("chaosBossKills", String(newKills));
    var currentCoins = parseInt(localStorage.getItem("chaosCoins"), 10) || 0;
    localStorage.setItem("chaosCoins", String(currentCoins + REWARD_COINS));
    showMessage("¡VICTORIA! +" + REWARD_COINS + " 🪙", "#00ff88");
    var unlocked = false;
    if (newKills >= SLAYER_THRESHOLD) unlocked = tryUnlockBossSlayer();
    $imgWrap.classList.add("boss-defeated");
    setTimeout(function() { closeBossArena(unlocked ? "boss_slayer" : "win"); }, 2200);
  }

  function loseFight() {
    fightActive = false;
    if (timerInterval) clearInterval(timerInterval);
    if ($audio) {
      fadeBossMusic(0, 400, function() {
        $audio.pause();
        $audio.currentTime = 0;
        $audio.volume = BOSS_MUSIC_VOLUME;
      });
    }
    showMessage("DERROTA", "#ff3333");
    $imgWrap.classList.add("boss-victor");
    setTimeout(function() { closeBossArena("lose"); }, 1800);
  }

  function startTimer() {
    timerInterval = setInterval(function() {
      timeLeft--;
      $timer.textContent = timeLeft;
      if (timeLeft <= 10) $timer.style.color = "#ff3333";
      else if (timeLeft <= 15) $timer.style.color = "#ffcc00";
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        loseFight();
      }
    }, 1000);
  }

  function wireButtons() {
    if ($btn) {
      $btn.addEventListener("click", bossHit);
      $btn.addEventListener("touchstart", function(e) { e.preventDefault(); bossHit(); }, { passive: false });
    }
  }

  window.startBossArena = function(level) {
    bossLevel = parseInt(level, 10) || 1;
    if (bossLevel < 1) bossLevel = 1;
    if (bossLevel > BOSS_STAGES.length) bossLevel = BOSS_STAGES.length;
    currentStage = BOSS_STAGES[bossLevel - 1];
    bossHp = currentStage.hp;
    timeLeft = TIME_LIMIT;
    totalClicks = 0;
    $imgWrap.classList.remove("boss-defeated", "boss-victor");
    $arena.style.display = "block";
    document.body.style.overflow = "hidden";
    startFight();
    startTimer();
  };

  window.closeBossArena = function(outcome) {
    fightActive = false;
    if (timerInterval) clearInterval(timerInterval);
    if ($audio) { $audio.pause(); $audio.currentTime = 0; }
    $arena.style.display = "none";
    document.body.style.overflow = "";
    try {
      document.dispatchEvent(new CustomEvent("chaosBossEnd", { detail: { outcome: outcome || "" } }));
    } catch (e) {}
  };

  function init() {
    $arena = document.getElementById("bossArena");
    $name = document.getElementById("bossName");
    $timer = document.getElementById("bossTimer");
    $hpFill = document.getElementById("bossHpFill");
    $hpText = document.getElementById("bossHpText");
    $btn = document.getElementById("bossAttackBtn");
    $btnText = document.getElementById("bossAttackText");
    $msg = document.getElementById("bossMessage");
    $imgWrap = document.getElementById("bossImageWrap");
    $imgOverlay = document.getElementById("bossImageOverlay");
    $audio = document.getElementById("bossMusic");
    if (!$arena) return;
    wireButtons();
    document.addEventListener("keydown", function(e) {
      if (!$arena || $arena.style.display === "none") return;
      if (e.key === " " || e.key === "Enter") { e.preventDefault(); bossHit(); }
      if (e.key === "Escape") { e.preventDefault(); closeBossArena("escape"); }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
