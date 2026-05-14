import Client from '@lib/client'

const client = new Client()

client
  .start()
  .then(async () => await client.uploadCommands())
