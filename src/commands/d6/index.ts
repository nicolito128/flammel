import {
    Command,
    Declare,
    Options,
    createBooleanOption,
    createNumberOption,
    createStringOption,
    Embed,
    type CommandContext,
} from 'seyfert'
import { MessageFlags, APIEmbedField } from 'seyfert/lib/types'

const SIDES = 6;

const EMBED_COLOR = '#DC143C';

const MIN_LIMIT = 1;
const MAX_LIMIT = 100;

const CIRCUMSTANCES_CHOICES = [
    { name: 'Advantage', value: 'advantage' },
    { name: 'Disadvantage', value: 'disadvantage' },
];

const options = {
    n: createNumberOption({
        description: 'Quantity of dice to roll',
        min_value: MIN_LIMIT,
        max_value: MAX_LIMIT
    }),
    circumstances: createStringOption({
        description: 'Reflects the roll circumstances',
        choices: CIRCUMSTANCES_CHOICES
    }),
    hide: createBooleanOption({
        description: 'Hide command output'
    })
}

@Declare({
    name: 'd6',
    description: 'Roll N six-sided dice'
})
@Options(options)
export default class D6 extends Command {
    async run(ctx: CommandContext<typeof options>): Promise<void> {
        const flags = ctx.options.hide ? MessageFlags.Ephemeral : undefined
        const n = ctx.options.n ?? 1;
        const circumstances = ctx.options.circumstances;

        const resultEmbed = new Embed();
        const fields: APIEmbedField[] = [];

        const rollValues = [];
        let total = 0;

        for (let i = 0; i < n; i++) {
            const value = this.roll(SIDES);
            rollValues.push(value);
            total += value;
        }

        resultEmbed.setTitle(`${n}d${SIDES}`);
        resultEmbed.setColor(EMBED_COLOR);

        if (n > 1) {
            fields.push({ name: 'Total', value: `\`${total}\`` });
        }

        if (circumstances) {
            let elem: number;
            if (circumstances === 'advantage') {
                elem = Math.max(...rollValues);
                fields.push({ name: 'Advantage', value: `\`${elem}\`` });
            } else {
                elem = Math.min(...rollValues);
                fields.push({ name: 'Disadvantage', value: `\`${elem}\`` });
            }
        }

        const diceStr = rollValues.map(v => `${v}`).join(', ');
        fields.push({ name: ':game_die: Dice', value: `${diceStr}` });

        resultEmbed.addFields(fields);

        await ctx.write({
            embeds: [resultEmbed],
            flags
        });
    }

    roll(max: number): number {
        return Math.floor(Math.random() * max + 1);
    }
}
