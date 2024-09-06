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
  value: createNumberOption({
    description: 'Value of the function',
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
    const flags = ctx.options.hide ? MessageFlags.Ephemeral : undefined
    const { value } = ctx.options
    const result = this.sin(value)

    await ctx.write({
      content: `\`sin(${value}) = ${result}\``,
      flags
    })
  }

  sin (x: number): number {
    return math.sin(x)
  }
}
