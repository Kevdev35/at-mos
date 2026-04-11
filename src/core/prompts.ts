import * as p from '@clack/prompts'
import type { ThemeVariable } from './writer.js'

export type InputMode = 'manual' | 'file'

export async function askInputMode(): Promise<InputMode> {
  const mode = await p.select({
    message: '¿Cómo quieres definir tus variables?',
    options: [
      { value: 'manual', label: 'Manualmente, una por una' },
      { value: 'file',   label: 'Importar desde archivo (.json o .css)' },
    ]
  })

  if (p.isCancel(mode)) process.exit(0)
  return mode as InputMode
}

export async function askFilePath(): Promise<string> {
  const path = await p.text({
    message: 'Ruta del archivo de variables',
    placeholder: 'tokens.json  o  base-vars.css',
    validate: (val) => {
      if (!val) return 'La ruta no puede estar vacía'
      if (!val.endsWith('.json') && !val.endsWith('.css'))
        return 'Solo se aceptan archivos .json'
    }
  })

  if (p.isCancel(path)) process.exit(0)
  return path as string
}

export async function collectVariables(): Promise<ThemeVariable[]> {
  const variables: ThemeVariable[] = []

  p.log.step('Definí tus variables CSS')

  while (true) {
    const name = await p.text({
      message: 'Nombre de la variable',
      placeholder: '--color-primary',
      validate: (val) => {
        if (!val) return 'El nombre no puede estar vacío'
        if (!val.startsWith('--')) return 'Debe empezar con --'
      }
    })

    if (p.isCancel(name)) break

    const value = await p.text({
      message: `Valor para ${name}`,
      placeholder: '#3b82f6',
      validate: (val) => {
        if (!val) return 'El valor no puede estar vacío'
      }
    })

    if (p.isCancel(value)) break

    variables.push({ name: name as string, value: value as string })

    const another = await p.confirm({
      message: '¿Agregar otra variable?',
      initialValue: true
    })

    if (p.isCancel(another) || !another) break
  }

  return variables
}

export async function confirmOutput(path: string): Promise<boolean> {
  const confirmed = await p.confirm({
    message: `¿Generar el CSS en ${path}?`,
    initialValue: true
  })

  return !p.isCancel(confirmed) && confirmed === true
}

export async function askOutputPath(): Promise<string> {
  const path = await p.text({
    message: 'Ruta del archivo CSS de salida',
    placeholder: 'src/styles/global.css',
    validate: (val) => {
      if (!val) return 'La ruta no puede estar vacía'
      if (!val.endsWith('.css')) return 'Debe ser un archivo .css'
    }
  })

  if (p.isCancel(path)) process.exit(0)
  return path as string
}

export async function selectVariables(
  variables: ThemeVariable[]
): Promise<ThemeVariable[]> {
  const selected = await p.multiselect({
    message: `Se encontraron ${variables.length} variables. ¿Cuáles quieres incluir?`,
    options: variables.map((v) => ({
      value: v,
      label: v.name,
      hint: v.value
    })),
    required: true
  })

  if (p.isCancel(selected)) process.exit(0)
  return selected as ThemeVariable[]
}