# Chaos Button

Un clicker web donde cada clic desata más caos. Peleá contra el Chaos God, juntá 8 coleccionables legendarios, comprá armas en el Arsenal y desbloqueá el True Ending.

**[Jugar ahora](https://alvaro8572.github.io/chaos-button/)** — Funciona offline como PWA en Android/iOS.

---

## ¿Qué es?

Chaos Button es un **incremental / clicker** con identidad propia: caos visual, humor absurdo, y una progresión que va desde el primer clic hasta enfrentar al Chaos God en su máxima expresión (nivel 10). Todo en una PWA instalable, sin backend, sin build, sin frameworks.

El proyecto está en su **release v2** (completa, con el arsenal y el cierre narrativo del fragmento #8). Lo que sigue es un **roadmap v3** (PR abierto) con features opcionales para extender la vida del juego.

---

## Features (v2 — lo que está hoy)

### Core
- **Clicker principal** — Cada clic sube el caos. La barra tiene una *safe zone* (0–89%) y una rampa final (0–3% en el último 10%) para que 100% sea alcanzable sin RNG puro.
- **Monedas** — Currency para la tienda y el arsenal. Boost de monedas (+25 por 10s) al activar el boost bar.
- **25 logros** — Bronce, plata y oro, con recompensas (fotos, marcos, frases, boost x2 permanente al matar al boss 5 veces).

### Menú ☰ (hamburger)
- **TIENDA** — Temas, fotos de perfil, fuentes, frases, marcos, items secretos.
- **RULETA** — 5 premios (nada, collectible no-legendario, monedas, consejo, jackpot) reworks. No da legendarios, no da videos.
- **HECHOS** — Curiosidades que se desbloquean jugando.
- **LOGROS** — Panel con tiers (🥉/🥈/🥇) y progreso x/total. Ahora incluye los 3 logros de arsenal.
- **COLECCIÓN** — Los 8 collectibles (gato, sardina, sandwich de vainilla, la C, refresco Zuko, honguito, amongus, pizza guy) con su mecánica. Marco dorado en legendarios. La pestaña refleja si los compraste / usaste.
- **PERFIL** — Nombre, foto, frase, marco, equipados.
- **MEMORIA** — 8 fragmentos narrativos. El #8 ("El Último Humano") es *El Acumulador*: 100% caos + los 8 collectibles + boss nivel 10 derrotado. Al desbloquearlo se muestra la cinemática de cierre.
- **INFO** — Créditos del creador (Álvaro Ortega Castro), agradecimientos, el "gracias por jugar".
- **STATS** — Clicks exactos, monedas actuales/totales, boosts, veces al 100%, logros x/25, True Ending destacado.
- **SONIDO** — Toggle global (mute). La música del boss respeta el mute.

### Boss (in-page overlay)
- **10 niveles** de Chaos God: HP desde 50 (nivel 1) hasta 275 (nivel 10). 25 segundos por pelea. Nivel = `kills + 1` (cap 10).
- **Recompensa** — 50 🪙 por victoria. A los 5 bosses vencidos, achievement "Boss Slayer" + tema "FUEGO" exclusivo.
- **In-page** — Overlay (ya no abre otra pestaña). z-index 9999, fullscreen, fixed.

### Arsenal (5 armas) — la gran feature de v2
Las armas se **compran con monedas** en la nueva pestaña ☰ **ARSENAL** (entre COLECCIÓN y PERFIL) y se **usan durante la pelea** contra el boss. Máximo 2 armas distintas por pelea (los 5 botones se ponen grises al llegar a 2).

| Arma | Tier | Precio | Efecto |
| --- | --- | --- | --- |
| 🍗 Pollo Kentucky | Común | 50 🪙 | +5s al reloj (y stun visual al boss) |
| 🔫 Bazooka | Común | 100 🪙 | -25 HP instantáneo |
| ⚔️ Katana | Común | 120 🪙 | +1 click/seg automático por 5s |
| 🦖 T-Rex | **Mítico** | 220 🪙 | -50 HP + +1 click/seg por 3s |
| 🃏 +4 | **Mítico** | 240 🪙 | +4 clicks/seg por 1s |

En la pelea aparecen 5 botones bajo el `CLIQUEÁ PARA ATACAR`: **amarillo + círculo rojo con el stock** si tenés, **gris** si no. Al usar una, se bloquea (gris) por el resto de la pelea.

### Coleccionables (8 ítems, mecánica propia)
- **Gato** y **La C** — Caen del cielo.
- **Sardina** — Nada desde abajo (con animación de nado).
- **Sandwich de Vainilla** — Aparece/desaparece cada 2s en lugares random.
- **Refresco Zuko** — Zigzag horizontal.
- **Honguito Mágico** — Crece girando → quieto 1s (agarrable) → achica girando.
- **Among Us** — Pasa L→R, esquiva 3 veces; al 3er click se agarra.
- **Pizza Guy + Casa** — Pizza viaja L→R hacia la casa (al final del tramo). Si destruís la casa antes de que llegue, la pizza se congela y la podés agarrar. Si no, esquiva todo.

Rates: ~1 común cada 2–3 min, ~1 raro cada 1000 clicks, ~1 legendario cada 10000 clicks. Uno a la vez en pantalla.

### Eventos aleatorios del caos
Terremoto, explosión, invasión, virus, portal, glitch, hacker, supernova, aurora, matrix rain, hackerman, confetti, etc. — disparados por probabilidad en el loop de caos.

### PWA
- **Instalable** — "Agregar a pantalla de inicio" en Android/iOS.
- **Offline** — Service worker con self-heal: cuando hay un nuevo build (`CURRENT_BUILD` distinto al `chaosBuildId` en localStorage), desregistra la SW vieja, limpia caches y registra la nueva.
- **Estrategia SW** — Network-first para HTML, stale-while-revalidate para assets.

---

## ¿Cómo se juega?

1. Cliqueá el botón **DESENCADENAR** para subir el caos.
2. Llegá a 100% → se reinicia el ciclo, +monedas, achievement si es la 1era/3era/5ta/10ma vez.
3. Comprá items en la tienda con monedas.
4. Activá el boost bar (cada 1000 clicks) para x2 monedas por 10 segundos.
5. A los 1000+ clicks se desbloquea la ruleta (5 premios).
6. Llegá a 100% para que aparezcan los collectibles (1 a la vez). Atrapá los 8.
7. Peleá contra el Chaos God (empieza a aparecer a partir de ~1500 clicks). Empezás en nivel 1, subís con cada victoria. Llegá al 10.
8. Comprá armas en ARSENAL y usá 2 distintas para ganar la pelea → achievement **Bien Armado**. Juntá las 5 → **Coleccionista del Arsenal**. Infligí 200 HP de daño con armas → **Destructor Armado**.
9. Completá **El Acumulador** (100% caos + 8 collectibles + boss nivel 10) → se desbloquea el **fragmento de memoria #8** y el cierre narrativo en la pestaña MEMORIA.
10. Revisá STATS para ver tus números, e INFO para los créditos.

---

## Tech stack

- **HTML5 + CSS3 + JavaScript ES5** — vanilla, sin frameworks, sin transpilers.
- **PWA** — `manifest.json` + `sw.js` con cache strategy.
- **Sin build process** — servís los archivos como están.
- **Sin backend** — todo el estado en `localStorage` (claves con prefijo `chaos`).
- **Imágenes y sonidos** — assets locales en `assets/`.

### ¿Por qué vanilla?
- Iteración visual rápida (cambias un CSS y ves el resultado).
- Deploy directo a GitHub Pages sin CI de build.
- Performance excelente en mobile sin hydration cost.
- Legible: cualquier dev puede forkear y entender el código.

---

## Local development

```bash
# Con Python 3
python -m http.server 8000

# Con Node (si tenés npx)
npx serve
```

Abrí `http://localhost:8000`. **El service worker requiere servidor** (no funciona con `file://` excepto en `127.0.0.1`).

Para mobile testing: usá `ngrok` o similar para HTTPS, o conectá el celu a la misma WiFi que la PC y usá la IP local (`http://<IP-PC>:8000/?debug=1`).

### Debug en localhost

En DevTools (PC) o via `javascript:` en la barra del celu:

```javascript
__chaosDebug.help()              // lista completa
__chaosDebug.giveCoins(99999)    // setear monedas
__chaosDebug.giveAll()           // TODO desbloqueado + stats al máximo
__chaosDebug.spawnGato()         // (y spawnSardina, spawnSandwich, spawnC,
                                 //  spawnRefresco, spawnHonguito, spawnAmongus,
                                 //  spawnPizzaGuy) — spawnean el collectible
__chaosDebug.clearCollectible()  // borra el collectible activo
__chaosDebug.reset()              // borra localStorage y recarga
```

**Boss:** `startBossArena(N)` con N de 1 a 10 (ej. `startBossArena(10)` para el boss más fuerte). El debug SOLO anda en `localhost`/`127.0.0.1` (no en el deploy público).

**Mobile bookmarklets:** para que `javascript:` no reemplace la página con `undefined`, usá `void()`:
```javascript
javascript:void(__chaosDebug.spawnPizzaGuy())
javascript:void(startBossArena(10))
```

---

## File structure

```
chaos-button/
├── index.html              # Entry point (~1730 líneas)
├── styles.css              # Todos los estilos (~4700 líneas, organizado por sección)
├── app.js                  # Lógica principal (~4400 líneas, organizado por feature)
├── boss.js                 # Overlay del boss fight + lógica de armas (~370 líneas)
├── manifest.json           # PWA metadata
├── sw.js                   # Service worker con self-heal
├── assets/
│   ├── images/             # Shop items, collectibles, **5 armas del arsenal**
│   ├── sounds/             # Sound effects
│   ├── fonts/              # Custom fonts
│   └── icons/              # PWA install icons
├── README.md               # Este archivo
├── CHANGELOG.md            # Version history
├── TODO.md                 # Pending features (v2 está hecho; v3 ideas en el PR)
├── NOTES.md                # Architecture decisions
└── ROADMAP.md              # v3 roadmap
```

---

## Debug / customización

### Cambiar la dificultad del caos
`app.js` (buscá el comentario de safe zone / rampa final):
```javascript
// safe zone 0–89%, rampa 0–3% en el último 10% (cap final)
```

### Cambiar rates de collectibles
`app.js` en `trySpawnCollectible()`:
```javascript
var comunChance = 0.0055;  // ~1 cada 180 clicks
var raroChance  = 0.001;   // ~1 cada 1000
var legChance    = 0.0001;  // ~1 cada 10000
```

### Cambiar precios / agregar armas al Arsenal
`app.js` array `WEAPONS` (id, name, src, price, tier, effect, value/rate/duration). Recordá bumpear el build token en `index.html` y `sw.js` (10 lugares).

### Bump de build (cuando cambiás JS/CSS/SW)
Buscá el token viejo (ej. `50-acumulador`) en `index.html` (6 lugares) y `sw.js` (4 lugares) y reemplazalo por el nuevo (ej. `51-lo-que-sea`). Sin esto, la SW sirve la versión vieja.

---

## Deploy

El proyecto está en **GitHub Pages** (`alvaro8572.github.io/chaos-button`). Push a `main` → rebuild automático en 1–2 minutos. El service worker se auto-actualiza con el mecanismo de self-heal (cambio de `CURRENT_BUILD`).

Para forzar update en el browser: DevTools → Application → Service Workers → Unregister → refresh.

---

## Contributing

Es un proyecto personal. Si querés forkear y meter features:

1. Fork
2. Branch con nombre válido: `feat/mi-feature`, `fix/mi-bug`, etc.
3. Commit con conventional commits (`feat(scope): descripción`)
4. Push y PR contra `main`

Convención de commits: conventional commits, sin atribución de IA. Los PRs contra `main` se mergean después de pasar los tests manuales (Playwright sobre `127.0.0.1:8000`).

---

## License

MIT — hacé lo que quieras con el código.

Los assets (imágenes, sonidos, fuentes) tienen copyrights de sus respectivos owners. Si usás este proyecto, reemplazá los assets o conseguí permisos.

---

## Credits

- **Game design & code:** [Álvaro Ortega Castro](https://github.com/Alvaro8572) (Alvaro8572)
- **Mentoring / vibe-coding intro:** Yarén Ortega (papá)
- **Fonts:** Google Fonts
- **Imágenes de collectibles/armas:** varias fuentes (memes, anime, etc.)
- **Sonidos:** varios sources de memes

---

## Roadmap

**v2 está shipped** (todo lo de arriba). Para extender el juego, mirá el **PR del roadmap v3** (o `ROADMAP.md` una vez mergeado) — son 6 ideas para una próxima iteración: True Final cinematic, NG+ / Prestigio, Endless Boss Rush, Pokédex de lore, Reto diario, y botón de compartir caos %. El PR instruye a quien lo tome a **planear antes de escribir código** (diseño, edge cases, integración con los sistemas existentes, testing).
