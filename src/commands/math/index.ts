import { Declare, Command, Options } from 'seyfert';
import SineCommand from './math.sine';
import CosineCommand from './math.cosine';

@Declare({
  name: 'math',
  description: 'Math command'
})
@Options([SineCommand, CosineCommand])
export default class MathCommand extends Command {}