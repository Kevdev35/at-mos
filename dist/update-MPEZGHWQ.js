#!/usr/bin/env node
import {
  writeTheme
} from "./chunk-LVUS4EHC.js";
import {
  readTheme
} from "./chunk-KQCEJYZC.js";
import {
  askOutputPath,
  detectEnv,
  logger
} from "./chunk-ZQ7ZQPJD.js";

// src/commands/update.ts
import * as p from "@clack/prompts";
async function update(options) {
  p.intro("at-mos \u2014 actualizar @theme");
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
  if (variables.length > 0) {
    p.log.step("Variables actuales:");
    for (const { name, value } of variables) {
      p.log.info(`${name}: ${value}`);
    }
  }
  const action = await p.select({
    message: "\xBFQu\xE9 quieres hacer?",
    options: [
      { value: "add", label: "Agregar una variable nueva" },
      { value: "edit", label: "Modificar una variable existente", hint: variables.length === 0 ? "no hay variables a\xFAn" : "" },
      { value: "delete", label: "Eliminar una variable", hint: variables.length === 0 ? "no hay variables a\xFAn" : "" }
    ]
  });
  if (p.isCancel(action)) process.exit(0);
  let updated = [...variables];
  if (action === "add") {
    updated = await handleAdd(variables);
  } else if (action === "edit") {
    if (variables.length === 0) {
      logger.warn("No hay variables para modificar.");
      p.outro("Sin cambios.");
      return;
    }
    updated = await handleEdit(variables);
  } else if (action === "delete") {
    if (variables.length === 0) {
      logger.warn("No hay variables para eliminar.");
      p.outro("Sin cambios.");
      return;
    }
    updated = await handleDelete(variables);
  }
  spinner2.start("Guardando cambios...");
  await writeTheme(cssPath, updated);
  spinner2.stop("Listo");
  logger.success(`@theme actualizado en ${cssPath}`);
  p.outro("Cambios guardados.");
}
async function handleAdd(variables) {
  const name = await p.text({
    message: "Nombre de la variable",
    placeholder: "--color-accent",
    validate: (val) => {
      if (!val) return "El nombre no puede estar vac\xEDo";
      if (!val.startsWith("--")) return "Debe empezar con --";
      if (variables.some((v) => v.name === val)) return 'Esa variable ya existe, usa "Modificar"';
    }
  });
  if (p.isCancel(name)) process.exit(0);
  const value = await p.text({
    message: `Valor para ${name}`,
    placeholder: "#ff0000",
    validate: (val) => {
      if (!val) return "El valor no puede estar vac\xEDo";
    }
  });
  if (p.isCancel(value)) process.exit(0);
  return [...variables, { name, value }];
}
async function handleEdit(variables) {
  const selected = await p.select({
    message: "\xBFCu\xE1l variable quieres modificar?",
    options: variables.map((v) => ({
      value: v.name,
      label: v.name,
      hint: v.value
    }))
  });
  if (p.isCancel(selected)) process.exit(0);
  const current = variables.find((v) => v.name === selected);
  const newValue = await p.text({
    message: `Nuevo valor para ${selected}`,
    placeholder: current.value,
    validate: (val) => {
      if (!val) return "El valor no puede estar vac\xEDo";
    }
  });
  if (p.isCancel(newValue)) process.exit(0);
  return variables.map(
    (v) => v.name === selected ? { ...v, value: newValue } : v
  );
}
async function handleDelete(variables) {
  const selected = await p.multiselect({
    message: "\xBFCu\xE1les variables quieres eliminar?",
    options: variables.map((v) => ({
      value: v.name,
      label: v.name,
      hint: v.value
    })),
    required: true
  });
  if (p.isCancel(selected)) process.exit(0);
  const toDelete = selected;
  const confirmed = await p.confirm({
    message: `\xBFEliminar ${toDelete.length} variable(s)? Esta acci\xF3n no se puede deshacer.`,
    initialValue: false
  });
  if (p.isCancel(confirmed) || !confirmed) {
    p.log.warn("Operaci\xF3n cancelada.");
    return variables;
  }
  return variables.filter((v) => !toDelete.includes(v.name));
}
export {
  update
};
