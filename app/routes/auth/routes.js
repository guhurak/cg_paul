import AuthController from "./controller.js"

class AuthRoutes {
  constructor() {}

  load_routes(server, _opts, done) {
    const auth_controller = new AuthController()

    server.get("/login", auth_controller.login)
    server.get("/logout", auth_controller.logout)
    server.get("/discord", auth_controller.discord)

    done()
  }
}

export default AuthRoutes
