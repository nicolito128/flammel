import {
  Declare,
  Options,
  SubCommand,
  createBooleanOption,
  type CommandContext
} from 'seyfert'
import { MessageFlags } from 'seyfert/lib/types/index.js'
import * as math from 'mathjs'

const options = {
  hide: createBooleanOption({
    description: 'Hide command output'
  })
}

@Declare({
  name: 'pi',
  description: 'Value of PI'
})
@Options(options)
export default class PiCommand extends SubCommand {
  async run (ctx: CommandContext<typeof options>): Promise<void> {
    const flags = ctx.options.hide ? MessageFlags.Ephemeral : undefined

    ctx.write({
      content: `\`π = ${math.pi}\``,
      flags
    })
  }
}
