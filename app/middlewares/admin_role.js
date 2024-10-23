async function admin_role_middleware(request, response) {
  let roles

  if (request.cookies.roles == undefined) {
    roles = request.roles
  } else {
    roles = global.server.unsignCookie(request.cookies.roles).value.split(",")
  }

  if (!roles.includes(process.env.CEGOMOS_CONSEILLE_ROLE)) {
    response.view("public/unauthorized")
  }
}

export default admin_role_middleware
