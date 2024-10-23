class HomeController {
  constructor() {}

  index(_request, response) {
    return response.redirect("/app")
  }
}

export default HomeController
