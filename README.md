# Chaos Button

Un clicker web donde cada clic desata más caos. Peleá contra el Chaos God, juntá collectibles legendarios, comprá armas en el Arsenal, completá rutas de progresión y desbloqueá el True Ending.

**[Jugar ahora](https://alvaro8572.github.io/chaos-button/)** — Funciona offline como PWA en Android/iOS.

---

## ¿Qué es?

Chaos Button es un **incremental / clicker** con identidad propia: caos visual, humor absurdo, y una progresión que va desde el primer clic hasta enfrentar al Chaos God en su máxima expresión (nivel 10). Todo en una PWA instalable, sin backend, sin build, sin frameworks.

El proyecto incluye el arsenal, el cierre narrativo del fragmento #8, recompensas diarias y el sistema de **Rutas por XP** con mapa de tiers, recompensas permanentes y Fragmentos de Conocimiento.

---

## Tabla de contenidos

- [¿Qué es?](#qué-es)
- [Features](#features)
- [¿Cómo se juega?](#cómo-se-juega)
- [Tech stack](#tech-stack)
- [Local development](#local-development)
- [Debug en localhost](#debug-en-localhost)
- [File structure](#file-structure)
- [Debug / customización](#debug--customización)
- [Deploy](#deploy)
- [Contributing](#contributing)
- [License](#license)
- [Credits](#credits)
- [Roadmap](#roadmap)

---

## Features

### Core

- **Clicker principal** — Cada clic sube el caos. La barra tiene una *safe zone* (0–89%) y una rampa final (0–3% en el último 10%) para que 100% sea alcanzable sin RNG puro.
- **Monedas** — Currency para la tienda y el arsenal. Boost de monedas (+25 por 10s) al activar el boost bar.
- **35 logros** — Bronce, plata y oro, con recompensas como fotos, marcos y fuentes. Incluye logros de arsenal, collectibles, rutas y racha diaria.

### Menú ☰ (hamburger)

El menú está organizado en **categorías** para no saturar la pantalla:

- **TIENDA** → Tienda, Arsenal, Ruleta
- **PROGRESO** → Rutas, Logros, Coleccion, Memoria, Fragmentos, Stats
- **DIARIAS** → Recompensas diarias (ciclo de 7 días con racha)
- **RUTAS** → Acceso directo al mapa de progresión por XP
- **PERFIL** → Nombre, foto, frase, marco, equipados
- **INFO** → Créditos del creador, agradecimientos, el "gracias por jugar"

Las categorías **TIENDA** y **PROGRESO** muestran sus submenús en el mismo panel, con un botón "← Volver" para regresar.

### Submenú Tienda

- **TIENDA** — Temas, fotos de perfil, fuentes, frases, marcos, ítems secretos.
- **ARSENAL** — Armas comprables con monedas y armas exclusivas de rutas. Se usan durante la pelea contra el boss.
- **RULETA** — 5 premios (nada, collectible no-legendario, monedas, consejo, jackpot). No da legendarios ni videos.

### Submenú Progreso

- **RUTAS** — Mapa de progresión por XP con cinco rutas, tiers romanos, objetivos, recompensas y Fragmentos de Conocimiento.
- **LOGROS** — Panel con tiers (🥉/🥈/🥇) y progreso x/total.
- **COLECCION** — Los 9 collectibles con su mecánica. Marco dorado en legendarios.
- **MEMORIA** — 11 fragmentos narrativos. El #8 ("El Último Humano") es *El Acumulador*; los #9–#11 se obtienen completando rutas.
- **FRAGMENTOS** — 48 Fragmentos de Conocimiento, antes llamados "Hechos". Se acumulan como recompensa extra de cada tier de ruta.
- **STATS** — Clicks exactos, monedas actuales/totales, boosts, veces al 100%, logros x/35, True Ending destacado.

### Rutas

El sistema de rutas convierte la progresión del juego en una campaña por XP:

- **10 clicks manuales = 1 XP** — Solo cuentan los clics del botón **DESENCADENAR**; los ataques de armas del boss no generan XP.
- **XP global y una ruta activa** — El XP se conserva al cambiar de ruta. Cada ruta tiene sus propios objetivos y recompensas.
- **Cinco rutas** — El Caminante del Caos, El Coleccionista Obsesivo, El Armero del Apocalipsis, El Servidor del Chaos God y El Acumulador Eterno.
- **Tiers romanos** — Las primeras tres rutas tienen tres tiers; las dos últimas tienen cuatro.
- **Escala ×4** — Cada ruta requiere cuatro veces más XP que la anterior: 100 → 400 → 1600 → 6400 → 25600 XP, 34.100 XP en total.
- **Mapa serpentiforme** — El panel muestra las rutas en un grid, el recorrido por tiers en filas alternadas y un popup con imagen, XP, objetivos y recompensas.
- **Completar una ruta** — Es una culminación one-shot: el XP se reinicia y se selecciona automáticamente la siguiente ruta no completada.

Cada tier entrega su recompensa principal y **Fragmentos de Conocimiento** adicionales. Las recompensas incluyen boosts permanentes de XP, slots de arma extra (2 → 3 → 4), monedas pasivas, collectible automático, temas, títulos de perfil, Spiderman, Laser Gun y Martillo de Thor.

El estado se persiste en `chaosPathState`:

```json
{
  "xp": 0,
  "activePath": "caminante",
  "completedTiers": { "caminante:0": true },
  "completedPaths": []
}
```

### Recompensas Diarias

Ciclo de 7 días que se reinicia si pasás más de un día sin ingresar:

- Día 1: 20 monedas de bienvenida
- Día 2: 50 monedas
- Día 3: Un tema PRO al azar
- Día 4: +5.000 clicks
- Día 5: Foto de perfil exclusiva (Deal With It)
- Día 6: 75 monedas
- Día 7: Foto exclusiva (Noob), 3 T-Rex gratis y 100 monedas

La racha crece con ingresos consecutivos; si pasás más de un día, la racha se reinicia. El panel se abre automáticamente cuando hay una recompensa pendiente. Logros: Racha de 3 y Racha de 7.

### Sonido

Toggle global (mute) disponible como **botón independiente en la esquina inferior izquierda**. La música del boss respeta el mute.

### Boss (in-page overlay)

- **10 niveles** de Chaos God: HP desde 50 (nivel 1) hasta 275 (nivel 10). 25 segundos por pelea. Nivel = `kills + 1` (cap 10).
- **Recompensa** — 50 🪙 por victoria. A los 5 bosses vencidos se desbloquean el logro "Boss Slayer", la foto `assets/boss.jpg` y el tema "FUEGO" exclusivo.
- **In-page** — Overlay fullscreen fijo, sin abrir otra pestaña.

### Arsenal (7 armas)

Cinco armas se **compran con monedas** en **TIENDA → ARSENAL** y dos se desbloquean como recompensa de rutas. Se usan durante la pelea contra el boss. Empezás con 2 slots; las rutas pueden elevarlos a 3 y 4.

| Arma | Tier | Precio | Efecto |
| --- | --- | --- | --- |
| 🍗 Pollo Kentucky | Común | 50 🪙 | +5s al reloj (y stun visual al boss) |
| 🔫 Bazooka | Común | 100 🪙 | -25 HP instantáneo |
| ⚔️ Katana | Común | 120 🪙 | +1 click/seg automático por 5s |
| 🦖 T-Rex | Mítico | 220 🪙 | -50 HP + +1 click/seg por 3s |
| 🃏 +4 | Mítico | 240 🪙 | +4 clicks/seg por 1s |
| 🔫 Laser Gun | Mítico | Ruta | -35 HP + +1 click/seg por 2s |
| 🔨 Martillo de Thor | Mítico | Ruta | -30 HP instantáneo + aturde 2s |

En la pelea aparecen los botones bajo `CLIQUEÁ PARA ATACAR`: **amarillo + círculo rojo con el stock** si tenés, **gris** si no. Al usar una, se bloquea por el resto de la pelea.

Logros de arsenal: **Bien Armado** (ganar usando 2 armas distintas), **Coleccionista del Arsenal** (comprar las 5 comprables), **Destructor Armado** (infligir 200 HP de daño con armas).

### Coleccionables (9 ítems, mecánica propia)

- **Gato**, **Sardina**, **Sandwich de Vainilla** y **La C del Caos** — Coleccionables comunes con movimiento y aparición característicos.
- **Refresco Zuko** y **Honguito Mágico** — Coleccionables raros: zigzag, y crecer girando → quieto 1s (agarrable) → achica girando.
- **Among Us**, **Pizza Guy + Casa** y **Spiderman** — Legendarios con comportamiento de evasión y movimiento diagonal.

Rates base: ~1 común cada 2–3 min, ~1 raro cada 1000 clicks, ~1 legendario cada 10000 clicks. Solo uno a la vez en pantalla. Las rutas pueden sumar un collectible automático cada cierta cantidad de clicks.

### Eventos aleatorios del caos

Terremoto, explosión, invasión, virus, portal, glitch, hacker, supernova, aurora, matrix rain, hackerman, confetti, etc. — disparados por probabilidad en el loop de caos.

### PWA

- **Instalable** — "Agregar a pantalla de inicio" en Android/iOS.
- **Offline** — Service worker con self-heal: cuando hay un nuevo build (`CURRENT_BUILD` distinto al `chaosBuildId` en localStorage), desregistra la SW vieja, limpia caches y registra la nueva.
- **Guard de build-token** — Si la URL solicitada usa un token distinto de `BUILD_TOKEN`, la SW ignora la copia cacheada y usa la red.
- **Estrategia SW** — Network-first para HTML, stale-while-revalidate para assets.

---

## ¿Cómo se juega?

1. Cliqueá el botón **DESENCADENAR** para subir el caos. Cada 10 clicks manuales obtenés 1 XP de ruta.
2. Llegá a 100% → se reinicia el ciclo, +monedas, achievement si es la 1era/3era/5ta/10ma vez.
3. Comprá items en la tienda con monedas.
4. Activá el boost bar (cada 1000 clicks) para x2 monedas por 10 segundos.
5. A los 1000+ clicks se desbloquea la ruleta (5 premios).
6. Llegá a 100% para que aparezcan los collectibles (1 a la vez). Atrapá los 9.
7. Peleá contra el Chaos God (empieza a aparecer a partir de ~1500 clicks). Empezás en nivel 1, subís con cada victoria. Llegá al 10.
8. Comprá armas en ARSENAL y usá 2 distintas para ganar la pelea → achievement **Bien Armado**. Juntá las 5 comprables → **Coleccionista del Arsenal**. Infligí 200 HP de daño con armas → **Destructor Armado**.
9. Completá **El Acumulador** (100% caos + collectibles + boss nivel 10) → se desbloquea el **fragmento de memoria #8** y el cierre narrativo en la pestaña MEMORIA.
10. Entrá a **Rutas**, completá objetivos y avanzá por los tiers. Las rutas completadas dan boosts permanentes, armas, slots, temas, títulos, memoria extra y Fragmentos de Conocimiento.
11. Revisá STATS para ver tus números, e INFO para los créditos.

---

## Tech stack

- **HTML5 + CSS3 + JavaScript ES5** — vanilla, sin frameworks, sin transpilers.
- **PWA** — `manifest.json` + `sw.js` con cache strategy y guard de build-token.
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

---

## Debug en localhost

En DevTools (PC) o via `javascript:` en la barra del celu:

```javascript
__chaosDebug.help()              // lista completa
__chaosDebug.giveClicks(99999)    // setear clicks totales
__chaosDebug.giveCoins(99999)    // setear monedas
__chaosDebug.givePathXp(1000)    // setear XP de rutas
__chaosDebug.giveFacts()         // todos los Fragmentos de Conocimiento
__chaosDebug.giveAll()           // todo desbloqueado + stats al máximo
__chaosDebug.spawnGato()         // spawnea un collectible
__chaosDebug.clearCollectible()  // borra el collectible activo
__chaosDebug.reset()             // borra localStorage y recarga
```

También están disponibles `spawnSardina`, `spawnSandwich`, `spawnC`, `spawnRefresco`, `spawnHonguito`, `spawnAmongus` y `spawnPizzaGuy`.

**Boss:** `startBossArena(N)` con N de 1 a 10 (ej. `startBossArena(10)` para el boss más fuerte). El debug SOLO anda en `localhost`/`127.0.0.1` (no en el deploy público).

**Mobile bookmarklets:** para que `javascript:` no reemplace la página con `undefined`, usá `void()`:

```javascript
javascript:void(__chaosDebug.spawnPizzaGuy())
javascript:void(startBossArena(10))
```

---

## File structure

```text
chaos-button/
├── index.html              # Entry point y shell (~1747 líneas)
├── styles.css              # Todos los estilos (~5677 líneas, organizado por sección)
├── app.js                  # Lógica principal (~6113 líneas, organizado por feature)
├── boss.js                 # Overlay del boss fight + lógica de armas (~420 líneas)
├── manifest.json           # PWA metadata
├── sw.js                   # Service worker con self-heal y build-token guard (~207 líneas)
├── assets/
│   ├── images/             # Shop, collectibles, armas, fotos y memes (~45 imágenes)
│   ├── sounds/             # Efectos de sonido (~20 archivos)
│   ├── fonts/              # 4 fuentes custom
│   ├── icons/              # 2 iconos PWA
│   ├── videos/             # 3 videos de recompensa
│   ├── logo.jpg
│   ├── boss.jpg
│   └── music-boss-{1,2,3}.mp3
├── README.md               # Este archivo
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

`app.js` contiene el array `WEAPONS` (id, name, src, price, tier, effect, value/rate/duration). Las armas exclusivas de rutas usan `rewardOnly: true`.

### Cambiar rutas

`app.js` contiene el array `PATHS`. Cada ruta define `id`, `name`, `icon`, `desc`, `xp`, `tiers` y recompensas. Cada tier define `roman`, `name`, `xp`, `objectives`, `rewards` y `fragments`.

Las recompensas disponibles incluyen `coins`, `frame`, `picture`, `boostPermanent`, `theme`, `weapon`, `weaponSlots`, `collectible`, `memory`, `autoCollectible`, `passiveCoins` y `title`.

### Bump de build (cuando cambiás JS/CSS/SW)

Todo cambio en JavaScript, CSS o Service Worker requiere actualizar el build token. El token actual es `58-rutas-map` y aparece en **10 lugares**:

- `index.html` (6): `styles.css?v=`, `assets/logo.jpg?v=`, `CURRENT_BUILD`, `sw.js?v=`, `app.js?v=`, `boss.js?v=`
- `sw.js` (4): `CACHE_VERSION`, `BUILD_TOKEN` y los tres assets del `APP_SHELL` (`styles.css?v=`, `app.js?v=`, `boss.js?v=`)

Reemplazá el token viejo por el nuevo en esos 10 lugares. Sin esto, la SW puede servir la versión vieja. Los cambios únicamente en Markdown no requieren bump.

---

## Deploy

El proyecto está en **GitHub Pages** (`alvaro8572.github.io/chaos-button`). Push a `main` → rebuild automático en 1–2 minutos. El service worker se auto-actualiza con el mecanismo de self-heal y el guard de build-token.

Para forzar update en el browser: DevTools → Application → Service Workers → Unregister → refresh. Si seguís viendo una versión vieja, usá una ventana privada o limpiá los datos del sitio.

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

El sistema de Rutas ya está implementado y funciona como la capa de progresión principal. Las siguientes ideas siguen abiertas:

- True Final cinematic
- NG+ / Prestigio con recompensas permanentes y logros exclusivos
- Boss Rush Endless con leaderboard local
- Pokédex de lore
- Reto diario adicional
- Botón para compartir caos %
- Tests automatizados con Playwright

Cualquier feature nueva debe planearse antes de escribir código: diseño, edge cases, integración con los sistemas existentes y testing.
