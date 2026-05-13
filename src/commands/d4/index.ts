import {
    Declare,
} from 'seyfert'
import BaseDiceCommand from '@lib/dicecmd/index';

const SIDES = 4;

@Declare({
    name: 'd4',
    description: 'Roll N dice with four sides each'
})
export default class D4 extends BaseDiceCommand {
    constructor() {
        super(SIDES);
    }
}
