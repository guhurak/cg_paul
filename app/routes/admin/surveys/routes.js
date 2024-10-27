import SurveysController from "./controller.js"

class SurveysRoutes {
  construct() {}

  load_routes(server, _opts, done) {
    const surveys_controller = new SurveysController()

    server.get("/", surveys_controller.index)
    server.get("/:survey_id", surveys_controller.show)
    server.get("/:survey_id/edit", surveys_controller.edit)
    server.get("/new", surveys_controller.new)
    server.post("/", surveys_controller.create)
    server.get("/:survey_id/proxy", surveys_controller.proxy)
    server.post("/:survey_id/make_proxy", surveys_controller.make_proxy)

    done()
  }
}

export default SurveysRoutes
