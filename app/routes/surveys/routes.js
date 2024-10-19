import SurveysController from "./controller.js"
import authMiddleware from "../../middlewares/auth.js"

class SurveysRoutes {
  construct() {}

  load_routes(server, _opts, done) {
    const surveys_controller = new SurveysController()

    server.addHook("onRequest", authMiddleware)
    server.get("/", surveys_controller.index)

    done()
  }
}

export default SurveysRoutes
