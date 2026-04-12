#!/usr/bin/env node

// src/index.ts
import { Command } from "commander";
var program = new Command();
program.name("at-mos").description("CLI para generar global.css con @theme para Tailwind v4").version("1.1.0", "-v, --version", "Muestra la versi\xF3n de @t-mos");
program.command("init").description("Genera tu global.css con @theme").option("-o, --output <path>", "Ruta personalizada del archivo CSS").option("-f, --from <file>", "Importar variables desde .json o .css").action(async (options) => {
  const { init } = await import("./init-JQCC4RBA.js");
  await init(options);
});
program.command("list").description("Muestra las variables CSS definidas en tu @theme").option("-o, --output <path>", "Ruta personalizada del archivo CSS").action(async (options) => {
  const { list } = await import("./list-VTL43BC5.js");
  await list(options);
});
program.command("update").description("Agrega, modifica o elimina variables en tu @theme").option("-o, --output <path>", "Ruta personalizada del archivo CSS").action(async (options) => {
  const { update } = await import("./update-MPEZGHWQ.js");
  await update(options);
});
program.command("version").description("Muestra la versi\xF3n de @t-mos").option("-v", "Especifica la versi\xF3n a mostrar").option("--version <char>", "Especifica la versi\xF3n a mostrar").option("--v <char>", "Especifica la versi\xF3n a mostrar").action(() => {
  console.log(`\x1B[35m@t\x1B[36mmos\x1B[0m \x1B[2mv${program.version()}\x1B[0m`);
});
program.parse();
