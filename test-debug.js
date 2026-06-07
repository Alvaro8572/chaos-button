const { JSDOM } = require("jsdom");
const fs = require("fs");
const html = fs.readFileSync("index.html", "utf8");

// Preload REAL data that user would have had
const modified = html.replace("<script>", `<script>
(function() {
  var s = window.localStorage;
  // Real user data - videos and boosts and inventory
  s.setItem("chaosVideos", JSON.stringify([
    { name: "Avioncito", file: "Avioncito.mp4" },
    { name: "Tesla", file: "Tesla.mp4" }
  ]));
  s.setItem("chaosBoostActivationsCount", "5");
  s.setItem("chaosBoostMilestone5", "1");
  s.setItem("chaosBoostCharge", "0");
  s.setItem("chaosBoostActiveUntil", "0");
  s.setItem("chaosBoostCooldownUntil", "0");
  s.setItem("chaosCoins", "200");
  s.setItem("chaosInventory", JSON.stringify({
    pictures: [],
    fonts: [],
    accessories: [],
    slogans: [],
    frames: [],
    collectibles: []
  }));
  s.setItem("chaosEquipped", JSON.stringify({
    picture: null,
    font: null,
    accessory: null,
    slogan: null,
    frame: null
  }));
})();
`);

const dom = new JSDOM(modified, {
  runScripts: "dangerously",
  pretendToBeVisual: true,
  url: "http://localhost/"
});

const win = dom.window;
const doc = win.document;

var runtimeErrors = [];
win.addEventListener("error", function(e) {
  runtimeErrors.push(e.error && e.error.message);
});

setTimeout(function() {
  console.log("=== RUNTIME CHECK ===");
  console.log("Runtime errors:", runtimeErrors.length ? runtimeErrors : "none");

  // Check 1: collectionList exists
  console.log("\n[1] collectionList exists:", !!doc.getElementById("collectionList"));

  // Check 2: toggleCollection works
  doc.getElementById("toggleCollection").click();
  setTimeout(function() {
    var panel = doc.getElementById("collectionPanel");
    console.log("[2] collection panel open:", panel.classList.contains("open"));

    var list = doc.getElementById("collectionList");
    var kids = list.children;
    console.log("[3] collection children count:", kids.length);
    for (var i = 0; i < kids.length; i++) {
      console.log("    child", i, ":", kids[i].tagName, kids[i].className.split(' ')[0], "-", kids[i].textContent.trim().substring(0, 40));
    }

    doc.getElementById("collectionClose").click();
  }, 150);

  // Check 4: boostBarPercent element
  setTimeout(function() {
    var bp = doc.getElementById("boostBarPercent");
    console.log("\n[4] boostBarPercent exists:", !!bp);
    console.log("    boostBarPercent text:", bp && bp.textContent);
    console.log("    boostBar exists:", !!doc.getElementById("boostBar"));
    console.log("    boostCounterNumber exists:", !!doc.getElementById("boostCounterNumber"));
    console.log("    boostCounterNumber text:", doc.getElementById("boostCounterNumber").textContent);
  }, 200);

  // Check 5: shop with preloaded boosts
  setTimeout(function() {
    doc.getElementById("toggleShop").click();
    setTimeout(function() {
      var shopList = doc.getElementById("shopList");
      var txt = shopList.textContent;
      console.log("\n[5] shop text length:", txt.length);
      console.log("    contains SECRETOS:", txt.indexOf("SECRETOS") >= 0);
      console.log("    contains Mouse:", txt.indexOf("Mouse") >= 0);
      console.log("    contains Jesús:", txt.indexOf("Jes") >= 0);
      console.log("    last 300 chars:", txt.substring(txt.length - 300));

      // Check all child elements of shopList
      var shopKids = shopList.children;
      console.log("    shop children count:", shopKids.length);
      for (var i = 0; i < shopKids.length; i++) {
        var c = shopKids[i];
        console.log("    shop child", i, ":", c.className, "-", c.textContent.trim().substring(0, 30));
      }

      process.exit(0);
    }, 200);
  }, 300);
}, 800);