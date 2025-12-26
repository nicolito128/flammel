import Client from './lib/client/index'

const client = new Client()

client
  .start()
  .then(async () => await client.uploadCommands())
