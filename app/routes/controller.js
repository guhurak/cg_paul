class HomeController {
  constructor() {}

  index(_request, response) {
    return response.redirect("/surveys")
  }
}

export default HomeController
