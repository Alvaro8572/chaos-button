# CHAOS ENGINE v5 — Mechanics Reference

> Single-file web application. All logic lives in `index.html`.
> Pure HTML + CSS + Vanilla JS (IIFE wrapped, `"use strict"`).
> No build step, no dependencies. Open in any modern browser.

---

## 1. Overview

A button that escalates visual/audio chaos the more you click it. At 100% the bar triggers a video unlock roll. Hidden facts (40 total) unlock progressively. Random events fire on a percentage of clicks. A persistent collection system stores unlocked facts, videos and the "Intelectual" badge.

**File:** `index.html` (~66 KB, 2162 lines)
**Architecture:** Single IIFE in `<script>`, single `<style>` block, all markup inline.

---

## 2. Core State Machine

```js
var clicks          = 0;           // total click counter (never resets the click count, only chaosLevel)
var chaosLevel      = 0;           // 0..100, derived from clicks
var isResetting     = false;       // 500ms lockout flag
var lastFontIndex   = -1;          // to avoid picking same font twice
var shownFacts      = [];          // recently-shown facts (resets when full)
var lastFactTime    = 0;           // for fact cooldown
var intelBadgeUnlocked = boolean;  // persisted to localStorage
var sidebarOpen     = false;       // facts panel toggle
var collectionOpen  = false;       // video collection toggle
var lastSoundIndex  = -1;          // random sound no-repeat
var lastSoundTime   = 0;           // random sound cooldown
var soundPool       = [];          // currently-playing sounds for cleanup
var unlockedFacts   = [];          // persisted
var unlockedVideos  = [];          // persisted
```

### Reset
`resetEverything()`:
- Resets `clicks = 0`, `chaosLevel = 0`, `lastFontIndex = -1`, `burstParticles = []`
- Clears all `body.style.cssText` then re-applies the dark background
- Sets `isResetting = true` for 500ms (blocks new `chaos()` calls)

---

## 3. Click System

Two triggers, both call `playClickSound()` + `chaos()`:

| Trigger | Key | Plays click sound? |
|---|---|---|
| Mouse click on `#chaosBtn` | click event | Yes |
| Keyboard | `Enter` or `Space` | Yes |

`chaos()` is guarded by `if (isResetting) return;` to debounce during resets.

---

## 4. Chaos Meter

`chaosLevel = Math.min(clicks, 100)` — a soft cap at 100.

The bar updates via `updateChaosMeter()`:
```js
chaosBar.style.width = chaosLevel + "%";
chaosLevelSpan.textContent = chaosLevel + "%";
```

### 100% behavior
- `triggerVideoUnlock()` is called (see Video System)
- Function `return`s early — no further effects fire this click

### Random early reset
- Only fires when `chaosLevel > 80` with `3%` chance per click
- Schedules `setTimeout(resetEverything, 1000)`
- Replaces the old `chaosLevel > 50, 8%` rule that made reaching 100 statistically impossible (0.92^50 ≈ 1.6%)

---

## 5. Per-Click Effects (`chaos()` function)

Each click triggers the following pipeline:

1. **`clicks++` → `chaosLevel = min(clicks, 100)` → `updateChaosMeter()`**
2. **Title color** — random HSL(100, 60)
3. **Button glow** — border + box-shadow with the title color
4. **Background**:
   - `chaosLevel < 50`: solid HSL(80, 12)
   - `chaosLevel >= 50`: linear-gradient with random angle, two random HSL(90, 15)
5. **Font change** — `changeFont()` picks a random entry from `FONTS[]`, never repeats the previous one
6. **Quote** — `QUOTES[random]` shown in `#log`, or `"Caos level: " + clicks` every 5th click
7. **Title glitch** — `.glitching` class re-applied (forces animation restart)
8. **Burst particles** — 8 particles spawned at the button center
9. **Random screen effect** — weighted roll:
   - 25% — `screen-shake` (CSS keyframe, 0.4s)
   - 20% — `chromatic-aberration` on title (CSS keyframe, 0.6s)
   - 15% — `body.transform = rotate(...)` proportional to `chaosLevel/50`
   - 15% — `body.filter = hue-rotate(0-360deg)`
   - 25% — `body.letterSpacing` proportional to `chaosLevel/50`
10. **Random event** — 15% chance → `triggerRandomEvent()` + `glowIntelBadge()`
11. **Random sound** — 20% chance → `playRandomSound()` (+ glow if intel unlocked)
12. **Chaos symbol** — 40% chance → `spawnChaosSymbol()`
13. **Fact unlock** — only if `chaosLevel >= 5` and `Math.random() < chaosLevel/80`
14. **100% trigger** — see Video System
15. **Random reset** — see Reset

### Continuous background cleanup
`setInterval(400ms)` clears `transform`, `filter`, `letterSpacing` of body when not resetting — so the chaotic effects don't get stuck.

### Ambient symbols
`setInterval(3000ms)` has a 40% chance to spawn a `chaos-symbol` if `chaosLevel > 0`.

---

## 6. Font Rotation (14 fonts)

Each click picks a random font for the title, never the same as the previous one.

```js
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
  "'Smooch Sans', cursive",
  "'Tilt Prism', cursive",
  "'UnifrakturMaguntia', cursive",
];
```

---

## 7. Particle System

Two particle types, both on the same `<canvas id="particles-canvas">`:

### Ambient particles
- **40** particles max (`AMBIENT_COUNT`)
- Float in random directions, speed `2 + random*4 + chaosLevel*0.1`
- Reset to random edge when leaving screen
- Drawn as small circles with HSL color

### Burst particles (`BurstParticle` class)
- Spawned on click (8 per click) and during some events
- Launched with random angle + speed from the spawn point
- Drawn as small filled rectangles

### Event-driven bursts
- **Explosion** event: 50 burst particles from screen center
- **Supernova** event: 80 burst particles from screen center

---

## 8. Random Events (13 total)

All defined in `EVENTS[]` array. `triggerRandomEvent()` does a weighted random pick based on `chance` field. Total chance sums to ~1.0.

| # | Event | Chance | Duration | Visual |
|---|---|---|---|---|
| 1 | **Terremoto** | 0.12 | 600ms | Body shake via CSS keyframe `earthquakeShake` (translate + rotate) |
| 2 | **Explosion** | 0.12 | 1200ms | Radial white/yellow flash + 3 expanding shockwave rings (staggered 100ms) + 50 burst particles |
| 3 | **Invasion** | 0.09 | 1600ms | 14 neon symbols with `invasionPop` animation (scale, rotate 720°, fall) + HSL glow |
| 4 | **Virus** | 0.08 | 800ms | `virusPulse` keyframe (filter invert + hue-rotate + saturate, 8 steps) + green scanline overlay |
| 5 | **Portal** | 0.07 | 1200ms | Conic-gradient vortex + 3 expanding rings (staggered 200ms, random HSL colors) |
| 6 | **GlitchTotal** | 0.09 | 600ms | 3 colored clip-path slices with RGB-channel split effect + body skew |
| 7 | **Lluvia** | 0.08 | 1.5-2.1s | 50 raindrops staggered 30ms each, with 40% chance of splash ellipse on landing |
| 8 | **Strobe** | 0.07 | 840ms | 12 body background flashes (white/dark) at 70ms interval |
| 9 | **Matrix** | 0.08 | 1.5-3s | Katakana + binary rain columns (25px wide) staggered 40ms each, char fade animation |
| 10 | **Hackerman** | 0.06 | 2500ms | Black overlay with green terminal text typing line-by-line (200ms stagger) + scanlines + blinking cursor |
| 11 | **Supernova** | 0.06 | 1200ms | White screen flash + 4 expanding wave rings (staggered 150ms, white→yellow→orange→red) + 80 burst particles + heavy body shake with scale |
| 12 | **Confetti** | 0.08 | 2-4s | 80 colored paper pieces falling with 3D rotation animation, mixed rectangle/circle shapes |
| 13 | **Aurora** | 0.05 | 4000ms | Two `mix-blend-mode: screen` gradient layers sweeping across the screen (calm/atmospheric) |

### CSS strategy
All animations are pre-defined in the `<style>` block (no inline `<style>` creation per fire). Events apply classes to `document.body` or create disposable `<div>` elements with cleanup `setTimeout` for removal.

---

## 9. Economy System (Fase 1)

### Currency
- Variable `coins` in `localStorage.chaosCoins`
- **No coins per click.** Coins come ONLY from:
  - Random coin button event (3s window, 1 click = 1 coin) — primary source
  - Falling cat clicked (+5)
  - Sardine clicked (+5)
  - Boost bar full (+50)

### UI
- Top of screen, inline with click counter
- CSS-drawn gold coin (radial gradient + `$` symbol) + number
- `formatNumber()` reused for K/M display

### Coin popup animation
- `+N` floats up from the source position
- Color by source:
  - `.coin-popup.normal` — white (random button)
  - `.coin-popup.event` — gold (cat/sardine)
  - `.coin-popup.boost` — red (boost)
- `.coin-popup.big` — 18px font (for amounts ≥ 5)
- Animation `coinPopupFloat` (1s, ease-out, fade + float up -90px)

### Sound
- `coin-collect.mp3` plays on every coin gain (volume 0.3)
- Graceful no-op if file doesn't exist (try/catch)

---

## 10. Facts System (40 facts)

### Categories (in order, 8/10/8/8/6):
- **ESPACIO** (8) — Space
- **ANIMALES** (10) — Animals
- **CEREBRO** (8) — Brain
- **NATURALEZA** (8) — Nature
- **DIGITAL** (6) — Digital/memes

Full list in `FACTS[]` array.

### Unlock mechanics
- Only fires when `chaosLevel >= 5`
- Chance per click: `chaosLevel / 80` (so 5% at 5%, 25% at 20%, 50% at 40%, 100% at 80+)
- Cooldown: `FACT_COOLDOWN = 5000ms` between facts
- Tracks `shownFacts[]` to avoid showing the same fact twice in a row (resets when all facts shown)

### Display
- `factPanel` (bottom-left) shows the fact for **10 seconds** with a `visible` class
- `unlockedPanel` (right side) shows the persistent list, with `addToSidebar()` adding items one by one
- `unlockedCount` shows `N / 40`

### Persistence
```js
localStorage.setItem("chaosFacts", JSON.stringify(unlockedFacts));
```

---

## 11. Sound System

### Click sound (always plays on every click)
- File: `mouse-click-sound.mp3`
- Volume: `0.5 + Math.random() * 0.4` (random between 0.5 and 0.9)
- `clickSound.currentTime = 0` reset on each play for snappy response
- `preload = "auto"` + `readyState < 2` check + `load()` fallback

### Random sound pool (7 sounds)
```js
var SOUNDS = [
  "bruh.mp3",
  "ara-ara-sayonara.mp3",
  "galaxy-meme.mp3",
  "sad-violin-the-meme-one.mp3",
  "spongebob-fail.mp3",
  "cat-laugh-meme-1.mp3",
  "windows-xp-donteflon.mp3"
];
```

### Random sound rules
- **Cooldown:** `SOUND_COOLDOWN = 10000ms` (10s between random sounds)
- **No-repeat:** never plays the same sound twice in a row (`lastSoundIndex`)
- Each sound gets a fresh `Audio` instance added to `soundPool`, removed on `onended`
- Volume: 0.5
- `play().catch(function(){})` swallows autoplay-block errors
- **Click sound overrides everything** — plays regardless of cooldown or other sounds

---

## 12. Video System

### 3 Videos with weighted unlock
```js
var VIDEOS = [
  { file: "Avioncito.mp4",     name: "Avioncito",      prob: 0.50 },
  { file: "Tesla_bailando.mp4", name: "Tesla Bailando", prob: 0.25 },
  { file: "Gojo_bici.mp4",     name: "Gojo en Bici",   prob: 0.25 }
];
```

### Unlock flow (on 100% chaos)
`triggerVideoUnlock()`:
1. Roll `Math.random()` and pick video by cumulative probability
2. Check if already unlocked in `unlockedVideos[]`
3. **If new:**
   - Push to `unlockedVideos[]`
   - Save to `localStorage.chaosVideos`
   - Play fullscreen with `playVideoFullscreen(file, true)` — unmuted, has audio
4. **If already unlocked (REPETIDO):**
   - Show "REPETIDO" message for 3s
   - `setTimeout(resetEverything, 3000)`
5. **On video end:**
   - Hide overlay
   - `buildCollection()` to update sidebar
   - `resetEverything()` to start over

### `playVideoFullscreen(file, isNew)`
- Sets `overlayVideo.src = file`
- `overlayVideo.muted = false` (always has audio now)
- `videoOverlay.classList.add("show")` — fade-in overlay
- `overlayVideo.play().catch(function(){})` — explicit play call
- Sets `onended` based on `isNew`:
  - `isNew=true` → hide + build collection + reset everything
  - `isNew=false` → just hide (user clicked from collection)

### Collection Panel
- Toggle button: `#toggleCollection` (bottom-right, "COLECCION")
- Shows 3 slots in a grid
- Each slot: video thumbnail (looping muted preview on hover) + name
- Click a thumbnail → `playVideoFullscreen(file, false)` — replays with audio
- `collectionCount` shows `N / 3`
- X button closes the panel

### Persistence
```js
localStorage.setItem("chaosVideos", JSON.stringify(unlockedVideos));
```

---

## 13. Intellectual Badge ("INTELECTUAL")

### Unlock condition
Unlocks when `unlockedFacts.length >= FACTS.length - 1` (i.e., at 39 of 40 facts, because the 40th will trigger the check).

### Display
- `#intelBadge` (bottom-left)
- Contains: `Nikola-Albert.webp` image + "INTELECTUAL" title + subtitle
- Image filter: `grayscale(0.3)` normally, `grayscale(0)` on hover
- Slides in from below with `.show` class

### Persistence
```js
localStorage.setItem("intelBadge", "true");  // saved forever
// On page load:
var intelBadgeUnlocked = localStorage.getItem("intelBadge") === "true";
if (intelBadgeUnlocked) {
  document.getElementById("intelBadge").classList.add("show");
}
```

### Glow effect
- Triggered when events fire (`glowIntelBadge()` adds `.glow` class for 800ms)
- Triggered when random sounds play (only if already unlocked)
- Triggered when intel badge first appears (longer 1000ms glow after 600ms delay)

---

## 14. UI Components

| Component | ID | Position | Trigger |
|---|---|---|---|
| Title | `#title` | Center | Always visible |
| Chaos button | `#chaosBtn` | Center | Click/keyboard |
| Chaos meter | `.chaos-meter` | Top | Always visible |
| Log/status | `#log` | Below button | Updates per click |
| Toggle unlocked | `#toggleUnlocked` | Bottom-right | Opens facts panel |
| Unlocked panel | `#unlockedPanel` | Right side | Lists unlocked facts |
| Toggle collection | `#toggleCollection` | Bottom-right | Opens video collection |
| Collection panel | `#collectionPanel` | Bottom | Shows unlocked videos |
| Fact panel | `#factPanel` | Bottom-left | Shows current fact (10s) |
| Intel badge | `#intelBadge` | Bottom-left | After 39/40 facts |
| Video overlay | `#videoOverlay` | Fullscreen | On video unlock/click |
| Repetido msg | `#repetidoMsg` | Bottom-center | When re-rolling a video |
| Particles canvas | `#particles-canvas` | Fullscreen bg | Always animating |
| Vignette | `.vignette` | Fullscreen bg | Decorative dark edges |
| Credits | `.credits` | Bottom | "CHAOS ENGINE v5" |

---

## 15. Quotes (20 strings)

Shown in `#log` per click, randomized. Every 5th click shows `"Caos level: " + clicks` instead.

```js
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
```

---

## 16. LocalStorage Schema

| Key | Type | Description |
|---|---|---|
| `chaosFacts` | JSON array of strings | Unlocked facts |
| `chaosVideos` | JSON array of `{file, name}` | Unlocked videos |
| `intelBadge` | `"true"` (string) | Intellectual badge unlocked flag |

All loads are wrapped in `JSON.parse(localStorage.getItem(...) || "[]")` for safety.

---

## 17. Performance Notes

- All event CSS is pre-defined in the `<style>` block — events just toggle classes or spawn disposable `<div>` elements
- Disposable elements are removed via `setTimeout` after their animation finishes
- `void el.offsetWidth` trick used to force animation restart (no JS animation engines)
- Particle canvas uses `requestAnimationFrame` (driven by `setInterval` or RAF loop)
- `soundPool` array is trimmed on `onended` to avoid memory leaks
- Single IIFE wraps all code to avoid polluting global scope
- Google Fonts loaded via `<link>` in `<head>` — no font-loading race conditions

---

## 18. File Inventory

| File | Purpose |
|---|---|
| `index.html` | The entire app |
| `preview.html` | Earlier draft (ignored) |
| `preview2.html` | Earlier draft (ignored) |
| `Nikola-Albert.webp` | Intel badge image |
| `*.mp3` (8 files) | Click sound + 7 meme sounds |
| `*.mp4` (3 files) | Avioncito, Tesla, Gojo videos |

---

## 19. Browser Compatibility

- Modern Chrome/Edge/Firefox/Safari
- Uses: `mix-blend-mode`, `clip-path`, `backdrop-filter` (latter sparingly)
- ES5 syntax (`var`, function expressions) for max compatibility
- No transpilation, no polyfills
- LocalStorage required for full feature (graceful no-op if missing)

