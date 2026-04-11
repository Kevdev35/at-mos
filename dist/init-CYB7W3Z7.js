#!/usr/bin/env node
import {
  writeTheme
} from "./chunk-LVUS4EHC.js";
import {
  askFilePath,
  askInputMode,
  askOutputPath,
  collectVariables,
  confirmOutput,
  detectEnv,
  logger,
  selectVariables
} from "./chunk-ZQ7ZQPJD.js";

// src/commands/init.ts
import * as p from "@clack/prompts";

// src/core/parser.ts
import { readFile } from "fs/promises";
import { extname } from "path";
async function parseFromFile(filePath) {
  const ext = extname(filePath);
  if (ext === ".json") return parseJson(filePath);
  if (ext === ".css") return parseCss(filePath);
  throw new Error(`Formato no soportado: ${ext}. Usa .json o .css`);
}
async function parseJson(filePath) {
  const raw = await readFile(filePath, "utf-8");
  const data = JSON.parse(raw);
  return Object.entries(data).map(([key, value]) => ({
    name: key.startsWith("--") ? key : `--${key}`,
    value: String(value)
  }));
}
async function parseCss(filePath) {
  const raw = await readFile(filePath, "utf-8");
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

// src/commands/init.ts
async function init(options) {
  p.intro("attheme \u2014 generador de @theme para Tailwind v4");
  const spinner2 = p.spinner();
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
    p.outro("Sin cambios.");
    return;
  }
  spinner2.start("Generando tu global.css...");
  await writeTheme(outputPath, variables);
  spinner2.stop("Listo");
  logger.success(`CSS generado en ${outputPath}`);
  p.outro("\xA1Tu @theme est\xE1 listo! Ed\xEDtalo cuando quieras.");
}
export {
  init
};
