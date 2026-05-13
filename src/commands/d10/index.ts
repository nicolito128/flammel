import {
    Declare,
} from 'seyfert'
import BaseDiceCommand from '@lib/dicecmd/index';

const SIDES = 10;

@Declare({
    name: 'd10',
    description: 'Roll N dice with ten sides each'
})
export default class D10 extends BaseDiceCommand {
    constructor() {
        super(SIDES);
    }
}
