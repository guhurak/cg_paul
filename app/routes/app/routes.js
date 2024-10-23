import auth_middleware from "../../middlewares/auth.js"
import user_role_middleware from "../../middlewares/user_role.js"

class AppRoutes {
  construct() {}

  load_routes(server, _opts, done) {
    server.addHook("onRequest", auth_middleware)
    server.addHook("onRequest", user_role_middleware)
    server.get("/", async (_request, response) => {
      console.log("non")
      response.send("foo")
    })

    done()
  }
}

export default AppRoutes
