const fs = require('node:fs')
const { config } = require('seyfert')

const getBotToken = () => {
  if (process.env.NODE_ENV === 'production') {
    return fs.readFileSync('/run/secrets/bot_token', 'utf8').trim()
  } else {
    return process.env.BOT_TOKEN ?? ''
  }
}

const getApplicationId = () => {
  return process.env.APPLICATION_ID ?? ''
}

module.exports = config.bot({
  applicationId: getApplicationId(),
  token: getBotToken(),
  debug: process.env.NODE_ENV === 'development',
  intents: ['Guilds', 'MessageContent'],
  locations: {
    base: 'dist',
    commands: 'commands',
    events: 'events'
  }
})