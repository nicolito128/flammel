import {
  Command,
  Declare,
  Options,
  createBooleanOption,
  type CommandContext
} from 'seyfert'
import { MessageFlags } from 'seyfert/lib/types'

const INVITE_URL = 'https://discord.com/oauth2/authorize?client_id=1280035998478372920&scope=bot%20applications.commands&permissions=191193615361';

const options = {
  hide: createBooleanOption({
    description: 'Hide command output'
  })
}

@Declare({
  name: 'invite',
  description: 'Show the invite link of Flammel'
})
@Options(options)
export default class InviteCommand extends Command {
  async run(ctx: CommandContext<typeof options>): Promise<void> {
    const flags = ctx.options.hide ? MessageFlags.Ephemeral : undefined

    await ctx.write({
      content: `Flammel\'s invite link: ${INVITE_URL}`,
      flags
    })
  }
}
