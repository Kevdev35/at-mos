# at-mos ⚡

> Interactive CLI to generate your `global.css` with `@theme` for Tailwind CSS v4+

[![npm version](https://img.shields.io/npm/v/@kevdev35/at-mos.svg?style=flat-square)](https://www.npmjs.com/package/@kevdev35/at-mos)
[![license](https://img.shields.io/npm/l/@kevdev35/at-mos.svg?style=flat-square)](./LICENSE)
[![node](https://img.shields.io/node/v/@kevdev35/at-mos.svg?style=flat-square)](https://nodejs.org)

---

## What is at-mos?

**at-mos** is an interactive CLI that generates your `global.css` with custom CSS variables inside a `@theme` block — ready for Tailwind CSS v4. No more manual copy-pasting, no more messy config files.

It detects your environment automatically (framework, package manager, CSS path) and guides you step by step. You can define variables interactively, or import them from a `.json` or `.css` file.

```css
@import 'tailwindcss';

@theme {
  --color-primary: #7c3aed;
  --color-secondary: #06b6d4;
  --spacing-base: 0.5rem;
}
```

---

## Requirements

- Node.js 18+
- Any project using Tailwind CSS v4 (or planning to)

---

## Quick start

```bash
npx @kevdev35/at-mos init
```

No installation required. Just run it in your project root.

---

## Installation

```bash
# npm
npm install -g @kevdev35/at-mos

# pnpm
pnpm add -g @kevdev35/at-mos

# bun
bun add -g @kevdev35/at-mos
```

---

## Usage

### Interactive mode

```bash
at-mos init
```

The CLI will:
1. Detect your package manager, framework and CSS path
2. Ask how you want to define your variables (manually or from a file)
3. Generate your `global.css` with a backup of the previous one

### Import from file

```bash
# from JSON
at-mos init --from tokens.json

# from CSS partial
at-mos init --from base-vars.css
```

When importing from a file, at-mos shows all found variables and lets you select which ones to include.

### Custom output path

```bash
at-mos init --output src/styles/theme.css
```

### Development mode (from source)

```bash
pnpm build
node dist/index.js init
```

---

## Supported input formats

### JSON

Keys are automatically prefixed with `--` if not already present.

```json
{
  "color-primary": "#7c3aed",
  "color-secondary": "#06b6d4",
  "--spacing-base": "0.5rem"
}
```

### CSS partial

Any file with CSS custom properties.

```css
--color-primary: #7c3aed;
--color-secondary: #06b6d4;
--spacing-base: 0.5rem;
```

---

## Framework support

at-mos works with any framework because it only writes standard CSS. Auto-detection is available for:

| Framework  | Default CSS path             |
|------------|------------------------------|
| Next.js    | `src/app/globals.css`        |
| SvelteKit  | `src/app.css`                |
| Astro      | `src/styles/global.css`      |
| Vue        | `src/assets/main.css`        |
| Unknown    | Auto-scan of `src/` directory |

---

## Options

| Flag              | Description                                      |
|-------------------|--------------------------------------------------|
| `--output, -o`    | Custom path for the output CSS file              |
| `--from`          | Import variables from a `.json` or `.css` file   |
| `--version, -v`   | Show current version                             |
| `--help, -h`      | Show help                                        |

---

## Contributing

Contributions are welcome! If you find a bug, have a feature idea or want to add support for a new framework, feel free to open an issue or a PR.

```bash
# 1. Fork and clone
git clone https://github.com/Kevdev35/at-mos

# 2. Install dependencies
pnpm install

# 3. Dev mode
pnpm dev

# 4. Test locally
node dist/index.js init
```

### Tech stack

- **TypeScript** — type safety across all modules
- **tsup** — zero-config bundler
- **commander** — CLI commands and flags
- **@clack/prompts** — interactive terminal UI
- **picocolors** — terminal colors
- **fs-extra** — file system utilities

> Coming in v2: AI-powered variable extraction from images (OpenAI, Anthropic, Gemini, Ollama — bring your own API key)

---

## License

MIT © [KevDev35](https://github.com/Kevdev35)

---

---

# at-mos ⚡

> CLI interactiva para generar tu `global.css` con `@theme` para Tailwind CSS v4+

---

## ¿Qué es at-mos?

**at-mos** es una CLI interactiva que genera tu `global.css` con variables CSS personalizadas dentro de un bloque `@theme` — lista para Tailwind CSS v4. Sin copy-paste manual, sin archivos de configuración desordenados.

Detecta tu entorno automáticamente (framework, gestor de paquetes, ruta del CSS) y te guía paso a paso. Puedes definir las variables de forma interactiva, o importarlas desde un archivo `.json` o `.css`.

```css
@import 'tailwindcss';

@theme {
  --color-primary: #7c3aed;
  --color-secondary: #06b6d4;
  --spacing-base: 0.5rem;
}
```

---

## Requisitos

- Node.js 18+
- Cualquier proyecto con Tailwind CSS v4 (o que planee usarlo)

---

## Inicio rápido

```bash
npx @kevdev35/at-mos init
```

Sin instalación previa. Ejecútalo en la raíz de tu proyecto.

---

## Instalación

```bash
# npm
npm install -g @kevdev35/at-mos

# pnpm
pnpm add -g @kevdev35/at-mos

# bun
bun add -g @kevdev35/at-mos
```

---

## Uso

### Modo interactivo

```bash
at-mos init
```

La CLI va a:
1. Detectar tu gestor de paquetes, framework y ruta del CSS
2. Preguntarte cómo quieres definir tus variables (manual o desde archivo)
3. Generar tu `global.css` con un backup del archivo anterior

### Importar desde archivo

```bash
# desde JSON
at-mos init --from tokens.json

# desde CSS parcial
at-mos init --from base-vars.css
```

Al importar desde archivo, at-mos muestra todas las variables encontradas y te deja elegir cuáles incluir.

### Ruta de salida personalizada

```bash
at-mos init --output src/styles/theme.css
```

### Modo desarrollo (desde el código fuente)

```bash
pnpm build
node dist/index.js init
```

---

## Formatos de entrada soportados

### JSON

Las claves se prefijan automáticamente con `--` si no lo tienen.

```json
{
  "color-primary": "#7c3aed",
  "color-secondary": "#06b6d4",
  "--spacing-base": "0.5rem"
}
```

### CSS parcial

Cualquier archivo con custom properties CSS.

```css
--color-primary: #7c3aed;
--color-secondary: #06b6d4;
--spacing-base: 0.5rem;
```

---

## Soporte de frameworks

at-mos funciona con cualquier framework porque solo escribe CSS estándar. La detección automática está disponible para:

| Framework  | Ruta CSS por defecto         |
|------------|------------------------------|
| Next.js    | `src/app/globals.css`        |
| SvelteKit  | `src/app.css`                |
| Astro      | `src/styles/global.css`      |
| Vue        | `src/assets/main.css`        |
| Desconocido | Escaneo automático de `src/` |

---

## Opciones

| Flag              | Descripción                                          |
|-------------------|------------------------------------------------------|
| `--output, -o`    | Ruta personalizada del archivo CSS de salida         |
| `--from`          | Importar variables desde un archivo `.json` o `.css` |
| `--version, -v`   | Mostrar versión actual                               |
| `--help, -h`      | Mostrar ayuda                                        |

---

## Contribuir

¡Las contribuciones son bienvenidas! Si encontraste un bug, tienes una idea de feature o quieres agregar soporte para un nuevo framework, abre un issue o un PR.

```bash
# 1. Fork y clonar
git clone https://github.com/Kevdev35/at-mos

# 2. Instalar dependencias
pnpm install

# 3. Modo desarrollo
pnpm dev

# 4. Probar localmente
node dist/index.js init
```

> En v2: extracción de variables desde imágenes con IA (OpenAI, Anthropic, Gemini, Ollama — trae tu propia API key)

---

## Licencia

MIT © [KevDev35](https://github.com/Kevdev35)