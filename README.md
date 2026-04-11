# AT-MOS ⚡

> Generate your Tailwind CSS @theme in seconds — no copy-paste, no guesswork.

**Stop writing the same CSS variables on every new project.**

[![npm version](https://img.shields.io/npm/v/@kevdev35/at-mos.svg?style=flat-square)](https://www.npmjs.com/package/@kevdev35/at-mos)
[![license](https://img.shields.io/npm/l/@kevdev35/at-mos.svg?style=flat-square)](./LICENSE)
[![node](https://img.shields.io/node/v/@kevdev35/at-mos.svg?style=flat-square)](https://nodejs.org)

---

You start a new project. You open `global.css`. You write `@theme {`. And then you spend the next 10 minutes copy-pasting colors, spacing values and font names from your last project — tweaking them, cleaning up leftovers, wondering if you missed something.

Every. Single. Time.

**at-mos fixes that.**

One command. It detects your framework, finds your CSS file, asks for your design tokens (colors, spacing, typography) — or reads them from a file you already have — and generates a clean, ready-to-use `global.css` with your `@theme` block. Then it gets out of your way.


```css
/* generated instantly */
@import 'tailwindcss';

@theme {
  --color-primary: #7c3aed;
  --color-secondary: #06b6d4;
  --spacing-base: 0.5rem;
  --font-sans: 'Syne', sans-serif;
}
```

## Try it now!

```bash
npx @kevdev35/at-mos init
```


---

## See it in action

```
$ npx @kevdev35/at-mos init

┌  at-mos — @theme generator for Tailwind v4
│
◇  Project analyzed
◆  Package manager: pnpm
◆  Framework: SvelteKit
◆  Tailwind: v4
│
◇  Generate CSS at src/app.css? Yes
│
◆  How do you want to define your variables?
●  Import from file (.json or .css)
│
◇  File path → tokens.json
◇  6 variables found. Select which to include:
  ✔ --color-primary
  ✔ --color-secondary
  ✔ --spacing-base
  ✗ --debug-outline
  ✔ --font-sans
│
◇  Backup saved → src/app.css.bak
✓  global.css generated
│
└  Your @theme is ready. Edit it anytime.
```

---

## Why at-mos

Tailwind v4 moved configuration from `tailwind.config.js` into CSS. That's a great decision — but it also means there's no tooling around it yet. You're back to doing everything by hand.

at-mos is that missing tool. It doesn't lock you in, doesn't generate opinionated defaults, and doesn't force any naming convention on you. It just asks what you want and writes it correctly.

Works with **Next.js, SvelteKit, Astro, Vue** — or any project, really, because at the end of the day it's just a CSS file.

---

## Install

```bash
# run once without installing
npx @kevdev35/at-mos init

# or install globally
npm i -g @kevdev35/at-mos
pnpm add -g @kevdev35/at-mos
bun add -g @kevdev35/at-mos
```

> Requires Node.js 18+

---

## Usage

### Interactive — define variables one by one

```bash
at-mos init
```

### Import from a JSON file

Great for design tokens from Figma, Style Dictionary, or your own system.

```json
{
  "color-primary": "#7c3aed",
  "color-secondary": "#06b6d4",
  "spacing-base": "0.5rem"
}
```

```bash
at-mos init --from tokens.json
```

Keys without `--` are auto-prefixed. You choose which variables make it into the output.

### Import from a CSS partial

```css
--color-primary: #7c3aed;
--spacing-base: 0.5rem;
```

```bash
at-mos init --from base-vars.css
```

### Custom output path

```bash
at-mos init --output src/styles/theme.css
```

### All flags

| Flag           | What it does                                   |
|----------------|------------------------------------------------|
| `--output, -o` | Set a custom output path                       |
| `--from`       | Import variables from a `.json` or `.css` file |
| `--version`    | Show current version                           |
| `--help`       | Show help                                      |

---

## What gets generated

A clean `global.css` — nothing extra, nothing you didn't ask for:

```css
@import 'tailwindcss';

@theme {
  --color-primary: #7c3aed;
  --color-secondary: #06b6d4;
  --spacing-base: 0.5rem;
}
```

If a CSS file already exists at the output path, at-mos saves a `.bak` copy before overwriting. You never lose previous work.

---

## Roadmap

**v1 — available now**
- [x] Auto-detection of framework, package manager and CSS path
- [x] Interactive variable definition
- [x] Import from `.json` or `.css`
- [x] Multiselect when importing from file
- [x] Automatic backup before overwriting
- [x] Custom output path via `--output`

**v2 — coming soon**
- [ ] AI-powered variable extraction from images (mockups, screenshots, design files)
- [ ] Bring your own API key — OpenAI, Anthropic, Gemini, Ollama
- [ ] No vendor lock-in, plug in whatever model you want

---

## Contributing

Found a bug? Have an idea? Want to add support for a new framework?

```bash
git clone https://github.com/Kevdev35/at-mos
cd at-mos
pnpm install
pnpm dev

# test it
node dist/index.js init
```

Open an issue before working on something big — just so we're aligned. PRs are welcome.

---

## License

MIT © [KevDev35](https://github.com/Kevdev35)