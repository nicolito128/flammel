import {
    Embed,
} from 'seyfert'
import { ColorResolvable } from 'seyfert/lib/common';
import { APIEmbedField } from 'seyfert/lib/types'

type Circumstances = 'advantage' | 'disadvantage';

type Attribute = 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha';

type EmbedOptions = {
    n: number;
    sides: number;
    modifier?: number;
    circumstances?: Circumstances;
    attribute?: Attribute;
    color?: ColorResolvable;
}

export class Dice {
    sides: number;

    constructor(sides: number) {
        this.sides = sides;
    }

    roll(n: number = 1): number[] {
        const rolls = [];
        for (let i = 0; i < n; i++) {
            rolls.push(Math.floor(Math.random() * this.sides + 1));
        }
        return rolls;
    }

    rollWithModifier(n: number, modifier: number): number[] {
        const rolls = this.roll(n);
        return rolls.map(roll => roll + modifier);
    }

    buildEmbedMessage(opt: EmbedOptions): Embed {
        const resultEmbed = new Embed();
        const fields: APIEmbedField[] = [];

        const rolls = this.roll(opt.n);
        const total = rolls.reduce((acc, val) => acc + val, 0);

        resultEmbed.setTitle(`${opt.n}d${opt.sides}`);
        
        if (opt.color) {
            resultEmbed.setColor(opt.color);
        }

        let modField = '';
        if (opt.modifier) {
            if (opt.modifier > 0) {
                modField = `+ ${opt.modifier}`;
            } else {
                modField = `- ${Math.abs(opt.modifier)}`;
            }
        }

        const totalWithModifier = total + (opt.modifier ?? 0);
        if (opt.n > 1 || modField) {
            if (modField) {
                fields.push({ name: 'Total', value: `\`${total} ${modField} = ${totalWithModifier}\`` });
            } else {
                fields.push({ name: 'Total', value: `\`${total}\`` });
            }
        }

        if (opt.attribute) {
            fields.push({ name: 'Attribute', value: `\`${opt.attribute.toUpperCase()}\`` });
        }

        if (opt.circumstances) {
            let elem: number;
            if (opt.circumstances === 'advantage') {
                elem = Math.max(...rolls);
                fields.push({ name: 'Advantage', value: `\`${elem}\`` });
            } else {
                elem = Math.min(...rolls);
                fields.push({ name: 'Disadvantage', value: `\`${elem}\`` });
            }
        }

        const diceStr = rolls.map(v => `${v}`).join(', ');
        fields.push({ name: ':game_die: Dice', value: `${diceStr}` });

        resultEmbed.addFields(fields);

        return resultEmbed;
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

export default Dice;