import { Client, ParseClient } from 'seyfert'

const client = new Client()

client.start().then(async () => await client.uploadCommands())

declare module 'seyfert' {
  interface UsingClient extends ParseClient<Client<true>> { }
}
