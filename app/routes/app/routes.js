import auth_middleware from "../../middlewares/auth.js"
import user_role_middleware from "../../middlewares/user_role.js"

import SurveysRoutes from "./surveys/routes.js"

class AppRoutes {
  construct() {}

  load_routes(server, _opts, done) {
    const surveys_routes = new SurveysRoutes()

    server.addHook("onRequest", auth_middleware)
    server.addHook("onRequest", user_role_middleware)

    server.register(surveys_routes.load_routes, { prefix: "/surveys"})

    done()
  }
}

export default AppRoutes
