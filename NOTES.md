# Notes

Project conventions, decisions, and lessons learned. Updated as we work.

---

## Architecture

Chaos Button is a **vanilla HTML/CSS/JS** project with no build process.
Everything is served as-is from GitHub Pages. This is intentional — the
project is a self-contained game, not a framework that benefits from
bundling or transpilation.

```
index.html        — single page, all UI
styles.css        — single stylesheet, organized by section
app.js            — single script, organized by feature
manifest.json     — PWA metadata
sw.js             — service worker (cache-first strategy)
assets/
  images/         — shop items, roulette prizes, coin events
  videos/         — unlockable videos at 100% chaos
  sounds/         — sound effects and music
  fonts/          — custom fonts for typography
  icons/          — PWA install icons
```

## Code conventions

### JavaScript
- Use `var` (project is ES5-style, no transpilation)
- Two-space indentation
- Double quotes for strings
- Functions declared at file scope, not nested
- DOM lookups cached in module-level variables when reused
- localStorage keys prefixed with `chaos` (e.g. `chaosCoins`, `chaosFacts`)

### CSS
- Two-space indentation
- Mobile-first responsive: base styles + media queries for smaller screens
- Media query breakpoints used: `max-width: 480px`, `max-width: 600px`,
  `max-width: 768px`
- ID selectors for unique elements (e.g. `#shopPanel`)
- Class selectors for reusable patterns (e.g. `.achievement-card`)
- Avoid `!important` unless overriding a more specific rule

### HTML
- Two-space indentation
- All interactive elements are `<button>` or have `role="button"`
- Accessibility: every button has `aria-label`, toggles have
  `aria-expanded` and `aria-controls`

---

## Decisions

### Why vanilla JS instead of a framework?
- Project scope doesn't justify React/Vue overhead
- Faster to iterate on visual changes
- No build step means GitHub Pages serves directly with no surprises
- Easier for the user to inspect/modify the code

### Why localStorage instead of IndexedDB?
- Data is small (~50KB total)
- Synchronous API is fine for the use case
- localStorage works in all browsers without polyfills

### Why no build process?
- No transpilation needed (ES5-compatible JS)
- No CSS preprocessing needed
- No module bundling needed (single file)
- GitHub Pages serves static files directly

### Why PWA instead of native app?
- No app store review process
- Single codebase for web + installable
- Free hosting via GitHub Pages
- User can install without leaving browser

---

## Lessons learned

### Don't trust analysis without visual verification
During the initial mobile bug hunt, I read CSS and reasoned about the
cascade without seeing actual renders. The fixes I applied to
`max-width: 480px` were correct in theory but missed the actual bug:
the user was on a desktop browser window resized to ~700px, which hits
the `max-width: 768px` breakpoint, not 480px.

**Takeaway:** when the user reports a visual bug, ask for a screenshot
first. Don't assume the viewport.

### Responsive fixes belong in the broadest applicable breakpoint
The mobile bugs (shop leaking, toggles hidden) needed fixes in
`max-width: 768px`, not just `max-width: 480px`. A user with a phone
in landscape, a tablet in portrait, or a resized desktop window all
hit the 768px breakpoint. Putting fixes only in 480px excluded those
cases.

**Takeaway:** when fixing responsive bugs, find the widest breakpoint
where the bug appears and put the fix there.

### Architecture for hide/show panels
Closed panels with `position: fixed` + `transform: translateX(-100%)`
will leak pixels (border, shadow, backdrop-filter) at the edge of the
viewport. Adding `visibility: hidden` with a delay (so it doesn't
break the slide animation) is the reliable way to fully hide them.

**Pattern:**
```css
.panel {
  position: fixed;
  transform: translateX(-100%);
  transition: transform 0.3s, visibility 0s 0.3s;
  visibility: hidden;
}
.panel.open {
  transform: translateX(0);
  visibility: visible;
  transition: transform 0.3s, visibility 0s 0s;
}
```

---

## Workflow

For each feature work goes like:
1. User requests feature
2. AI proposes options / asks clarifying questions
3. User picks approach
4. AI writes a plan document (see `plan-*.md` if created)
5. User reviews and approves
6. AI implements
7. AI shows diff or screenshots
8. User tests in real environment
9. AI commits only after user confirms it works
10. AI pushes to remote

**Never commit code the user hasn't seen working.**

---

## File checklist for new features

When adding a feature, ensure:
- [ ] Plan documented (or described in commit message)
- [ ] Responsive tested at 390px, 768px, 1280px
- [ ] Accessibility: aria-labels, keyboard navigation, Escape closes
- [ ] localStorage keys use `chaos` prefix
- [ ] No hardcoded colors that should be in CSS variables
- [ ] Commit message explains WHY, not just WHAT
- [ ] PWA service worker cache list updated if assets added
