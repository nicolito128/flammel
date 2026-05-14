import crypto from 'node:crypto';

export type RollResult = {
    rolls: number[];

    modifier: number;

    total: number;
    totalMod: number;

    maxValue: number;
    maxValueMod: number;

    minValue: number;
    minValueMod: number;
};

export class Dice {
    // [min, max]
    static getRandomInt(min: number, max: number): number {
        return crypto.randomInt(min, max + 1);
    }

    static roll(n: number, sides: number): number[] {
        return Array.from({ length: n }, () => this.getRandomInt(1, sides));
    }

    static calculate(n: number, sides: number, modifier: number = 0): RollResult {
        let rolls = this.roll(n, sides);
        let total = 0, maxValue = rolls[0], minValue = rolls[0];
        for (let i = 0; i < rolls.length; i++) {
            let v = rolls[i];
            total += v;
            if (v > maxValue) maxValue = v;
            if (v < minValue) minValue = v;
        }

        return {
            rolls,

            modifier,

            total,
            totalMod: total + modifier,

            maxValue,
            maxValueMod: maxValue + modifier,

            minValue,
            minValueMod: minValue + modifier,
        };
    }
}

export default Dice;