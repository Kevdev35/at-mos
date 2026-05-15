# 🧠 at-mos — V2 Roadmap & Big Ideas

> Ideas pa' llevar at-mos de una CLI utilitaria a algo verdaderamente chingón.

---

## 🎯 Prioridades Altas (Core MVP++)

### 1. Parseo avanzado de `tokens.json`

**Problema actual:** El parser JSON es plano — solo acepta `{ "color-primary": "#hex" }`. Los tokens reales suelen tener estructuras anidadas y complejas.

**Lo que queremos:**
```json
{
  "color": {
    "primary": { "value": "#7c3aed", "type": "color" },
    "secondary": { "value": "#06b6d4", "type": "color" },
    "surface": { "value": { "light": "#fff", "dark": "#1a1a2e" }, "type": "color" }
  },
  "spacing": {
    "xs": { "value": "0.25rem" },
    "sm": { "value": "0.5rem" },
    "md": { "value": "1rem" }
  }
}
```

**¿Qué implica?**
- Parseo recursivo de JSON anidado → aplanar con prefijos (`color-primary`, `color-secondary`, etc.)
- Soporte para formato Style Dictionary (tokens con `value` + `type`)
- Detección de `$value` / `$type` (formato W3C Design Tokens)
- Modo oscuro / modo claro → detectar y preguntar si se incluyen ambos o solo uno
- Filtrado inteligente: solo tokens relevantes para CSS (colores, spacing, fonts, radii, shadows, etc.)

### 2. Detección mejorada de frameworks

**Problema actual:** Solo detecta Next, SvelteKit, Astro, Vue. Hay muchos más.

**Frameworks a agregar:**
- ✅ Nuxt
- ✅ Remix
- ✅ SolidStart
- ✅ Qwik
- ✅ Laravel (con Inertia)
- ✅ Angular
- ✅ Gatsby
- ✅ Eleventy (11ty)
- ✅ Hugo (si tiene package.json con Tailwind)
- ✅ WordPress (con @wordpress/scripts)

**Además:**
- Detectar si usa Vite, Webpack, Turbopack
- Detectar si usa Tailwind v4 CSS-first config o v3 con `tailwind.config`
- Ofrecer migración v3 → v4 si se detecta

### 3. Modo interactivo mejorado

- `at-mos init` con wizard tipo "walk me through it" paso a paso
- Preguntas contextuales según lo detectado
- Vistas previas de lo que se va a generar antes de escribir
- `at-mos init --from figma` (exportar tokens desde Figma directo)

---

## 🤖 IA — El diferenciador fuerte

### 4. Screenshot → Design Tokens

**Input:** Una imagen (PNG, JPG, WebP, SVG)
**Output:** `@theme { ... }` completo

**Cómo funciona:**
- Usa LLM con visión (OpenAI GPT-4o, Anthropic Claude 3.5 Sonnet, Gemini 2.0 Flash)
- El modelo analiza la imagen y extrae:
  - Paleta de colores dominante (~5-12 colores)
  - Tipografías (con suerte, si detecta texto)
  - Radios de bordes
  - Espaciados relativos
- Prompt bien estructurado para que devuelva JSON parseable
- El usuario selecciona qué tokens incluir

**Flags:**
```bash
at-mos init --from screenshot.png
at-mos init --from mockup.jpg --model claude
at-mos init --from brand-logo.svg --palette 8  # generar X colores
```

### 5. Prompt → Tema

**Input:** Descripción en lenguaje natural
**Output:** `@theme { ... }`

```bash
at-mos init --prompt "Tema oscuro con morados neón y verdes ácidos, vibe cyberpunk 2077"
```

El modelo genera los tokens más coherentes posibles con la descripción. Útil para prototipado rápido.

### 6. URL → Tokens

```bash
at-mos init --from https://ejemplo.com
```

Agarra una URL, extrae los estilos computados de la página (colores, fonts, sizes reales usados), y genera un `@theme` equivalente. Perfecto para cuando ves un diseño que te late y quieres el vibe sin inspeccionar 500 elementos uno por uno.

### 7. Bring Your Own Model

**Sin vendor lock-in.** El usuario configura qué proveedor usar:
```bash
at-mos config set provider openai
at-mos config set provider anthropic
at-mos config set provider gemini
at-mos config set provider ollama  # local, open source
```

Guarda la API key localmente (en `~/.at-mos/config.json` o similar). No se sube a ningún lado.

**Por defecto:** Sin IA. Solo las funciones core. La IA es un add-on opcional que se activa cuando:
1. El usuario configura un provider + API key
2. Usa `--from <imagen>` o `--promrompt`

---

## 🏗️ Arquitectura Propuesta

```
src/
├── commands/
│   ├── init.ts          ← Mejorado con flujo IA
│   ├── list.ts          ← Igual
│   ├── update.ts        ← Igual
│   └── config.ts        ← NUEVO: configuración (provider, key, defaults)
├── core/
│   ├── detector.ts      ← Mejorado: más frameworks, más detecciones
│   ├── parser.ts        ← Mejorado: JSON anidado, Style Dictionary, W3C
│   ├── writer.ts        ← Igual, maybe más opciones de output
│   ├── prompts.ts       ← Mejorado: más preguntas contextuales
│   └── ai/
│       ├── provider.ts     ← NUEVO: abstracción de providers (OpenAI, Anthropic, etc.)
│       ├── screenshot.ts   ← NUEVO: prompt engineering para imágenes
│       ├── prompt-theme.ts ← NUEVO: prompt engineering para descripciones
│       └── url-scrape.ts   ← NUEVO: extracción de estilos desde URL
├── styles/
│   ├── gobal.css        ← (sí, el typo queda como inside joke 😂)
│   └── gobal.css.bak
├── utils/
│   ├── logger.ts
│   └── config-store.ts  ← NUEVO: manejo de config local
├── index.ts
```

---

## 📦 Mejoras de UX

### 8. Sugerencias inteligentes
- `at-mos suggest` — analiza el proyecto y sugiere tokens que faltan
- *"Veo que usas colores primarios #3490dc pero no tienes definidos colores de superficie ni de texto. ¿Quieres que genere sugerencias?"*

### 9. Modo CI/CD
- `at-mos init --json tokens.json --output src/app.css --yes` (non-interactive)
- Para pipelines de build, auto-generar el CSS sin intervención

### 10. Init de proyecto completo
- `at-mos new` — crea proyecto Tailwind v4 desde cero con `@theme` preconfigurado
- Pregunta: framework, package manager, paleta de colores → todo listo

### 11. Tailwind v4 intelligence
- Si detecta Tailwind v3, ofrecer migrar a v4
- Mostrar qué clases de v3 ya no existen y cómo migrarlas
- Integración con `@tailwindcss/upgrade`

### 12. Diff / preview
- Antes de escribir, mostrar diff del antes/después del CSS
- `at-mos diff` — ver cambios sin aplicar

---

## 🌐 Ecosystem

### 13. Integración Figma
- Via Plugin de Figma o API REST
- `at-mos figma pull <file-key>` — jala tokens de Tokens Studio
- `at-mos figma push <file-key>` — sube tokens modificados a Figma
- Autenticación con token personal de Figma

### 14. VS Code Extension
- `at-mos init` desde command palette
- Preview inline del `@theme`
- Color picker visual para los tokens
- Snippets para tokens comunes

### 15. Landing page
- at-mos.dev o similar
- Demos interactivos (codepen-style)
- Documentación visual
- Playground: "genera tu @theme en el browser"

---

## 🧪 Experimentos / Overkill

### 16. Reverse engineer
- Tomar un CSS de cualquier framework (Bootstrap, Material, Chakra, etc.) y extraer tokens
- `at-mos import --from bootstrap.css`
- Útil para migraciones: "traigo los colores de Bootstrap a mi @theme de Tailwind"

### 17. Design token health check
- `at-mos audit` — analiza el `@theme` actual y detecta:
  - Colores sin suficiente contraste
  - Tokens duplicados
  - Tokens definidos pero no usados
  - Sugerencias de nombres consistentes

### 18. Colaboración / Team mode
- Compartir tokens entre proyectos via `at-mos sync`
- Archivo central de tokens → todos los proyectos del equipo lo referencian
- `.at-mos/tokens.json` como fuente de verdad

### 19. Plugin system
- API de plugins para que cualquiera extienda at-mos
- Plugins: "exportar tokens a Tailwind v3 config", "exportar a CSS custom properties", etc.

---

## 📋 Checklist Ejecución

### Fase 1 — Core mejorado
- [ ] Parser recursivo de JSON anidado + Style Dictionary + W3C
- [ ] Más frameworks en el detector (Nuxt, Remix, Solid, Qwik, Laravel, Angular, Gatsby, etc.)
- [ ] Modo non-interactive (`--yes`) para CI/CD
- [ ] Soporte para `tokens.json` muy grandes (>1000 tokens) con filtrado inteligente

### Fase 2 — IA
- [ ] Sistema de providers abstraído (OpenAI, Anthropic, Gemini, Ollama)
- [ ] Config store local (`~/.at-mos/config.json`)
- [ ] `at-mos init --from screenshot.png`
- [ ] `at-mos init --prompt "descripción"`
- [ ] `at-mos init --from https://sitio.com`
- [ ] Prompt engineering fino para cada caso de uso

### Fase 3 — Ecosistema
- [ ] Integración Figma
- [ ] VS Code extension
- [ ] Landing page / docs
- [ ] Plugin system

---

## 💡 Notas Sueltas

- El nombre de archivo `gobal.css` se queda. Es un huevo de pascua ahora. 🥚
- Considerar cambiar el nombre del paquete de `@kevdev35/at-mos` a algo más público si se abre a comunidad.
- La IA debería funcionar 100% offline con Ollama. No todos quieren mandar screenshots a OpenAI.
- El CLI debería poder usarse sin Node.js eventualmente? (compilado binario single-file con Bun?)

---

*Última actualización: 2026-05-08*
*Hecho por Zeek 🔥 pa' Kev — porque los design tokens no deberían ser un pedo.*
