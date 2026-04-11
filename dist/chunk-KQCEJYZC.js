#!/usr/bin/env node

// src/core/reader.ts
import { existsSync } from "fs";
import { readFile } from "fs/promises";
async function readTheme(filePath) {
  if (!existsSync(filePath)) {
    throw new Error(`Archivo no encontrado: ${filePath}`);
  }
  const raw = await readFile(filePath, "utf-8");
  return extractThemeVariables(raw);
}
function extractThemeVariables(css) {
  const variables = [];
  const themeBlock = css.match(/@theme\s*\{([^}]*)\}/s);
  if (!themeBlock) return variables;
  const regex = /(--[\w-]+)\s*:\s*([^;]+);/g;
  let match;
  while ((match = regex.exec(themeBlock[1])) !== null) {
    variables.push({
      name: match[1].trim(),
      value: match[2].trim()
    });
  }
  return variables;
}

export {
  readTheme
};
