const fs = require('node:fs')
const { config } = require('seyfert')

const getBotToken = () => {
  if (process.env.NODE_ENV === 'production') {
    return fs.readFileSync('/run/secrets/BOT_TOKEN', 'utf8').trim()
  } else {
    return process.env.BOT_TOKEN ?? ''
  }
}

const getApplicationId = () => {
  if (process.env.NODE_ENV === 'production') {
    return fs.readFileSync('/run/secrets/APPLICATION_ID', 'utf8').trim()
  } else {
    return process.env.APPLICATION_ID ?? ''
  }
}

module.exports = config.bot({
  applicationId: getApplicationId(),
  token: getBotToken(),
  debug: process.env.NODE_ENV === 'development',
  intents: ['Guilds', 'MessageContent'],
  locations: {
    base: 'src',
    output: 'dist',
    commands: 'commands',
    events: 'events'
  }
})