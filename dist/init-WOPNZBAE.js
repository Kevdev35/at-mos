#!/usr/bin/env node

// src/commands/init.ts
import * as p3 from "@clack/prompts";

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
  return !p.isCancel(confirmed) && confirmed === true;
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

// src/core/writer.ts
import { existsSync as existsSync2 } from "fs";
import { copyFile, writeFile, mkdir } from "fs/promises";
import { dirname } from "path";
async function writeTheme(outputPath, variables) {
  await ensureDir(outputPath);
  await backup(outputPath);
  const css = generateCss(variables);
  await writeFile(outputPath, css, "utf-8");
}
async function ensureDir(filePath) {
  const dir = dirname(filePath);
  await mkdir(dir, { recursive: true });
}
async function backup(filePath) {
  if (existsSync2(filePath)) {
    await copyFile(filePath, `${filePath}.bak`);
  }
}
function generateCss(variables) {
  const vars = variables.map(({ name, value }) => `  ${name}: ${value};`).join("\n");
  return `@import 'tailwindcss';

@theme {
${vars}
}
`;
}

// src/core/parser.ts
import { readFile as readFile2 } from "fs/promises";
import { extname } from "path";
async function parseFromFile(filePath) {
  const ext = extname(filePath);
  if (ext === ".json") return parseJson(filePath);
  if (ext === ".css") return parseCss(filePath);
  throw new Error(`Formato no soportado: ${ext}. Usa .json o .css`);
}
async function parseJson(filePath) {
  const raw = await readFile2(filePath, "utf-8");
  const data = JSON.parse(raw);
  return Object.entries(data).map(([key, value]) => ({
    name: key.startsWith("--") ? key : `--${key}`,
    value: String(value)
  }));
}
async function parseCss(filePath) {
  const raw = await readFile2(filePath, "utf-8");
  const variables = [];
  const regex = /(--[\w-]+)\s*:\s*([^;]+);/g;
  let match;
  while ((match = regex.exec(raw)) !== null) {
    variables.push({
      name: match[1].trim(),
      value: match[2].trim()
    });
  }
  return variables;
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

// src/commands/init.ts
async function init(options) {
  p3.intro("attheme \u2014 generador de @theme para Tailwind v4");
  const spinner2 = p3.spinner();
  spinner2.start("Analizando tu proyecto...");
  const env = await detectEnv();
  spinner2.stop("Proyecto analizado");
  logger.step(`Package manager: ${env.packageManager}`);
  logger.step(`Framework: ${env.framework}`);
  logger.step(`Tailwind: ${env.tailwindVersion}`);
  if (env.tailwindVersion === "not-installed") {
    logger.warn("Tailwind CSS no detectado. El CSS generado usar\xE1 @theme de todas formas.");
  } else if (env.tailwindVersion === "3") {
    logger.warn("Tienes Tailwind v3. @theme es exclusivo de v4+.");
  }
  let outputPath = options.output ?? env.cssCandidate;
  if (!outputPath) {
    logger.warn("No se encontr\xF3 un archivo CSS autom\xE1ticamente.");
    outputPath = await askOutputPath();
  } else {
    const confirmed = await confirmOutput(outputPath);
    if (!confirmed) outputPath = await askOutputPath();
  }
  let variables = [];
  if (options.from) {
    spinner2.start(`Leyendo variables desde ${options.from}...`);
    const parsed = await parseFromFile(options.from);
    spinner2.stop(`${parsed.length} variables encontradas`);
    variables = await selectVariables(parsed);
    logger.success(`${variables.length} variables seleccionadas`);
  } else {
    const mode = await askInputMode();
    if (mode === "file") {
      const filePath = await askFilePath();
      spinner2.start(`Leyendo variables desde ${filePath}...`);
      const parsed = await parseFromFile(filePath);
      spinner2.stop(`${parsed.length} variables encontradas`);
      variables = await selectVariables(parsed);
      logger.success(`${variables.length} variables seleccionadas`);
    } else {
      variables = await collectVariables();
    }
  }
  if (variables.length === 0) {
    logger.warn("No se defini\xF3 ninguna variable. Operaci\xF3n cancelada.");
    p3.outro("Sin cambios.");
    return;
  }
  spinner2.start("Generando tu global.css...");
  await writeTheme(outputPath, variables);
  spinner2.stop("Listo");
  logger.success(`CSS generado en ${outputPath}`);
  p3.outro("\xA1Tu @theme est\xE1 listo! Ed\xEDtalo cuando quieras.");
}
export {
  init
};
