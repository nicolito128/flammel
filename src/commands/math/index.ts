import { AutoLoad, Declare, Command } from 'seyfert'

@Declare({
  name: 'math',
  description: 'Math command'
})
@AutoLoad()
export default class MathCommand extends Command {}
