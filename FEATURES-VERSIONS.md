# 📦 at-mos — Features & Versioning

> Mapa de ruta: qué hay, qué sigue y cuándo.

---

## 🟢 v1.x — Actual (Core)

> **Estado:** ✅ Estable
> **npm:** `@kevdev35/at-mos@1.2.0`

### Lo que ya funciona
- [x] `at-mos init` — genera `@theme` desde cero
- [x] `at-mos list` — muestra variables existentes
- [x] `at-mos update` — agrega, edita, elimina variables
- [x] Importar desde JSON plano (`{ "color-primary": "#hex" }`)
- [x] Importar desde CSS
- [x] Multiselect al importar
- [x] Auto-detección de framework (Next, SvelteKit, Astro, Vue)
- [x] Auto-detección de package manager
- [x] Backup automático antes de sobrescribir
- [x] Instalación guiada de Tailwind si no está presente
- [x] Flags `--output`, `--from`, `--version`, `--help`

---

## 🟡 v1.5 — Core Mejorado

> **Estado:** 🔧 En desarrollo
> **Objetivo:** Parser chingón + más detecciones + UX sólida

### Parser avanzado de tokens.json
- [x] JSON plano (backward compatible)
- [x] JSON anidado → `{ color: { primary: "#hex" } }` → `--color-primary`
- [x] Formato Style Dictionary → `{ value: "#hex", type: "color" }`
- [x] Formato W3C DTCG → `{ $value: "#hex", $type: "color" }`
- [ ] Mode-aware con pregunta al usuario ("¿Incluir modo light, dark o ambos?")
- [ ] Filtrado inteligente: sugerir solo tokens relevantes para CSS
- [ ] Soporte para `tokens.json` de 1000+ entradas sin morir en el intento
- [ ] Preview de cuántos tokens se van a generar antes de confirmar

### Más frameworks detectados
- [ ] Nuxt
- [ ] Remix
- [ ] SolidStart
- [ ] Qwik
- [ ] Laravel + Inertia
- [ ] Angular
- [ ] Gatsby
- [ ] Eleventy (11ty)
- [ ] Hugo
- [ ] WordPress

### Inteligencia de entorno
- [ ] Detectar Vite / Webpack / Turbopack
- [ ] Detectar configuración Tailwind v3 (`tailwind.config.*`) vs v4 (`@theme`)
- [ ] Ofrecer upgrade v3 → v4 con `npx @tailwindcss/upgrade`

### UX
- [ ] Modo non-interactive (`--yes`) para CI/CD
- [ ] `at-mos init --json tokens.json --output app.css --yes` (headless)
- [ ] Vista previa del CSS generado antes de escribir
- [ ] `at-mos diff` — muestra cambios sin aplicar

---

## 🟠 v2.0 — IA Integration

> **Estado:** 🔮 Planeado
> **Objetivo:** Que at-mos vea imágenes, entienda descripciones y analice URLs

### Comando `config`
- [ ] `at-mos config set provider openai|anthropic|gemini|ollama`
- [ ] `at-mos config set key <api-key>` (almacenado local en `~/.at-mos/config.json`)
- [ ] `at-mos config get` — muestra config actual
- [ ] Sin vendor lock-in — sistema de providers abstraído

### Screenshot → Design Tokens
- [ ] `at-mos init --from screenshot.png`
- [ ] `at-mos init --from mockup.jpg`
- [ ] `at-mos init --from brand-logo.svg --palette 8`
- [ ] Extracción de: paleta de colores, tipografías, radios, espaciados
- [ ] Prompt engineering por proveedor para máxima precisión

### Prompt → Tema
- [ ] `at-mos init --prompt "Tema oscuro cyberpunk con morados neón"`
- [ ] Generación coherente de tokens desde lenguaje natural
- [ ] Ideal para prototipado rápido / brainstorming visual

### URL → Tokens
- [ ] `at-mos init --from https://ejemplo.com`
- [ ] Extrae estilos computados reales de la página
- [ ] Replica el `@theme` de cualquier sitio que te guste

### Modo offline
- [ ] Compatible con Ollama (modelos locales)
- [ ] No requiere API key para funcionamiento core
- [ ] La IA es add-on, no dependencia

---

## 🔴 v2.5 — Ecosistema

> **Estado:** 🔮 Planeado
> **Objetivo:** Salir de la terminal y llegar a donde los diseñadores viven

### Integración Figma
- [ ] `at-mos figma pull <file-key>` — jala tokens desde Tokens Studio
- [ ] `at-mos figma push <file-key>` — sube tokens modificados
- [ ] Autenticación con token personal de Figma
- [ ] Sync bidireccional: diseño ↔ código sincronizados

### VS Code Extension
- [ ] `at-mos: Init` desde command palette
- [ ] Preview inline del `@theme` en el editor
- [ ] Color picker visual para tokens
- [ ] Snippets para tokens comunes
- [ ] Highlight de sintaxis para `@theme`

### Landing Page
- [ ] at-mos.dev (o el dominio que sea)
- [ ] Playground online: generar `@theme` desde el browser
- [ ] Documentación visual con ejemplos
- [ ] Demos interactivos (code sandbox)

### Utilidades adicionales
- [ ] `at-mos new` — crea proyecto Tailwind v4 desde cero
- [ ] `at-mos import --from bootstrap.css` — reverse engineer de otros frameworks
- [ ] `at-mos audit` — health check de tokens (contraste, duplicados, consistencia)
- [ ] `at-mos suggest` — sugiere tokens faltantes según el proyecto

---

## 🟣 v3.0 — Team & Platform

> **Estado:** 💭 Visión a largo plazo
> **Objetivo:** Que at-mos sea la herramienta de diseño-sistemas para equipos

### Colaboración
- [ ] `at-mos sync` — comparte tokens entre proyectos
- [ ] Archivo central de tokens (`.at-mos/tokens.json`) como fuente de verdad
- [ ] Versionado de tokens (compatible con git)
- [ ] Notificación de cambios cuando alguien modifica tokens compartidos

### Plugin System
- [ ] API pública de plugins
- [ ] Plugins oficiales: export a Tailwind v3, CSS custom properties, JSON plano
- [ ] Marketplace / registro de plugins comunitarios

### CLI avanzado
- [ ] Compilado single-file (Bun / Deno) — sin dependencia de Node.js
- [ ] Auto-actualización (`at-mos upgrade`)
- [ ] Telemetría opcional (opt-in) para mejorar el producto

---

## 📊 Timeline Estimado

| Versión | Features | ETA |
|---------|----------|-----|
| **v1.5** | Core mejorado (parser + frameworks + UX) | ~2-4 semanas |
| **v2.0** | IA (imagenes, prompts, URLs) | ~4-8 semanas |
| **v2.5** | Ecosistema (Figma, VS Code, landing) | ~8-12 semanas |
| **v3.0** | Team & platform (sync, plugins, standalone) | ~12-16 semanas |

---

## 🧠 Notas de Arquitectura

### Prioridades para v1.5 (ahora)
```
core/parser.ts       ← ✅ YA (anidado, SD, W3C)
core/detector.ts     ← ⏳ Mejorar: +frameworks, +vite/webpack
commands/init.ts     ← ⏳ Añadir: modo --yes, preview
core/prompts.ts      ← ⏳ Añadir: preguntas de modo dark/light
utils/config-store.ts← 📝 Crear: ~/.at-mos/config.json
```

### Lo que NO cambia
- El nombre `gobal.css` se queda como inside joke 🥚
- El output siempre será CSS limpio, sin dependencias
- Sin lock-in: el `@theme` generado es 100% Tailwind estándar

---

*Creado: 2026-05-08 · Última actualización: 2026-05-08*
*Hecho por Zeek 🔥 pa' Kev — un feature a la vez.*
