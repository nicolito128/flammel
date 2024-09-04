import {
  Command,
  Declare,
  Options,
  createStringOption,
  createNumberOption,
  type CommandContext
} from 'seyfert'

const options = {
  y: createStringOption({
    description: 'Expression to plotting',
    required: true
  }),
  start: createNumberOption({
    description: 'Set the left side of the plotting chart',
    min_value: -100.0,
    max_value: 0.0,
    required: true
  }),
  end: createNumberOption({
    description: 'Set the right side of the plotting chart',
    min_value: 0.0,
    max_value: 100.0,
    required: true
  })
}

@Declare({
  name: 'plot',
  description: 'Display a plotting'
})
@Options(options)
export default class PingCommand extends Command {
  async run (ctx: CommandContext<typeof options>): Promise<void> {
    const body = ctx.options.y ?? ''
    // @ts-expect-error
    const start = ctx.options.start ?? 0.0
    // @ts-expect-error
    const end = ctx.options.end ?? 0.0

    await ctx.write({
      content: body
    })
  }
}
