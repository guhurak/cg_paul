import AuthRoutes from "./auth/routes.js"
import AppRoutes from "./app/routes.js"
import AdminRoutes from "./admin/routes.js"
import HomeController from "./controller.js"

class Router {
  constructor() {}

  loadRoutes(server, _opts, done) {
    const auth_routes = new AuthRoutes()
    const app_routes = new AppRoutes()
    const admin_routes = new AdminRoutes()

    const home_controller = new HomeController()

    server.register(auth_routes.load_routes, { prefix: "/auth" })
    server.register(app_routes.load_routes, { prefix: "/app" })
    server.register(admin_routes.load_routes, { prefix: "/admin" })
    server.get("/", home_controller.index)

    done()
  }
}

export default Router
