import {
  Command,
  Declare,
  Options,
  createBooleanOption,
  type CommandContext
} from 'seyfert'
import { MessageFlags } from 'seyfert/lib/types'

const SERVER_INVITE_LINK = 'https://discord.gg/Zz8uu8mNJN';

const options = {
  hide: createBooleanOption({
    description: 'Hide command output'
  })
}

@Declare({
  name: 'dev-server',
  description: 'Show the invite link for the Flammel Development server'
})
@Options(options)
export default class DevServerCommand extends Command {
  async run(ctx: CommandContext<typeof options>): Promise<void> {
    const flags = ctx.options.hide ? MessageFlags.Ephemeral : undefined

    await ctx.write({
      content: `Flammel\'s dev server: ${SERVER_INVITE_LINK}`,
      flags
    })
  }
}
