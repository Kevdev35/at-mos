#!/usr/bin/env node

// src/index.ts
import { Command } from "commander";
var program = new Command();
program.name("attheme").description("CLI para generar global.css con @theme para Tailwind v4").version("0.1.0");
program.command("init").description("Genera tu global.css con @theme").option("-o, --output <path>", "Ruta personalizada del archivo CSS").option("--from <file>", "Importar variables desde un .css o .json").action(async (options) => {
  const { init } = await import("./init-RANQSIND.js");
  await init(options);
});
program.parse();
