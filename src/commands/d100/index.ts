import {
    Declare,
} from 'seyfert'
import BaseDiceCommand from '@lib/dicecmd/index';

const SIDES = 100;

@Declare({
    name: 'd100',
    description: 'Roll N dice with one hundred sides each'
})
export default class D100 extends BaseDiceCommand {
    constructor() {
        super(SIDES);
    }
}
