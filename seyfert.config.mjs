import * as fs from 'node:fs'
import { config } from 'seyfert'

const getBotToken = () => {
  if (process.env.NODE_ENV === 'production') {
    return fs.readFileSync('/run/secrets/bot_token', 'utf8').trim()
  } else {
    return process.env.BOT_TOKEN ?? ''
  }
}

const getApplicationID = () => process.env.APPLICATION_ID ?? ''

const getPort = () => parseInt(process.env.PORT) ?? 5000

export default config.bot({
  applicationId: getApplicationID(),
  token: getBotToken(),
  debug: process.env.NODE_ENV === 'development',
  intents: ['Guilds', 'MessageContent'],
  locations: {
    base: 'dist',
    commands: 'commands',
    events: 'events'
  },
  port: getPort()
})
