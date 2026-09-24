# Chaos Button

Un juego web donde cada clic desata más caos. Desbloqueá hechos, comprá
items en la tienda, girás la ruleta y convertite en el máximo agente del
caos.

**[Jugar ahora](https://alvaro8572.github.io/chaos-button/)** · Funciona
offline como PWA en Android.

---

## Features

- **Clicker principal** — Cada clic suma puntos de caos y monedas
- **Sistema de boosts** — Carga una barra al clickear, activala para x2
  monedas por 10 segundos
- **Logros (25)** — Bronce, plata y oro. Cada uno con recompensas
- **Tienda** — Fotos de perfil, fuentes, frases, marcos (incluyendo items
  secretos desbloqueables con 5 boosts)
- **Ruleta** — 5 premios coleccionables, más 2 items de monedas
- **Colección** — Videos desbloqueables al llegar a 100% caos, collectibles
  de la ruleta
- **Perfil editable** — Nombre, foto, frase, marco
- **47 hechos** — Curiosidades de ciencia que se desbloquean jugando
- **Eventos aleatorios** — Terremoto, explosión, invasión, virus, portal,
  glitch y más
- **Partículas y efectos** — Canvas con partículas ambiente y burst
- **Responsive** — Funciona en mobile (iPhone/Android), tablet y desktop
- **PWA instalable** — Agregalo a tu home screen, jugá offline
- **Accesibilidad** — Navegación por teclado, screen readers, contraste WCAG AA

---

## Cómo se juega

1. Cliqueá el botón grande **DESENCADENAR** hasta llegar a 100% caos
2. A los 100%, se desbloquea un video y el ciclo se reinicia
3. Usá monedas para comprar items en la tienda
4. Cada 1000 clicks activás un boost (multiplicador x2 por 10 segundos)
5. Después de 5 boosts, se desbloquea la sección secreta de la tienda
6. Jugá suficiente para desbloquear la ruleta (necesitás 1500 clicks)
7. La ruleta puede darte la **bendición divina** (marco + frase secreta)
8. Completá todos los logros para el achievement final "Completista"

---

## Tech stack

- **HTML5 + CSS3 + JavaScript ES5** — vanilla, sin frameworks
- **PWA** — manifest.json + service worker para instalación y offline
- **Sin build process** — servís los archivos como están
- **Sin backend** — todo el estado se guarda en localStorage del navegador

### Por qué vanilla?

- El proyecto se beneficia de iteración visual rápida
- Cero overhead de build = deploy directo a GitHub Pages
- Código legible para cualquier dev que quiera forkear
- Performance excelente en mobile sin hydration cost

---

## Local development

### Opción 1: Servidor simple

```bash
# Con Python 3
python -m http.server 8000

# Con Node (si tenés npx)
npx serve

# Con PHP
php -S localhost:8000
```

Abrí `http://localhost:8000` en tu navegador.

### Opción 2: Abrir directamente

`index.html` funciona con `file://` pero el service worker **no**, así
que necesitas servidor local para probar PWA features.

### Requisitos

- Navegador moderno (Chrome 88+, Firefox 85+, Safari 14+)
- Para mobile testing: ngrok o similar para HTTPS (PWA requiere HTTPS
  excepto en localhost)

---

## File structure

```
chaos-button/
├── index.html              # Entry point
├── styles.css              # All styles (one file, organized by section)
├── app.js                  # All JS logic (one file, organized by feature)
├── manifest.json           # PWA metadata
├── sw.js                   # Service worker (cache strategy)
├── assets/
│   ├── images/             # Shop items, roulette prizes, coin events
│   ├── videos/             # Unlockable videos at 100% chaos
│   ├── sounds/             # Sound effects
│   ├── fonts/              # Custom fonts
│   └── icons/              # PWA install icons (192x192, 512x512)
├── CHANGELOG.md            # Version history
├── TODO.md                 # Pending features and known bugs
├── NOTES.md                # Architecture decisions and conventions
└── README.md               # This file
```

---

## Customization

### Cambiar la dificultad base

En `app.js` línea 1312:
```javascript
chaosLevel = Math.min(100, (clicks / 500) * 100);
```

Más alto el divisor (500) = más clicks necesarios para 100%.

### Cambiar el cooldown de boost

En `app.js` línea 2645:
```javascript
var BOOST_DURATION_MS = 10000;
var BOOST_COOLDOWN_MS = 30000;
```

### Agregar nuevos items a la tienda

En `app.js` modificá los arrays `SHOP_PICTURES`, `SHOP_FONTS`, `SHOP_SLOGANS`,
`SHOP_FRAMES`. Cada item necesita:
- File path al asset
- Precio
- Requisito (clicks o boosts)
- Nombre

### Modificar los hechos

En `app.js` línea 196, editá el array `FACTS`. Cada hecho es un string.

---

## Debug commands

Abrí DevTools y tipeá:

```javascript
__chaosDebug.help()         // ver todos los comandos
__chaosDebug.addClicks(5000)  // sumar 5000 clicks
__chaosDebug.addCoins(1000)   // sumar 1000 monedas
__chaosDebug.unlockAll()      // desbloquear todo
__chaosDebug.reset()          // resetear todo
```

---

## Deploy

El proyecto está deployado en GitHub Pages. Para redeploy:

1. Pusheá los cambios a `main`
2. GitHub Pages los sirve automáticamente en 1-2 minutos
3. Hard refresh en el browser (`Cmd+Shift+R` / `Ctrl+Shift+R`)

El service worker puede cachear archivos viejos. Para forzar el update:
- DevTools → Application → Service Workers → "Unregister" → refresh
- O cambiar `CACHE_VERSION` en `sw.js`

---

## Contributing

Este es un proyecto personal. Si querés forkear y modificar:

1. Hacé fork
2. Creá branch para tu feature (`git checkout -b mi-feature`)
3. Commiteá cambios
4. Pusheá
5. Abrí PR

---

## License

MIT — hacé lo que quieras con el código.

Los assets (imágenes, videos, sonidos, fuentes) tienen copyrights de sus
respectivos owners. No me hago responsable por el uso que se les dé.

---

## Credits

- **Game design & code:** Alvaro8572
- **Fonts:** Google Fonts (Bungee, Monoton, Rubik Glitch, Jersey 10, Orbitron, etc)
- **Images:** Various sources (anime characters, memes, etc)
- **Sounds:** Various meme sources

---

## Roadmap

Mirá `TODO.md` para las features planeadas. Próximas grandes:

- **Memory Fragments** — historia narrativa que se desbloquea jugando
- **Hamburger menu** — consolidar todos los toggles en un menú slide-in
- **Stats card** — generar imagen compartible con tus stats
- **Reflejos del caos** — minijuego de reflejos cada 1000 clicks
- **Custom themes** — 8 paletas de colores (en shop, 10 monedas cada una)
