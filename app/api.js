import Fastify from "fastify"
import fastifyView from "@fastify/view"
import fastifyCookie from "@fastify/cookie"
import formbody from "@fastify/formbody"
import ejs from "ejs"

import Router from "./routes/routes.js"
import Database from "./services/database.js"

class Api {
  constructor() {
    global.server = Fastify({ logger: true })

    global.server.register(fastifyCookie, {
      secret: process.env.COOKIE_SIGNING,
      algorithm: "sha256"
    })

    global.server.register(formbody)

    global.server.register(fastifyView, {
      engine: { ejs: ejs },
      root: "app/views",
      layout: "layout.ejs"
    })

    const router = new Router()

    global.server.register(router.loadRoutes)

    this.#initDB()
  }

  async #initDB() {
    const database = new Database()

    await database.connect()

    global.database_client = database.client
  }

  start(address, port) {
    console.log(`Start Paul on ${address}:${port}`)

    global.server.listen({ host: address, port: port }, function(err, address) {
      if (err) {
        self.server.log(err)
        process.exit(1)
      }

      global.server.log.info(`Paul listening on ${address}`)
    })
  }
}

export default Api
