import {
  Declare,
  Options,
  SubCommand,
  createBooleanOption,
  createNumberOption,
  type CommandContext
} from 'seyfert'
import { MessageFlags } from 'seyfert/lib/types/index.js'
import * as math from 'mathjs'

const options = {
  x: createNumberOption({
    description: 'Input value of the function in radians',
    required: true
  }),
  hide: createBooleanOption({
    description: 'Hide command output'
  })
}

@Declare({
  name: 'sin',
  description: 'Sine function'
})
@Options(options)
export default class SineCommand extends SubCommand {
  async run (ctx: CommandContext<typeof options>): Promise<void> {
    // Optionals
    const flags = ctx.options.hide ? MessageFlags.Ephemeral : undefined

    const x = ctx.options.x
    const sinX = math.sin(x)

    ctx.write({
      content: `\`sin(${x} rad) = ${sinX} rad\``,
      flags
    })
  }
}
