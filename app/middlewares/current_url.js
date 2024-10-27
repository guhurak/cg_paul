function current_url_middleware(request, response, done) {
  response.locals.current_url = request.url

  done()
}

export default current_url_middleware
