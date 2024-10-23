import auth_middleware from "../../middlewares/auth.js"
import admin_role_middleware from "../../middlewares/admin_role.js"

import SurveysRoutes from "./surveys/routes.js"

class AdminRoutes {
  construct() {}

  load_routes(server, _opts, done) {
    const survey_routes = new SurveysRoutes()

    server.decorateRequest("roles", null)
    server.decorateRequest("access_token", "")
    server.decorateRequest("refresh_token", "")

    server.addHook("onRequest", auth_middleware)
    server.addHook("onRequest", admin_role_middleware)
    server.register(survey_routes.load_routes, { prefix: "/surveys" })

    done()
  }
}

export default AdminRoutes
