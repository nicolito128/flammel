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

const EMBED_COLOR = '#DC143C';

const MIN_LIMIT = 1;
const MAX_LIMIT = 100;

const ATTRIBUTES_CHOICES = [
    { name: 'Strength', value: 'strength' },
    { name: 'Dexterity', value: 'dexterity' },
    { name: 'Constitution', value: 'constitution' },
    { name: 'Intelligence', value: 'intelligence' },
    { name: 'Wisdom', value: 'wisdom' },
    { name: 'Charisma', value: 'charisma' },
];

const CIRCUMSTANCES_CHOICES = [
    { name: 'Advantage', value: 'advantage' },
    { name: 'Disadvantage', value: 'disadvantage' },
];

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
    attribute: createStringOption({
        description: 'D&D ability type',
        choices: ATTRIBUTES_CHOICES
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
    name: 'roll',
    description: 'Roll N dice with M sides each'
})
@Options(options)
export default class RollCommand extends Command {
    async run(ctx: CommandContext<typeof options>): Promise<void> {
        const flags = ctx.options.hide ? MessageFlags.Ephemeral : undefined
        const n = ctx.options.n;
        const sides = ctx.options.sides;
        const attribute = ctx.options.attribute;
        const circumstances = ctx.options.circumstances;

        const resultEmbed = new Embed();
        const fields: APIEmbedField[] = [];

        const rollValues = [];
        let total = 0;

        for (let i = 0; i < n; i++) {
            const value = this.roll(sides);
            rollValues.push(value);
            total += value;
        }

        resultEmbed.setTitle(`Roll: ${n}d${sides}`);
        resultEmbed.setColor(EMBED_COLOR);

        if (n > 1) {
            fields.push({ name: 'Total', value: `\`${total}\`` });
        }

        if (attribute) {
            fields.push({ name: 'Attribute', value: `\`${attribute.toUpperCase()}\`` });
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
