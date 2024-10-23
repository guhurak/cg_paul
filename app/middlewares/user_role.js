async function user_role_middleware(request, response) {
  let roles

  if (request.cookies.roles == undefined) {
    roles = request.roles
  } else {
    roles = global.server.unsignCookie(request.cookies.roles).value.split(",")
  }

  if (!roles.includes(process.env.CEGOMOS_CITOYEN_ROLE)) {
    response.view("app/views/public/unauthorized")
  }
}

export default user_role_middleware
