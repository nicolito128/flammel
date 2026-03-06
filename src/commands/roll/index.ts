import {
    Command,
    Declare,
    Options,
    createBooleanOption,
    createNumberOption,
    type CommandContext
} from 'seyfert'
import { MessageFlags } from 'seyfert/lib/types'

const MIN_LIMIT = 1;
const MAX_LIMIT = 100;

const options = {
    n: createNumberOption({
        description: 'Quantity of dice to roll',
        required: true,
        min_value: MIN_LIMIT,
        max_value: MAX_LIMIT
    }),
    sides: createNumberOption({
        description: 'Number of sides per die',
        required: true,
        min_value: MIN_LIMIT,
        max_value: MAX_LIMIT
    }),
    hide: createBooleanOption({
        description: 'Hide command output'
    })
}

@Declare({
    name: 'roll',
    description: 'Roll N dice with M sides each'
})
@Options(options)
export default class RollCommand extends Command {
    async run(ctx: CommandContext<typeof options>): Promise<void> {
        const flags = ctx.options.hide ? MessageFlags.Ephemeral : undefined

        const n = ctx.options.n;
        const sides = ctx.options.sides;
        if ((n < MIN_LIMIT || n > MAX_LIMIT) || (sides < MIN_LIMIT || sides > MAX_LIMIT)) {
            await ctx.write({ content: `Cannot roll those numbers.`, flags });
            return;
        }

        const results = [];
        let total = 0;

        for (let i = 0; i < n; i++) {
            const value = this.roll(sides);
            total += value;
            results.push(value);
        }

        let content = `**Roll**: ${n}d${sides} (Total: ${total})\n`;
        content += results.map(v => `:game_die: ${v}`).join(' ');

        await ctx.write({
            content,
            flags
        });
    }

    roll(max: number): number {
        return Math.floor(Math.random() * max + 1);
    }
}
