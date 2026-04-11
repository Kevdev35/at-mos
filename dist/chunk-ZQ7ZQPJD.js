#!/usr/bin/env node

// src/core/detector.ts
import { existsSync } from "fs";
import { readFile } from "fs/promises";
import { readdirSync } from "fs";
import { join } from "path";
async function detectEnv() {
  const packageManager = detectPackageManager();
  const framework = await detectFramework();
  const tailwindVersion = await detectTailwind();
  const cssCandidate = detectCssCandidate(framework);
  return { packageManager, framework, tailwindVersion, cssCandidate };
}
function detectPackageManager() {
  if (existsSync("pnpm-lock.yaml")) return "pnpm";
  if (existsSync("bun.lockb")) return "bun";
  if (existsSync("yarn.lock")) return "yarn";
  return "npm";
}
async function detectFramework() {
  if (!existsSync("package.json")) return "unknown";
  const raw = await readFile("package.json", "utf-8");
  const pkg = JSON.parse(raw);
  const deps = {
    ...pkg.dependencies,
    ...pkg.devDependencies
  };
  if (deps["next"]) return "nextjs";
  if (deps["@sveltejs/kit"]) return "sveltekit";
  if (deps["astro"]) return "astro";
  if (deps["vue"]) return "vue";
  return "unknown";
}
async function detectTailwind() {
  if (!existsSync("package.json")) return "not-installed";
  const raw = await readFile("package.json", "utf-8");
  const pkg = JSON.parse(raw);
  const deps = {
    ...pkg.dependencies,
    ...pkg.devDependencies
  };
  const version = deps["tailwindcss"];
  if (!version) return "not-installed";
  if (version.startsWith("4") || version.startsWith("^4")) return "4";
  return "3";
}
function detectCssCandidate(framework) {
  const candidates = {
    nextjs: ["src/app/globals.css", "app/globals.css"],
    sveltekit: ["src/app.css", "src/styles/app.css"],
    astro: ["src/styles/global.css", "src/global.css"],
    vue: ["src/assets/main.css", "src/style.css"],
    unknown: [
      "src/styles/global.css",
      "src/global.css",
      "global.css",
      "src/app.css",
      "src/index.css",
      "src/style.css",
      "src/styles/main.css"
    ]
  };
  for (const candidate of candidates[framework]) {
    if (existsSync(candidate)) return candidate;
  }
  return scanForCss("src");
}
function scanForCss(dir) {
  if (!existsSync(dir)) return null;
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isFile() && entry.name.endsWith(".css")) return fullPath;
    if (entry.isDirectory()) {
      const found = scanForCss(fullPath);
      if (found) return found;
    }
  }
  return null;
}

// src/core/prompts.ts
import * as p from "@clack/prompts";
async function askInputMode() {
  const mode = await p.select({
    message: "\xBFC\xF3mo quieres definir tus variables?",
    options: [
      { value: "manual", label: "Manualmente, una por una" },
      { value: "file", label: "Importar desde archivo (.json o .css)" }
    ]
  });
  if (p.isCancel(mode)) process.exit(0);
  return mode;
}
async function askFilePath() {
  const path = await p.text({
    message: "Ruta del archivo de variables",
    placeholder: "tokens.json  o  base-vars.css",
    validate: (val) => {
      if (!val) return "La ruta no puede estar vac\xEDa";
      if (!val.endsWith(".json") && !val.endsWith(".css"))
        return "Solo se aceptan archivos .json";
    }
  });
  if (p.isCancel(path)) process.exit(0);
  return path;
}
async function collectVariables() {
  const variables = [];
  p.log.step("Defin\xED tus variables CSS");
  while (true) {
    const name = await p.text({
      message: "Nombre de la variable",
      placeholder: "--color-primary",
      validate: (val) => {
        if (!val) return "El nombre no puede estar vac\xEDo";
        if (!val.startsWith("--")) return "Debe empezar con --";
      }
    });
    if (p.isCancel(name)) break;
    const value = await p.text({
      message: `Valor para ${name}`,
      placeholder: "#3b82f6",
      validate: (val) => {
        if (!val) return "El valor no puede estar vac\xEDo";
      }
    });
    if (p.isCancel(value)) break;
    variables.push({ name, value });
    const another = await p.confirm({
      message: "\xBFAgregar otra variable?",
      initialValue: true
    });
    if (p.isCancel(another) || !another) break;
  }
  return variables;
}
async function confirmOutput(path) {
  const confirmed = await p.confirm({
    message: `\xBFGenerar el CSS en ${path}?`,
    initialValue: true
  });
  if (p.isCancel(confirmed)) process.exit(0);
  return confirmed;
}
async function askOutputPath() {
  const path = await p.text({
    message: "Ruta del archivo CSS de salida",
    placeholder: "src/styles/global.css",
    validate: (val) => {
      if (!val) return "La ruta no puede estar vac\xEDa";
      if (!val.endsWith(".css")) return "Debe ser un archivo .css";
    }
  });
  if (p.isCancel(path)) process.exit(0);
  return path;
}
async function selectVariables(variables) {
  const selected = await p.multiselect({
    message: `Se encontraron ${variables.length} variables. \xBFCu\xE1les quieres incluir?`,
    options: variables.map((v) => ({
      value: v,
      label: v.name,
      hint: v.value
    })),
    required: true
  });
  if (p.isCancel(selected)) process.exit(0);
  return selected;
}

// src/utils/logger.ts
import * as p2 from "@clack/prompts";
var logger = {
  info: (msg) => p2.log.info(msg),
  success: (msg) => p2.log.success(msg),
  warn: (msg) => p2.log.warn(msg),
  error: (msg) => p2.log.error(msg),
  step: (msg) => p2.log.step(msg)
};

export {
  detectEnv,
  askInputMode,
  askFilePath,
  collectVariables,
  confirmOutput,
  askOutputPath,
  selectVariables,
  logger
};
