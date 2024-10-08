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
  x: createNumberOption({
    description: 'Input value of the function in radians',
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
    // Optionals
    const flags = ctx.options.hide ? MessageFlags.Ephemeral : undefined

    const x = ctx.options.x
    const cosX = math.cos(x)

    ctx.write({
      content: `\`cos(${x} rad) = ${cosX} rad\``,
      flags
    })
  }
}
