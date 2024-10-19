import AuthRoutes from "./auth/routes.js"
import SurveysRoutes from "./surveys/routes.js"
import HomeController from "./controller.js"

class Router {
  constructor() {}

  loadRoutes(server, _opts, done) {
    const auth_routes = new AuthRoutes()
    const surveys_routes = new SurveysRoutes()

    const home_controller = new HomeController()

    server.register(auth_routes.load_routes, { prefix: "/auth" })
    server.register(surveys_routes.load_routes, { prefix: "/surveys" })
    server.get("/", home_controller.index)

    done()
  }
}

export default Router
