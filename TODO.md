# TODO

Pending features and improvements for Chaos Button. Organized by priority.

---

## High Priority

- [ ] **Memory Fragments** — narrative system that unlocks story fragments
      based on player actions (clicks, purchases, achievements)
- [ ] **Hamburger menu** — consolidate all 5+ toggle buttons into one slide-in
      panel. Mobile-friendly, scales with new features
- [ ] **Stats card for sharing** — generate shareable image with player stats
      (canvas-rendered)
- [ ] **CSS variables refactor** — replace hardcoded colors with `var(--*)` so
      themes can be added cleanly. Required for custom themes feature

## Medium Priority

- [ ] **Reflejos del caos** — reflex minigame every 1000 clicks (tap a
      disappearing target in 0.8s for bonus multiplier)
- [ ] **Daily challenge** — daily objective with unique reward
- [ ] **Sound packs** — replace default sounds with themed packs
- [ ] **Decide on untracked assets** in `assets/` (Gumball.jpg, big-mac.jpg,
      darwin.jpg, etc) — commit them, delete, or wire into shop

## Low Priority

- [ ] **Refactor JS into modules** — split `app.js` (3400+ lines) into
      separate files (shop.js, achievements.js, etc). Requires build
      process or careful script ordering
- [ ] **GitHub Actions CI/CD** — auto-deploy on push to main
- [ ] **Custom domain** — purchase domain and configure
- [ ] **Privacy-friendly analytics** — Plausible or Umami
- [ ] **E2E tests** — Playwright tests for critical user flows
- [ ] **Stats persistence across resets** — preserve historical clicks

## Won't Do (decided)

- **TypeScript** — over-engineering for vanilla HTML/CSS/JS project
- **Build process (Vite, esbuild)** — unnecessary complexity for current scope
- **Modular JS architecture** — premature, current scope doesn't justify it

---

## Bug Backlog (from earlier bug hunt, low priority)

- `app.js` line 1402: `"por Nª vez"` reads weird for N=1 (should say
  "por primera vez"). Cosmetic.
- `app.js` quotes have missing accents: "logica", "se esta", "relampago".
  Stylistic choice, kept as-is for tone.
- `assets/Rat�n_gamer.jpg` filename has encoding corruption. Renaming
  would break references — left as-is.
- `app.js` line 1340: `"Caos level: N"` duplicates a quote in `QUOTES`
  array. Cosmetic, low priority.
