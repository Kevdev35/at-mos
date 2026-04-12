import * as p from '@clack/prompts'
import { detectEnv } from '../core/detector.js'
import { askInputMode, askFilePath, collectVariables, confirmOutput, askOutputPath, selectVariables } from '../core/prompts.js'
import { writeTheme } from '../core/writer.js'
import { parseFromFile } from '../core/parser.js'
import { logger } from '../utils/logger.js'

import { execSync } from 'child_process'

interface InitOptions {
  output?: string
  from?: string
}

export async function init(options: InitOptions) {
  p.intro('\x1b[35m@t\x1b[36mmos\x1b[0m — generador de @theme para Tailwind')

  // 1. Detectar entorno
  const spinner = p.spinner()
  spinner.start('Analizando tu proyecto...')
  const env = await detectEnv()
  spinner.stop('Proyecto analizado')

  logger.step(`Package manager: ${env.packageManager}`)
  logger.step(`Framework: ${env.framework}`)
  logger.step(`Tailwind: ${env.tailwindVersion}`)

  // 2. Verificar la instalacion de Tailwind

  if (env.tailwindVersion === 'not-installed') {
    const install = await p.confirm({
      message: 'Tailwind CSS no está instalado. ¿Quieres instalarlo ahora?',
      initialValue: true,
    })

    if (install) {
      const version = await p.select({
        message: 'Selecciona la versión a instalar:',
        options: [
          { value: 'npm install tailwindcss @tailwindcss/vite', label: 'Tailwind v4.2', hint: 'Recomendado para @theme' },
          { value: 'tailwindcss@latest', label: 'Tailwind v3 (Estable)', hint: 'No soporta @theme' },
        ],
      })

      if (p.isCancel(version)) {
        p.outro('Instalación cancelada.')
        return
      }

      const s = p.spinner()
      s.start(`Instalando ${version} con ${env.packageManager}...`)
      
      try {
        // Ejemplo: npm install tailwindcss@next
        const installCmd = `${env.packageManager} ${env.packageManager === 'yarn' ? 'add' : 'install'} ${version}`
        execSync(installCmd, { stdio: 'ignore' }) 
        s.stop('Instalación completada')
        logger.success(`Tailwind CSS instalado con éxito.`)
      } catch (e) {
        s.stop('Error en la instalación')
        logger.error('No se pudo instalar Tailwind. Por favor, hazlo manualmente.')
      }
    } else {
      logger.warn('Continuando sin instalar. El CSS generado podría no funcionar correctamente.')
    }
  } else if (env.tailwindVersion === '3') {
    logger.warn('Tienes Tailwind v3. @theme es exclusivo de v4+.')
    const upgrade = await p.confirm({
      message: '¿Deseas actualizar a la v4?',
      initialValue: false
    })
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
    try {
      spinner.start(`Leyendo variables desde ${options.from}...`)
      const parsed = await parseFromFile(options.from)
      spinner.stop(`${parsed.length} variables encontradas`)

      // Si quieres que sea 100% automático, podrías saltarte el 'selectVariables' 
      // cuando se usa el flag, pero dejarlo así permite confirmar qué se importa.
      variables = await selectVariables(parsed)
      logger.success(`${variables.length} variables seleccionadas`)
    } catch (error) {
      spinner.stop('Error al leer el archivo')
      logger.error(`No se pudo leer el archivo: ${options.from}. Revisa que la ruta sea correcta.`)
      p.outro('Operación fallida.')
      return // Salimos para no intentar escribir un archivo vacío
    }
  } else {
    // pregunta al usuario cómo quiere ingresar las variables
    const mode = await askInputMode()

  if (mode === 'file') {
    const filePath = await askFilePath()
    spinner.start(`Leyendo variables desde ${filePath}...`)
    const parsed = await parseFromFile(filePath)
    spinner.stop(`${parsed.length} variables encontradas`)

    variables = await selectVariables(parsed)
    logger.success(`${variables.length} variables seleccionadas`)
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