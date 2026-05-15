import { readFile } from 'fs/promises'
import { extname } from 'path'
import type { ThemeVariable } from './writer.js'

// ──────────────────────────────────────────────
// Tipos que puede tener un valor en tokens.json
// ──────────────────────────────────────────────

type TokenValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | { $value?: unknown; $type?: string; [key: string]: unknown }
  | { value?: unknown; type?: string; [key: string]: unknown }
  | { [key: string]: unknown }

// ──────────────────────────────────────────────
// Parseo principal (delega según extensión)
// ──────────────────────────────────────────────

export async function parseFromFile(filePath: string): Promise<ThemeVariable[]> {
  const ext = extname(filePath)

  if (ext === '.json') return parseJson(filePath)
  if (ext === '.css') return parseCss(filePath)

  throw new Error(`Formato no soportado: ${ext}. Usa .json o .css`)
}

// ──────────────────────────────────────────────
// Parseo JSON — plano, anidado, Style Dictionary, W3C
// ──────────────────────────────────────────────

async function parseJson(filePath: string): Promise<ThemeVariable[]> {
  const raw = await readFile(filePath, 'utf-8')
  const data = JSON.parse(raw)
  return flattenTokens(data, '')
}

/**
 * Aplana recursivamente un objeto de tokens.
 *
 * Soporta:
 *   - { "color-primary": "#hex" }              → plano
 *   - { color: { primary: "#hex" } }            → anidado simple
 *   - { color: { primary: { value: "#hex" } } } → Style Dictionary
 *   - { color: { primary: { $value: "#hex" } } }→ W3C DTCG
 *   - { value: { light: "...", dark: "..." } }  → modo (aplanado con sufijo)
 */
function flattenTokens(
  obj: Record<string, TokenValue>,
  prefix: string,
): ThemeVariable[] {
  const result: ThemeVariable[] = []

  for (const [key, value] of Object.entries(obj)) {
    // Saltar keys de metadata que no son tokens
    if (key === '$schema' || key === '$description') continue

    const joinedKey = prefix ? `${prefix}-${key}` : key

    if (value === null || value === undefined) continue

    // ── String / Number → token directo ──
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      result.push({
        name: `--${joinedKey}`,
        value: String(value),
      })
      continue
    }

    // ── Object ──
    if (typeof value === 'object' && !Array.isArray(value)) {
      const objValue = value as Record<string, unknown>

      // W3C format: { $value: "...", $type: "..." }
      if ('$value' in objValue) {
        const resolved = resolveValue(objValue.$value, joinedKey)
        if (resolved) result.push(...resolved)
        continue
      }

      // Style Dictionary: { value: "...", type: "..." }
      if ('value' in objValue && !isPlainNs(objValue)) {
        const resolved = resolveValue(objValue.value, joinedKey)
        if (resolved) result.push(...resolved)
        continue
      }

      // Namespace → recursión
      result.push(...flattenTokens(objValue as Record<string, TokenValue>, joinedKey))
      continue
    }

    // ── Array → no se puede representar como CSS custom property simple ──
    //   (shadows, fonts compuestos, etc.) — se omiten silenciosamente
    if (Array.isArray(value)) continue
  }

  return result
}

/**
 * Determina si un objeto es un "namespace" (tiene varias keys hijas
 * sin que ninguna sea `value`/`$value` explícito).
 */
function isPlainNs(obj: Record<string, unknown>): boolean {
  const keys = Object.keys(obj)
  if (keys.length === 0) return true

  // Si además de `value` tiene otras keys hijas sustantivas, es namespace.
  // Sólo si tiene exclusivamente `value` (y opcionalmente `type`/`description`) es Style Dictionary.
  const metaKeys = new Set(['value', 'type', '$value', '$type', 'description', '$description'])
  const hasExplicitValue = 'value' in obj || '$value' in obj
  const hasNonMetaKeys = keys.some(k => !metaKeys.has(k))

  return !(hasExplicitValue && !hasNonMetaKeys)
}

/**
 * Resuelve el "value" de un token, que puede ser:
 *   - string         → token normal
 *   - { light, dark } → token por modo (se aplana con sufijo)
 */
function resolveValue(
  raw: unknown,
  prefix: string,
): ThemeVariable[] | null {
  if (raw === null || raw === undefined) return null

  // Valor directo
  if (typeof raw === 'string' || typeof raw === 'number' || typeof raw === 'boolean') {
    return [{ name: `--${prefix}`, value: String(raw) }]
  }

  // Array → no podemos representarlo en CSS plano, omitimos
  if (Array.isArray(raw)) return null

  // Objeto → probablemente tokens por modo (light/dark/hover/etc.)
  if (typeof raw === 'object') {
    const modeObj = raw as Record<string, unknown>
    const entries = Object.entries(modeObj)

    // Si está vacío → omitir
    if (entries.length === 0) return null

    // Si es single-entry → usar directamente
    if (entries.length === 1) {
      const [, val] = entries[0]
      if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') {
        return [{ name: `--${prefix}`, value: String(val) }]
      }
      return null
    }

    // Múltiples modos → aplanar con sufijo: --color-surface-light, --color-surface-dark
    const resolved: ThemeVariable[] = []
    for (const [mode, val] of entries) {
      if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') {
        resolved.push({
          name: `--${prefix}-${mode}`,
          value: String(val),
        })
      }
    }
    return resolved.length > 0 ? resolved : null
  }

  return null
}

// ──────────────────────────────────────────────
// Parseo CSS existente
// ──────────────────────────────────────────────

async function parseCss(filePath: string): Promise<ThemeVariable[]> {
  const raw = await readFile(filePath, 'utf-8')
  const variables: ThemeVariable[] = []

  const regex = /(--[\w-]+)\s*:\s*([^;]+);/g
  let match

  while ((match = regex.exec(raw)) !== null) {
    variables.push({
      name: match[1].trim(),
      value: match[2].trim(),
    })
  }

  return variables
}
