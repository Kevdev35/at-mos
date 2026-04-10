import * as p from '@clack/prompts'
import { detectEnv } from '../core/detector.js'
import { askInputMode, askFilePath, collectVariables, confirmOutput, askOutputPath } from '../core/prompts.js'
import { writeTheme } from '../core/writer.js'
import { parseFromFile } from '../core/parser.js'
import { logger } from '../utils/logger.js'

interface InitOptions {
  output?: string
  from?: string
}

export async function init(options: InitOptions) {
  p.intro('attheme — generador de @theme para Tailwind v4')

  // 1. Detectar entorno
  const spinner = p.spinner()
  spinner.start('Analizando tu proyecto...')
  const env = await detectEnv()
  spinner.stop('Proyecto analizado')

  logger.step(`Package manager: ${env.packageManager}`)
  logger.step(`Framework: ${env.framework}`)
  logger.step(`Tailwind: ${env.tailwindVersion}`)

  // 2. Advertencias
  if (env.tailwindVersion === 'not-installed') {
    logger.warn('Tailwind CSS no detectado. El CSS generado usará @theme de todas formas.')
  } else if (env.tailwindVersion === '3') {
    logger.warn('Tienes Tailwind v3. @theme es exclusivo de v4+.')
  }

  // 3. Resolver ruta de salida
  let outputPath = options.output ?? env.cssCandidate

  if (!outputPath) {
    logger.warn('No se encontró un archivo CSS automáticamente.')
    outputPath = await askOutputPath()
  } else {
    const confirmed = await confirmOutput(outputPath)
    if (!confirmed) outputPath = await askOutputPath()
  }

  // 4. Obtener variables — flujo unificado
  let variables: { name: string; value: string }[] = []

  if (options.from) {
    // viene del flag --from
    spinner.start(`Leyendo variables desde ${options.from}...`)
    variables = await parseFromFile(options.from)
    spinner.stop(`${variables.length} variables importadas`)
  } else {
    // pregunta al usuario cómo quiere ingresar las variables
    const mode = await askInputMode()

    if (mode === 'file') {
      const filePath = await askFilePath()
      spinner.start(`Leyendo variables desde ${filePath}...`)
      variables = await parseFromFile(filePath)
      spinner.stop(`${variables.length} variables importadas`)
    } else {
      variables = await collectVariables()
    }
  }

  // 5. Validar que haya variables
  if (variables.length === 0) {
    logger.warn('No se definió ninguna variable. Operación cancelada.')
    p.outro('Sin cambios.')
    return
  }

  // 6. Escribir CSS
  spinner.start('Generando tu global.css...')
  await writeTheme(outputPath, variables)
  spinner.stop('Listo')

  logger.success(`CSS generado en ${outputPath}`)
  p.outro('¡Tu @theme está listo! Edítalo cuando quieras.')
}