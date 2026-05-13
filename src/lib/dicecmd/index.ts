import {
    Command,
    Options,
    createBooleanOption,
    createNumberOption,
    createStringOption,
    type CommandContext,
} from 'seyfert'
import { MessageFlags } from 'seyfert/lib/types'
import { convertStringToAttribute, convertStringToCircumstances, Dice } from '@lib/dice/index';
import { ColorResolvable } from 'seyfert/lib/common';

const DEFAULT_EMBED_COLOR = '#DC143C';

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
        min_value: MIN_LIMIT,
        max_value: MAX_LIMIT,
    }),
    sides: createNumberOption({
        description: 'Number of sides per die',
        min_value: MIN_LIMIT,
        max_value: MAX_LIMIT,
    }),
    mod: createNumberOption({
        description: 'Modifier to add to the total roll result',
        min_value: -1000,
        max_value: 1000,
    }),
    attribute: createStringOption({
        description: 'D&D ability type',
        choices: ATTRIBUTES_CHOICES,
    }),
    circumstances: createStringOption({
        description: 'Reflects the roll circumstances',
        choices: CIRCUMSTANCES_CHOICES,
    }),
    hide: createBooleanOption({
        description: 'Hide command output',
    }),
}

const diceCache: { [sides: number]: Dice } = {};

@Options(options)
export default class BaseDiceCommand extends Command {
    sides?: number;
    color?: ColorResolvable;

    constructor(sides?: number, color?: ColorResolvable) {
        super();
        this.sides = sides;
        this.color = color;
    }

    async run(ctx: CommandContext<typeof options>): Promise<void> {
            const flags = ctx.options.hide ? MessageFlags.Ephemeral : undefined
            const n = ctx.options.n ?? 1;
            const sides = this.sides ?? ctx.options.sides ?? 20;
            const attribute = ctx.options.attribute;
            const circumstances = ctx.options.circumstances;
            const modifier = ctx.options.mod;

            let curDice: Dice;
            if (sides in diceCache) {
                curDice = diceCache[sides];
            } else {
                curDice = new Dice(sides);
                diceCache[sides] = curDice;
            }

            const resultEmbed = curDice.buildEmbedMessage({
                n,
                sides,
                modifier,
                attribute: convertStringToAttribute(attribute || ''),
                circumstances: convertStringToCircumstances(circumstances || ''),
                color: this.color ?? DEFAULT_EMBED_COLOR,
            });

            await ctx.write({ embeds: [resultEmbed], flags });
    }
}