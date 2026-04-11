import { Command } from 'commander'

const program = new Command()

program
  .name('at-mos')
  .description('CLI para generar global.css con @theme para Tailwind v4')
  .version('0.1.0')

program
  .command('init')
  .description('Genera tu global.css con @theme')
  .option('-o, --output <path>', 'Ruta personalizada del archivo CSS')
  .option('--from <file>', 'Importar variables desde .json')
  .action(async (options) => {
    const { init } = await import('./commands/init')
    await init(options)
  })

program
  .command('list')
  .description('Muestra las variables CSS definidas en tu @theme')
  .option('-o, --output <path>', 'Ruta personalizada del archivo CSS')
  .action(async (options) => {
    const { list } = await import('./commands/list')
    await list(options)
  })

program
  .command('update')
  .description('Agrega, modifica o elimina variables en tu @theme')
  .option('-o, --output <path>', 'Ruta personalizada del archivo CSS')
  .action(async (options) => {
    const { update } = await import('./commands/update')
    await update(options)
  })

program.parse()