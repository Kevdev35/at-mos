import * as p from '@clack/prompts'
import { detectEnv } from '../core/detector.js'
import { askOutputPath } from '../core/prompts.js'
import { readTheme } from '../core/reader.js'
import { writeTheme } from '../core/writer.js'
import { logger } from '../utils/logger.js'
import type { ThemeVariable } from '../core/writer.js'

interface UpdateOptions {
  output?: string
}

type UpdateAction = 'add' | 'edit' | 'delete'

export async function update(options: UpdateOptions) {
  p.intro('at-mos — actualizar @theme')

  const spinner = p.spinner()
  spinner.start('Buscando archivo CSS...')
  const env = await detectEnv()
  spinner.stop('Proyecto analizado')

  let cssPath = options.output ?? env.cssCandidate

  if (!cssPath) {
    logger.warn('No se encontró un archivo CSS automáticamente.')
    cssPath = await askOutputPath()
  }

  // leer variables actuales
  spinner.start(`Leyendo variables desde ${cssPath}...`)
  const variables = await readTheme(cssPath)
  spinner.stop(`${variables.length} variables encontradas`)

  if (variables.length > 0) {
    p.log.step('Variables actuales:')
    for (const { name, value } of variables) {
      p.log.info(`${name}: ${value}`)
    }
  }

  // elegir acción
  const action = await p.select<UpdateAction>({
    message: '¿Qué quieres hacer?',
    options: [
      { value: 'add',    label: 'Agregar una variable nueva' },
      { value: 'edit',   label: 'Modificar una variable existente', hint: variables.length === 0 ? 'no hay variables aún' : '' },
      { value: 'delete', label: 'Eliminar una variable',            hint: variables.length === 0 ? 'no hay variables aún' : '' },
    ]
  })

  if (p.isCancel(action)) process.exit(0)

  let updated: ThemeVariable[] = [...variables]

  if (action === 'add') {
    updated = await handleAdd(variables)
  } else if (action === 'edit') {
    if (variables.length === 0) {
      logger.warn('No hay variables para modificar.')
      p.outro('Sin cambios.')
      return
    }
    updated = await handleEdit(variables)
  } else if (action === 'delete') {
    if (variables.length === 0) {
      logger.warn('No hay variables para eliminar.')
      p.outro('Sin cambios.')
      return
    }
    updated = await handleDelete(variables)
  }

  // escribir cambios
  spinner.start('Guardando cambios...')
  await writeTheme(cssPath, updated)
  spinner.stop('Listo')

  logger.success(`@theme actualizado en ${cssPath}`)
  p.outro('Cambios guardados.')
}

async function handleAdd(variables: ThemeVariable[]): Promise<ThemeVariable[]> {
  const name = await p.text({
    message: 'Nombre de la variable',
    placeholder: '--color-accent',
    validate: (val) => {
      if (!val) return 'El nombre no puede estar vacío'
      if (!val.startsWith('--')) return 'Debe empezar con --'
      if (variables.some(v => v.name === val)) return 'Esa variable ya existe, usa "Modificar"'
    }
  })

  if (p.isCancel(name)) process.exit(0)

  const value = await p.text({
    message: `Valor para ${name}`,
    placeholder: '#ff0000',
    validate: (val) => {
      if (!val) return 'El valor no puede estar vacío'
    }
  })

  if (p.isCancel(value)) process.exit(0)

  return [...variables, { name: name as string, value: value as string }]
}

async function handleEdit(variables: ThemeVariable[]): Promise<ThemeVariable[]> {
  const selected = await p.select({
    message: '¿Cuál variable quieres modificar?',
    options: variables.map(v => ({
      value: v.name,
      label: v.name,
      hint: v.value
    }))
  })

  if (p.isCancel(selected)) process.exit(0)

  const current = variables.find(v => v.name === selected)!

  const newValue = await p.text({
    message: `Nuevo valor para ${selected}`,
    placeholder: current.value,
    validate: (val) => {
      if (!val) return 'El valor no puede estar vacío'
    }
  })

  if (p.isCancel(newValue)) process.exit(0)

  return variables.map(v =>
    v.name === selected ? { ...v, value: newValue as string } : v
  )
}

async function handleDelete(variables: ThemeVariable[]): Promise<ThemeVariable[]> {
  const selected = await p.multiselect({
    message: '¿Cuáles variables quieres eliminar?',
    options: variables.map(v => ({
      value: v.name,
      label: v.name,
      hint: v.value
    })),
    required: true
  })

  if (p.isCancel(selected)) process.exit(0)

  const toDelete = selected as string[]

  const confirmed = await p.confirm({
    message: `¿Eliminar ${toDelete.length} variable(s)? Esta acción no se puede deshacer.`,
    initialValue: false
  })

  if (p.isCancel(confirmed) || !confirmed) {
    p.log.warn('Operación cancelada.')
    return variables
  }

  return variables.filter(v => !toDelete.includes(v.name))
}