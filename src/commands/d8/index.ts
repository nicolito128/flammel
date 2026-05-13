import {
    Declare,
} from 'seyfert'
import BaseDiceCommand from '@lib/dicecmd/index';

const SIDES = 8;

@Declare({
    name: 'd8',
    description: 'Roll N dice with eight sides each'
})
export default class D8 extends BaseDiceCommand {
    constructor() {
        super(SIDES);
    }
}
