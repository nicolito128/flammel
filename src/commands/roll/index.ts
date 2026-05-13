import {
    Declare,
} from 'seyfert'
import BaseDiceCommand from '@lib/dicecmd/index';

@Declare({
    name: 'roll',
    description: 'Roll N dice with M sides each'
})
export default class RollCommand extends BaseDiceCommand {
    constructor() {
        super();
    }
}
