import { config } from 'seyfert'

export default config.bot({
  applicationId: process.env.APPLICATION_ID ?? '',
  token: process.env.BOT_TOKEN ?? '',
  debug: process.env.DEBUG_MODE === 'development',
  intents: ['Guilds', 'MessageContent'],
  locations: {
    base: 'src',
    output: 'dist',
    commands: 'commands',
    events: 'events'
  }
})
