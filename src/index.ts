import { Command } from 'commander'

const program = new Command()

program
  .name('at-mos')
  .description('CLI para generar global.css con @theme para Tailwind v4')
  .version('1.1.0', '-v, --version', 'Muestra la versión de @t-mos')

program
  .command('init')
  .description('Genera tu global.css con @theme')
  .option('-o, --output <path>', 'Ruta personalizada del archivo CSS')
  .option('-f, --from <file>', 'Importar variables desde .json o .css')
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

program
  .command('version')
  .description('Muestra la versión de @t-mos')
  .option('-v','Especifica la versión a mostrar') 
  .option('--version <char>', 'Especifica la versión a mostrar')
  .option('--v <char>', 'Especifica la versión a mostrar')
  .action(() => {
    console.log(`\x1b[35m@t\x1b[36mmos\x1b[0m \x1b[2mv${program.version()}\x1b[0m`);
  });

program.parse()