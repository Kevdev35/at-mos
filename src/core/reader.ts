import { existsSync } from 'fs'
import { readFile } from 'fs/promises'
import type { ThemeVariable } from './writer.js'

export async function readTheme(filePath: string): Promise<ThemeVariable[]> {
  if (!existsSync(filePath)) {
    throw new Error(`Archivo no encontrado: ${filePath}`)
  }

  const raw = await readFile(filePath, 'utf-8')
  return extractThemeVariables(raw)
}

export function extractThemeVariables(css: string): ThemeVariable[] {
  const variables: ThemeVariable[] = []

  const themeBlock = css.match(/@theme\s*\{([^}]*)\}/s)
  if (!themeBlock) return variables

  const regex = /(--[\w-]+)\s*:\s*([^;]+);/g
  let match

  while ((match = regex.exec(themeBlock[1])) !== null) {
    variables.push({
      name: match[1].trim(),
      value: match[2].trim()
    })
  }

  return variables
}