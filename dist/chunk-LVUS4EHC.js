#!/usr/bin/env node

// src/core/writer.ts
import { existsSync } from "fs";
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
  if (existsSync(filePath)) {
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

export {
  writeTheme
};
