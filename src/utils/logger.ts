import * as p from '@clack/prompts'
import pc from 'picocolors'

export const logger = {
  info: (msg: string) => p.log.info(msg),
  success: (msg: string) => p.log.success(msg),
  warn: (msg: string) => p.log.warn(msg),
  error: (msg: string) => p.log.error(msg),
  step: (msg: string) => p.log.step(msg),
}