import {
    Command,
    Embed,
    Options,
    createBooleanOption,
    createNumberOption,
    createStringOption,
    type CommandContext,
} from 'seyfert'
import { APIEmbedField, MessageFlags } from 'seyfert/lib/types'
import { RollResult, Dice } from '@lib/dice';
import { ColorResolvable } from 'seyfert/lib/common';

export type Circumstances = 'advantage' | 'disadvantage';

export type Attribute = 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha';

type EmbedOptions = {
    n: number;
    sides: number;
    modifier?: number;
    circumstances?: Circumstances;
    attribute?: Attribute;
    color?: ColorResolvable;
}

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
        const flags = ctx.options.hide ? MessageFlags.Ephemeral : undefined;
        const n = ctx.options.n ?? 1;
        const sides = this.sides ?? ctx.options.sides ?? 20;

        const resultEmbed = this.buildEmbedMessage({
            n,
            sides,
            modifier: ctx.options.mod,
            attribute: convertStringToAttribute(ctx.options.attribute || ''),
            circumstances: convertStringToCircumstances(ctx.options.circumstances || ''),
            color: this.color ?? DEFAULT_EMBED_COLOR,
        });

        await ctx.write({ embeds: [resultEmbed], flags });
    }

    private buildEmbedMessage(opt: EmbedOptions): Embed {
        const diceRes = Dice.calculate(opt.n, opt.sides, opt.modifier ?? 0);
        
        const fields: (APIEmbedField | null)[] = [
            this.getTotalField(opt.n, diceRes.total),
            this.getCircumstanceField(opt.circumstances, diceRes),
            this.getModifierField(opt.modifier, opt.circumstances, diceRes),
            this.getAttributeField(opt.attribute),
            this.getDiceListField(diceRes.rolls)
        ];

        const res = new Embed()
            .setTitle(`${opt.n}d${opt.sides}`)
            .setColor(opt.color ?? DEFAULT_EMBED_COLOR)
            .addFields(fields.filter((f): f is APIEmbedField => f !== null));

        return res
    }

    private getTotalField(n: number, total: number): APIEmbedField | null {
        if (n <= 1) return null;
        return { name: 'Total', value: `\`${total}\`` };
    }

    private getCircumstanceField(circum: Circumstances | undefined, res: RollResult): APIEmbedField | null {
        if (!circum) return null;

        const isAdv = circum === 'advantage';
        const value = isAdv ? res.maxValue : res.minValue;
        
        return { 
            name: isAdv ? 'Advantage' : 'Disadvantage', 
            value: `\`${value}\`` 
        };
    }

    private getModifierField(mod: number | undefined, circum: Circumstances | undefined, res: RollResult): APIEmbedField | null {
        if (!mod || mod === 0) return null;

        const symbol = mod > 0 ? '+' : '-';
        const modText = `${symbol} ${Math.abs(mod)}`;

        let value = `\`${res.total} ${modText} = ${res.totalMod}\``;

        if (circum) {
            const isAdv = circum === 'advantage';
            const specVal = isAdv ? res.maxValue : res.minValue;
            const specMod = isAdv ? res.maxValueMod : res.minValueMod;
            
            value += `\n\`${specVal} ${modText} = ${specMod}\` (${isAdv ? 'Adv' : 'Dis'})`;
        }

        return { name: 'Modifier', value };
    }

    private getAttributeField(attr: Attribute | undefined): APIEmbedField | null {
        if (!attr) return null;
        return { name: 'Attribute', value: `\`${attr.toUpperCase()}\`` };
    }

    private getDiceListField(rolls: number[]): APIEmbedField {
        const list = rolls.join(', ');
        const value = list.length > 1000 ? `${list.substring(0, 1000)}...` : list;
        
        return { 
            name: ':game_die: Dice', 
            value: `[${value}]` 
        };
    }
}

export function convertStringToAttribute(str: string): Attribute | undefined {
    const mapping: { [key: string]: Attribute } = {
        'strength': 'str',
        'dexterity': 'dex',
        'constitution': 'con',
        'intelligence': 'int',
        'wisdom': 'wis',
        'charisma': 'cha',
    };

    return mapping[str.toLowerCase()] ?? undefined;
}

export function convertStringToCircumstances(str: string): Circumstances | undefined {
    const mapping: { [key: string]: Circumstances } = {
        'advantage': 'advantage',
        'disadvantage': 'disadvantage',
    };

    return mapping[str.toLowerCase()] ?? undefined;
}
