#!/usr/bin/env node
import {
  readTheme
} from "./chunk-KQCEJYZC.js";
import {
  askOutputPath,
  detectEnv,
  logger
} from "./chunk-ZQ7ZQPJD.js";

// src/commands/list.ts
import * as p from "@clack/prompts";
async function list(options) {
  p.intro("at-mos \u2014 variables en tu @theme");
  const spinner2 = p.spinner();
  spinner2.start("Buscando archivo CSS...");
  const env = await detectEnv();
  spinner2.stop("Proyecto analizado");
  let cssPath = options.output ?? env.cssCandidate;
  if (!cssPath) {
    logger.warn("No se encontr\xF3 un archivo CSS autom\xE1ticamente.");
    cssPath = await askOutputPath();
  }
  spinner2.start(`Leyendo variables desde ${cssPath}...`);
  const variables = await readTheme(cssPath);
  spinner2.stop(`${variables.length} variables encontradas`);
  if (variables.length === 0) {
    logger.warn("No se encontraron variables @theme en ese archivo.");
    p.outro("Sin variables.");
    return;
  }
  p.log.step(`Variables en ${cssPath}`);
  for (const { name, value } of variables) {
    p.log.info(`${name}: ${value}`);
  }
  p.outro(`${variables.length} variables listadas.`);
}
export {
  list
};
