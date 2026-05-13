import process from 'node:process'
import {
    Client as SeyfertClient,
    ClientOptions,
    ParseClient,
    Logger,
} from 'seyfert'

export default class Client extends SeyfertClient {

    constructor(options?: ClientOptions) {
        super(options)
        this.logger = new Logger({ logLevel: 3, active: process.env.NODE_ENV == "production", saveOnFile: true })
    }
}

declare module 'seyfert' {
  interface UsingClient extends ParseClient<SeyfertClient<true>> { }
}