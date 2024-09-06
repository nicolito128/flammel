import {
  SubCommand,
  Declare,
  Options,
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
  name: 'cos',
  description: 'Cosine function'
})
@Options(options)
export default class CosineCommand extends SubCommand {
  async run (ctx: CommandContext<typeof options>): Promise<void> {
    const flags = ctx.options.hide ? MessageFlags.Ephemeral : undefined
    const { value } = ctx.options
    const result = this.cos(value)

    await ctx.write({
      content: `\`cos(${value}) = ${result}\``,
      flags
    })
  }

  cos (x: number): number {
    return math.cos(x)
  }
}
