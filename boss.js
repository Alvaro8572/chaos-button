/* ============================================
   Chaos Button — Boss Fight
   ============================================
   Separate page that takes over when chaos reaches 100%.
   Player has 25 seconds to deal enough damage to defeat the boss.
   Each kill scales HP by +25. */

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

  var TIME_LIMIT = 25;
  var REWARD_COINS = 50;
  var SLAYER_THRESHOLD = 5;
  var SLAYER_REWARD_COINS = 100;

  var bossLevel = parseInt(new URLSearchParams(window.location.search).get("level"), 10) || 1;
  if (bossLevel < 1) bossLevel = 1;
  if (bossLevel > BOSS_STAGES.length) bossLevel = BOSS_STAGES.length;

  var currentStage = BOSS_STAGES[bossLevel - 1];
  var bossHp = currentStage.hp;
  var timeLeft = TIME_LIMIT;
  var totalClicks = 0;
  var fightActive = false;
  var returnUrl = "index.html?v=20";

  var $name = document.getElementById("bossName");
  var $timer = document.getElementById("bossTimer");
  var $hpFill = document.getElementById("bossHpFill");
  var $hpText = document.getElementById("bossHpText");
  var $btn = document.getElementById("bossAttackBtn");
  var $btnText = document.getElementById("bossAttackText");
  var $msg = document.getElementById("bossMessage");
  var $imgWrap = document.getElementById("bossImageWrap");
  var $imgOverlay = document.getElementById("bossImageOverlay");
  var $audio = document.getElementById("bossMusic");

  function formatNum(n) {
    if (n < 1000) return String(n);
    if (n < 1000000) return (n / 1000).toFixed(n < 10000 ? 1 : 0) + "K";
    return (n / 1000000).toFixed(1) + "M";
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
    updateHpBar();
    showMessage("");

    if ($audio) {
      var idx = Math.floor(Math.random() * MUSIC_FILES.length);
      $audio.src = MUSIC_FILES[idx];
      var p = $audio.play();
      if (p && p.catch) p.catch(function() {});
    }
  }

  function bossHit() {
    if (!fightActive) return;
    totalClicks++;
    bossHp--;
    flashBoss();
    updateHpBar();
    if (navigator.vibrate) navigator.vibrate(15);

    if (bossHp <= 0) {
      winFight();
    }
  }

  function winFight() {
    fightActive = false;
    if (timerInterval) clearInterval(timerInterval);
    if ($audio) { $audio.pause(); $audio.currentTime = 0; }

    var newKills = (parseInt(localStorage.getItem("chaosBossKills"), 10) || 0) + 1;
    localStorage.setItem("chaosBossKills", String(newKills));

    var currentCoins = parseInt(localStorage.getItem("chaosCoins"), 10) || 0;
    localStorage.setItem("chaosCoins", String(currentCoins + REWARD_COINS));

    showMessage("¡VICTORIA! +" + REWARD_COINS + " 🪙", "#00ff88");

    var unlocked = false;
    if (newKills >= SLAYER_THRESHOLD) {
      unlocked = tryUnlockBossSlayer();
    }

    $imgWrap.classList.add("boss-defeated");

    setTimeout(function() {
      localStorage.setItem("chaosPendingReset", "1");
      window.location.href = returnUrl + (unlocked ? "&justUnlockedBossSlayer=1" : "");
    }, 2200);
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

  function loseFight() {
    fightActive = false;
    if (timerInterval) clearInterval(timerInterval);
    if ($audio) { $audio.pause(); $audio.currentTime = 0; }

    showMessage("DERROTA", "#ff3333");
    $imgWrap.classList.add("boss-victor");

    setTimeout(function() {
      localStorage.setItem("chaosPendingReset", "1");
      window.location.href = returnUrl;
    }, 1800);
  }

  var timerInterval = null;

  function startTimer() {
    timerInterval = setInterval(function() {
      timeLeft--;
      $timer.textContent = timeLeft;
      if (timeLeft <= 10) {
        $timer.style.color = "#ff3333";
      } else if (timeLeft <= 15) {
        $timer.style.color = "#ffcc00";
      }
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        loseFight();
      }
    }, 1000);
  }

  function goBackToMenu() {
    if ($audio) { $audio.pause(); $audio.currentTime = 0; }
    window.location.href = returnUrl;
  }

  if ($btn) {
    $btn.addEventListener("click", bossHit);
    $btn.addEventListener("touchstart", function(e) { e.preventDefault(); bossHit(); }, { passive: false });
  }
  document.addEventListener("keydown", function(e) {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      bossHit();
    }
    if (e.key === "Escape") {
      goBackToMenu();
    }
  });

  startFight();
  startTimer();
})();
