import * as p from '@clack/prompts'
import { detectEnv } from '../core/detector.js'
import { askOutputPath } from '../core/prompts.js'
import { readTheme } from '../core/reader.js'
import { logger } from '../utils/logger.js'

interface ListOptions {
  output?: string
}

export async function list(options: ListOptions) {
  p.intro('at-mos — variables en tu @theme')

  const spinner = p.spinner()
  spinner.start('Buscando archivo CSS...')
  const env = await detectEnv()
  spinner.stop('Proyecto analizado')

  let cssPath = options.output ?? env.cssCandidate

  if (!cssPath) {
    logger.warn('No se encontró un archivo CSS automáticamente.')
    cssPath = await askOutputPath()
  }

  spinner.start(`Leyendo variables desde ${cssPath}...`)
  const variables = await readTheme(cssPath)
  spinner.stop(`${variables.length} variables encontradas`)

  if (variables.length === 0) {
    logger.warn('No se encontraron variables @theme en ese archivo.')
    p.outro('Sin variables.')
    return
  }

  p.log.step(`Variables en ${cssPath}`)

  for (const { name, value } of variables) {
    p.log.info(`${name}: ${value}`)
  }

  p.outro(`${variables.length} variables listadas.`)
}