# 🚀 Roadmap de Features — Chaos Button

> Ideas para próximas versiones. Cada item tiene:
> - **Prioridad** (alta/media/baja)
> - **Tiempo estimado** (rápido = 15-30min, medio = 1-3h, largo = 3-8h+)
> - **Qué enseña** (conceptos de programación)

---

## ✅ Ya implementado

- [x] Sound toggle con persistencia (commit `19c28cb`, `e8da74f`)
- [x] 22 bugs arreglados (commit `86c2a91`)

---

## 🎯 Fase 0 — Pulido técnico (HACER PRIMERO)

Estas son cosas que **no son features**, pero te van a doler si no las arreglás. Recomendado: hacerlas antes de agregar más features.

### Refactor del `app.js` (Largo, 4-8h)
- **Qué**: Separar el archivo de 3300 líneas en módulos más chicos
- **Cómo**: Dividir en `state.js`, `audio.js`, `ui.js`, `achievements.js`, `shop.js`, `roulette.js`, `boost.js`, `events.js`
- **Por qué importa**: ahora es manejable, en 6 meses va a ser un infierno
- **Conceptos que enseña**: módulos, IIFE pattern, organización de código

### Tests automatizados con Vitest (Medio, 2-4h)
- **Qué**: Tests para funciones puras (achievement unlock, fact dedup, safeJSON, etc.)
- **Cómo**: Instalar Vitest, escribir tests, correrlos con `npm test`
- **Por qué importa**: hoy cambiás algo y "anda", pero no sabés si rompiste otra cosa
- **Conceptos que enseña**: testing, assertions, mocks de localStorage

### Quitar `__chaosDebug` de producción (Rápido, 15min)
- **Qué**: Sacar el helper de debug o dejarlo solo con flag
- **Cómo**: Borrar líneas 3074-3259 (gated por `CHAOS_DEBUG_ENABLED` ya)
- **Por qué importa**: cualquier user con devtools puede usar `giveAll()`
- **Conceptos que enseña**: build flags, code splitting

### Limpiar indentación inconsistente del CSS (Rápido, 15min)
- **Qué**: Estandarizar a 2 espacios (ya está, pero verificar)
- **Cómo**: Editor con auto-formatter
- **Conceptos que enseña**: style guides, linters

---

## 🎮 Fase 1 — Features chiquitas y satisfactorias (1-2 días)

Empezar por estas para mantener la motivación alta.

### 🟢 Click combo / streak (Rápido, 30min)
- **Qué**: Click rápido = multiplicador x2, x3, x5. Si dejás 1s sin clickear, vuelve a x1. Cada x10 = bonus monedas.
- **Conceptos que enseña**: `setTimeout`/`clearTimeout`, estado de juego, animación
- **Impacto visual**: contador flotante "x3 COMBO!" cada vez que combo

### 🟢 Mensaje random al ganar monedas (Rápido, 15min)
- **Qué**: En vez de "+25 monedas" siempre, mensajes random: "¡Tu vieja está orgullosa!", "¡Eso es pa' comprar un alfajor!", etc.
- **Conceptos que enseña**: arrays + random selection
- **Impacto visual**: hace el juego más vivo, divertido

### 🟢 Contador regresivo al 100% (Rápido, 20min)
- **Qué**: Mostrar "Faltan X clicks para el caos total" arriba del chaos meter
- **Conceptos que enseña**: cálculo en vivo, DOM update por click
- **Impacto visual**: el user sabe cuánto le falta, sube la motivación

### 🟢 Day/night mode automático (Rápido, 30min)
- **Qué**: El fondo y los colores cambian según la hora del día del user
  - 6-18hs: tonos cálidos
  - 18-22hs: tonos morados
  - 22-6hs: tonos oscuros con estrellas
- **Conceptos que enseña**: `new Date()`, CSS variables, transiciones
- **Impacto visual**: WOW, el juego se siente vivo

### 🟢 Auto-save indicator (Rápido, 20min)
- **Qué**: Un punto chiquito arriba a la derecha que parpadea cuando se guarda algo
- **Conceptos que enseña**: event hooking, CSS animation
- **Impacto visual**: sutil, da安心感 (tranquilidad) al user

### 🟢 Cursor custom en el botón (Rápido, 15min)
- **Qué**: Cuando estás sobre el botón, cursor tipo "crosshair" o "pointer custom"
- **Conceptos que enseña**: CSS cursor property
- **Impacto visual**: pequeño, pero suma a la sensación de "juego"

### 🟢 Botón de "RESET" / panic (Rápido, 30min)
- **Qué**: Un botón chiquito rojo que borra todo el localStorage (con confirmación modal)
- **Conceptos que enseña**: confirm dialogs, localStorage clear, eventos custom
- **Impacto funcional**: necesario si el user quiere empezar de cero

---

## 🎮 Fase 2 — Features medianas (3-7 días)

Para cuando ya tengas confianza con las chiquitas.

### 🟡 Stats panel (Medio, 2h)
- **Qué**: Panel nuevo con tus stats: total clicks histórico, tiempo jugado, achievements, best streak
- **Conceptos que enseña**: iteración sobre localStorage, agregación de datos, render dinámico
- **Impacto visual**: muy satisfactorio para el user

### 🟡 Hot keys / shortcuts (Medio, 2h)
- **Qué**: Atajos de teclado:
  - `H` = abrir/cerrar HECHOS
  - `S` = abrir/cerrar TIENDA
  - `R` = abrir RULETA
  - `L` = abrir LOGROS
  - `M` = toggle mute
  - `?` = mostrar ayuda de shortcuts
- **Conceptos que enseña**: `keydown` events, UX shortcuts
- **Impacto funcional**: hace el juego más pro

### � Sound packs (Medio, 3h)
- **Qué**: Varios sets de sonidos elegibles:
  - Meme (default)
  - Retro (8-bit)
  - Horror (gritos, sustos)
  - Relax (sonidos de naturaleza)
- **Conceptos que enseña**: configuración, asset management
- **Impacto funcional**: replayability, personalización

### � Themes / skins (Medio, 3-4h)
- **Qué**: Varios sets de colores para la barra de caos, eventos, fondo:
  - Classic (rojo/naranja)
  - Cyberpunk (cyan/magenta)
  - Matrix (verde)
  - Vaporwave (rosa/cyan)
- **Conceptos que enseña**: CSS variables, switching dinámico
- **Impacto visual**: WOW

### 🟡 Leaderboard local (Medio, 2h)
- **Qué**: Top 5 mejores chaos-reached con tu nombre
- **Conceptos que enseña**: array sorting, render de tabla
- **Impacto funcional**: motivación para jugar más

### 🟡 Export/import save (Medio, 2h)
- **Qué**: Botón para descargar tu progreso como .json, otro para subirlo
- **Conceptos que enseña**: File API, JSON, download/upload
- **Impacto funcional**: backup, compartir saves con amigos

### 🟡 Click combo / streak con achievements (Medio, 2h)
- **Qué**: Versión mejorada del combo, con achievements: "Combo x10", "Combo x25", "Combo master x50"
- **Conceptos que enseña**: state management, achievements
- **Impacto funcional**: motivación, replayability

---

## 🎮 Fase 3 — Features grandes (1-2 semanas)

Estas son **features que cambian el juego**. Requieren más planificación.

### 🔴 Easter eggs (Rápido a medio, 15min-2h cada uno)
Lista de ideas:

#### 🥇 Konami code (Rápido, 30min)
- **Qué**: ⬆️⬆️⬇️⬇️⬅️➡️⬅️➡️BA → activa "modo caos total" (todos los eventos a la vez) + achievement oculto "Old School"
- **Conceptos que enseña**: keydown listener global, secuencia de estados
- **Impacto**: descubrimiento divertido, viralizable

#### 🥈 666 clicks exactos (Rápido, 15min)
- **Qué**: Cuando llegás a exactamente 666 clicks, aparece algo oculto (mensaje + efecto visual)
- **Conceptos que enseña**: trigger por valor exacto
- **Impacto**: simpático, "loco" en el contexto del juego

#### 🥉 Firma del dev (Rápido, 20min)
- **Qué**: Clickear el título "CHAOS BUTTON" 10 veces rápido → aparece un mensaje tuyo
- **Conceptos que enseña**: click counter en elemento específico, timeout
- **Impacto**: personal, deja tu firma

#### Botón "NO" que se escapa (Medio, 1h)
- **Qué**: Botón que aparece cuando intentás comprar sin monedas. Mouse encima = se mueve random.
- **Conceptos que enseña**: event handling, posicionamiento random
- **Impacto**: frustrante divertido, viralizable

#### Día escondido (Rápido, 20min)
- **Qué**: Si abrís el juego en una fecha especial (tu cumple, 1 de abril, Halloween), aparece algo festivo
- **Conceptos que enseña**: `Date`, condicionales por fecha
- **Impacto**: sorpresa automática

### 🔴 Daily challenge (Largo, 6-8h)
- **Qué**: Cada día un seed distinto (basado en la fecha), leaderboard del día
- **Conceptos que enseña**: fechas, random seed, persistencia
- **Impacto funcional**: vuelve todos los días, engancha

### 🔴 Speedrun mode (Largo, 4-6h)
- **Qué**: Timer que cuenta cuánto tardás en llegar a 100%. Highscore local.
- **Conceptos que enseña**: `performance.now()`, leaderboard, estado de juego
- **Impacto funcional**: modo competitivo

### 🔴 Hardcore mode (Largo, 6-8h)
- **Qué**: Una sola vida. Sin localStorage, sin reset. Si te morís, se acabó.
- **Conceptos que enseña**: estado en memoria, sin persistencia
- **Impacto funcional**: adrenalina pura

### 🔴 Multiplayer simple (Largo, 8h+)
- **Qué**: Dos pestañas del mismo navegador pueden chatear y competir (BroadcastChannel API)
- **Conceptos que enseña**: cross-tab communication, sync de estado
- **Impacto funcional**: social, único

---

## 🎮 Fase 4 — Features creativas / experimentales

Para cuando ya domines todo lo anterior.

### � Sound visualization (Largo, 6h)
- **Qué**: Mientras suena un efecto, visualiza el espectro de frecuencias con partículas
- **Conceptos que enseña**: Web Audio API, AnalyserNode, Canvas
- **Impacto visual**: WOW

### 💎 Generador procedural de eventos (Largo, 8h+)
- **Qué**: Eventos random únicos generados por reglas, no predefinidos
- **Conceptos que enseña**: algoritmos, composición procedural
- **Impacto funcional**: infinita replayability

### 💎 Custom themes por el user (Largo, 6h)
- **Qué**: Editor visual para que el user cree sus propios colores y los guarde
- **Conceptos que enseña**: form inputs, color pickers, persistencia
- **Impacto funcional**: creatividad del user

### 💎 Mobile gestures (Medio, 2-3h)
- **Qué**: Swipe en mobile para abrir/cerrar panels, pinch para zoom, double-tap para boost
- **Conceptos que enseña**: touch events, gesture detection
- **Impacto funcional**: mobile-friendly

---

## � Resumen de tiempos estimados

| Fase | Features | Tiempo total |
|------|----------|--------------|
| **Fase 0** (pulido) | 4 items | 6-12 horas |
| **Fase 1** (rápidas) | 7 items | ~3 horas |
| **Fase 2** (medias) | 6 items | ~14 horas |
| **Fase 3** (grandes) | 8 items | 40-60 horas |
| **Fase 4** (creativas) | 4 items | 22+ horas |
| **TOTAL** | **29 features** | **~85-100 horas** |

---

## 🎯 Orden recomendado para vos

Considerando que estás aprendiendo, sugiero este orden:

1. **Fase 0** (mínimo: tests automatizados) → sienta las bases
2. **Fase 1** completa → features visibles rápido
3. **Fase 2** stats panel + hot keys → pulido UX
4. **Fase 3** easter eggs (los 5) → diversión
5. **Fase 4** cuando te sientas confiado

---

## 💡 Regla de oro

> **Hacé features que te DIVIERTAN a vos primero.**
>
> Si una feature te aburre programarla, no la hagas. Si te copa, hacela aunque sea difícil. La motivación importa más que la "utilidad objetiva".

---

**Última actualización:** 2026
