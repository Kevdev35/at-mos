import { readFile } from 'fs/promises'
import { extname } from 'path'
import type { ThemeVariable } from './writer.js'

export async function parseFromFile(filePath: string): Promise<ThemeVariable[]> {
  const ext = extname(filePath)

  if (ext === '.json') return parseJson(filePath)
  if (ext === '.css') return parseCss(filePath)

  throw new Error(`Formato no soportado: ${ext}. Usa .json o .css`)
}

async function parseJson(filePath: string): Promise<ThemeVariable[]> {
  const raw = await readFile(filePath, 'utf-8')
  const data = JSON.parse(raw)

  return Object.entries(data).map(([key, value]) => ({
    name: key.startsWith('--') ? key : `--${key}`,
    value: String(value)
  }))
}

async function parseCss(filePath: string): Promise<ThemeVariable[]> {
  const raw = await readFile(filePath, 'utf-8')
  const variables: ThemeVariable[] = []

  const regex = /(--[\w-]+)\s*:\s*([^;]+);/g
  let match

  while ((match = regex.exec(raw)) !== null) {
    variables.push({
      name: match[1].trim(),
      value: match[2].trim()
    })
  }

  return variables
}