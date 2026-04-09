import * as p from '@clack/prompts'
import type { ThemeVariable } from './writer.js'

export async function collectVariables(): Promise<ThemeVariable[]> {
  const variables: ThemeVariable[] = []

  p.intro('Definí tus variables CSS')

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
    message: 'Ruta del archivo CSS',
    placeholder: 'src/styles/global.css',
    validate: (val) => {
      if (!val) return 'La ruta no puede estar vacía'
      if (!val.endsWith('.css')) return 'Debe ser un archivo .css'
    }
  })

  if (p.isCancel(path)) process.exit(0)
  return path as string
}