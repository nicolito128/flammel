import {
    Declare,
} from 'seyfert'
import BaseDiceCommand from '@lib/dicecmd/index';

const SIDES = 6;

@Declare({
    name: 'd6',
    description: 'Roll N dice with six sides each'
})
export default class D6 extends BaseDiceCommand {
    constructor() {
        super(SIDES);
    }
}
