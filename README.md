# 🔥 Chaos Button

> *"Sistema estable. El caos aguarda."*

Un botón. Muchos clicks. Mucho caos.

---

## ¿Qué es?

Un juego web hecho con HTML, CSS y JavaScript **puro** — sin frameworks, sin npm, sin build step. Abrís `index.html` y ya estás jugando. Apretás el botón, el caos escala, y a los 100% se desbloquean videos random, datos ocultos, achievements, una tienda, una ruleta, y muchas cosas más.

## 🎮 Cómo se juega

1. Abrí `index.html` en cualquier navegador moderno
2. Click **DESENCADENAR** hasta llegar a 100% de caos
3. Desbloqueá videos, hechos ocultos, achievements, comprá items en la tienda, girás la ruleta, y encontrá todos los secretos �

Si tu mouse aguanta.

## ⚡ Features

| Sistema | Descripción |
|---------|-------------|
| 🌪️ **Caos escalable** | Barra que sube con cada click, efectos visuales y sonoros que se intensifican |
| 🎬 **3 videos desbloqueables** | Avioncito, Tesla Bailando, Gojo en Bici |
| 📚 **40 datos ocultos** | 5 categorías: espacio, animales, cerebro, naturaleza, digital |
| � **25 achievements** | Bronce, plata y oro con condiciones específicas |
| 🪙 **Economía de monedas** | Gato cayendo, sardina, botón moneda, boost bar llena |
| � **Tienda** | 6 fotos de perfil, 5 fuentes custom, 6 frases, marcos |
| 🎰 **Ruleta** | 5 coleccionables de tier común/rare/mythic/legendary/jackpot |
| ⚡ **Boost bar** | Click x2 con cooldown de 30s, decay automático |
| 🐱 **Eventos aleatorios** | Gato, sardina, botón moneda |
| 💾 **Progreso persistente** | Todo se guarda en `localStorage` |

## 🛠 Stack técnico

```
HTML5   ── markup
CSS3    ── estilos + keyframes custom
JS      ── ~3300 líneas en un solo app.js (vanilla, IIFE)
```

**Sin** dependencias, frameworks, transpiladores, polyfills, build steps, ni backend. Funciona en Chrome, Firefox, Edge y Safari modernos.

### Estructura del proyecto

```
chaos-button/
├── index.html         # Markup completo
├── styles.css         # ~2600 líneas de CSS con animaciones
├── app.js             # ~3300 líneas de lógica
├── assets/
│   ├── fonts/         # 4 fuentes custom
│   ├── images/        # Fotos de perfil + collectibles
│   ├── sounds/        # 13 archivos MP3
│   └── videos/        # 3 videos desbloqueables
├── .gitignore
├── LICENSE            # MIT
├── MECHANICS.md       # Documentación técnica detallada
└── PLAN.txt           # Roadmap de fases
```

## 🏗️ Arquitectura

El código vive en un solo **IIFE** (Immediately Invoked Function Expression) dentro de `app.js`. Esto evita contaminar el scope global. La arquitectura está organizada en bloques comentados:

- **State machine** del caos (clicks, chaosLevel, isResetting)
- **Click system** + efectos per-click
- **Chaos meter** + barra de progreso
- **Particle system** (canvas-based, ambient + burst)
- **Random events** (13 eventos con probabilidades weighted)
- **Economy** (coins + boost)
- **Facts system** (40 hechos con cooldown)
- **Sound system** (click + 7 sonidos random)
- **Video system** (3 videos con weighted unlock)
- **Achievement system** (25 achievements tiered)
- **Shop system** (fotos, fuentes, frases, marcos)
- **Roulette system** (collectibles con tiers)
- **Profile bar** (nombre + foto + marco)
- **Debug helpers** (gated por `?debug=1`)

Ver `MECHANICS.md` para la documentación técnica detallada.

## 🔧 Helpers defensivos

El código incluye helpers para manejar localStorage corrupto:

```js
safeJSON(key, fallback)        // try/catch + auto-cleanup
safeNumber(key, fallback)      // valida números contra NaN/Infinity
chaosSetTimeout / Interval     // registry de timers auto-cleanup
migrateAssetPaths()            // migración de paths legacy
```

## 🎯 Debug mode

Hay un set de helpers de debug accesibles vía consola del navegador. **Por seguridad, están deshabilitados en producción**. Para activarlos:

```
https://alvaro8572.github.io/-chaos-button/?debug=1
```

Después abrís la consola y tipeás:

```js
__chaosDebug.help()           // muestra todos los comandos
__chaosDebug.giveAll()        // desbloquea todo
__chaosDebug.reset()          // limpia localStorage y recarga
```

## 📜 Licencia

MIT — hacé lo que quieras con el código. Créditos appreciated pero no obligatorios.

## 🙏 Créditos

- **Sonidos**: memes y efectos varios (ver `assets/sounds/`)
- **Videos**: clips de Avioncito, Tesla Bailando, Gojo en Bici
- **Fuentes**: KittyKatt, GameOfSquids, StrangerThings-Outlined, Benguiat-Bold
- **Google Fonts**: Bungee, Monoton, Rubik Glitch, y otros

---

<p align="center">
  <em>Hecho con HTML, CSS y JS puro. Dale, desatá el caos �</em>
</p>
