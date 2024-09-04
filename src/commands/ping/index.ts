import {
  Command,
  Declare,
  Options,
  createBooleanOption,
  type CommandContext
} from 'seyfert'
import { MessageFlags } from 'seyfert/lib/types/index.js'

const options = {
  hide: createBooleanOption({
    description: 'Hide command output'
  })
}

@Declare({
  name: 'ping',
  description: 'Show the ping with discord'
})
@Options(options)
export default class PingCommand extends Command {
  async run (ctx: CommandContext<typeof options>): Promise<void> {
    const flags = ctx.options.hide ? MessageFlags.Ephemeral : undefined
    const ping = ctx.client.gateway.latency

    await ctx.write({
      content: `The ping is \`${ping}\``,
      flags
    })
  }
}
