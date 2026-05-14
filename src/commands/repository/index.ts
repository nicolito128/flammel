import {
  Command,
  Declare,
  Options,
  createBooleanOption,
  type CommandContext
} from 'seyfert'
import { MessageFlags } from 'seyfert/lib/types'

const REPO_URL = 'https://github.com/nicolito128/flammel';

const options = {
  hide: createBooleanOption({
    description: 'Hide command output'
  })
}

@Declare({
  name: 'repository',
  description: 'Show the link for the Flammel repository'
})
@Options(options)
export default class RepositoryCommand extends Command {
  async run(ctx: CommandContext<typeof options>): Promise<void> {
    const flags = ctx.options.hide ? MessageFlags.Ephemeral : undefined

    await ctx.write({
      content: `Flammel\'s repository: ${REPO_URL}`,
      flags
    })
  }
}
