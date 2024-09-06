import { Declare, Command, Options } from 'seyfert';
import SineCommand from './sine.command';
import CosineCommand from './cosine.command';

@Declare({
  name: 'math',
  description: 'Math command'
})
@Options([SineCommand, CosineCommand])
export default class MathCommand extends Command {}