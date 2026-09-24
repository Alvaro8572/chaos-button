# Changelog

All notable changes to Chaos Button are documented here. The format is
based on [Keep a Changelog](https://keepachangelog.com/) and this project
adheres to [Semantic Versioning](https://semver.org/).

---

## [Unreleased]

### Added
- PWA support: installable on Android, works offline (iOS Safari installable via Share menu)
- Custom themes (in shop) — 8 palettes at 10 coins each

### Changed
- Moved responsive fixes from `max-width: 480px` to `max-width: 768px` so
  they apply to all mobile-like viewports (small window, tablet portrait, etc)

### Fixed
- Mobile responsive bugs: shop panel, profile bar, fact panel, toggles
- Achievements panel layout on mobile (was centered with transform)
- Memory leaks in audio and glitch style injection
- Accessibility: aria-labels, aria-expanded, :focus-visible, Escape key handler

---

## [5.0.0] - 2026-09-12

### Added
- Achievements system (25 achievements across bronze/silver/gold tiers)
- Roulette with 5 collectible prizes
- Boost system with charge/cooldown/active states
- Profile bar with editable name and equippable photo/font/slogan/frame
- Shop with pictures, fonts, slogans, secret items, and frames
- Mobile responsive design (first iteration)

---

## [4.0.0] - 2026-08-29

### Added
- Particles system (ambient + burst)
- Random events (earthquake, explosion, invasion, virus, portal, glitch)
- Sound system with sound pool and cooldown
- Local storage persistence
- Video unlock system (3 videos at 100% chaos)
- Facts system (unlockable science facts)

---

## [3.0.0] - 2026-07-15

### Added
- Chaos meter with progress bar
- Click counter with milestones
- Coin system
- Coin events (falling cat, sardine, coin button)

---

## [2.0.0] - 2026-06-10

### Added
- Title glitch effects
- Quote system that rotates per click
- Font randomization on click

---

## [1.0.0] - 2026-05-01

### Added
- Initial release: clickable chaos button with RGB gradient animation
- Particle canvas
- Vignette overlay
