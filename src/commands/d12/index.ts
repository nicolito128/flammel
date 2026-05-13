import {
    Declare,
} from 'seyfert'
import BaseDiceCommand from '@lib/dicecmd/index';

const SIDES = 12;

@Declare({
    name: 'd12',
    description: 'Roll N dice with twelve sides each'
})
export default class D12 extends BaseDiceCommand {
    constructor() {
        super(SIDES);
    }
}
