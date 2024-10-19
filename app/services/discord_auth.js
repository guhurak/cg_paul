import axios from "axios"

class DiscordAuth {
  #api_endpoint = process.env.DISCORD_API_ENDPOINT

  constructor(id, secret) {
    this.id = id
    this.secret = secret
  }

  async get_access_token(code, redirect_uri) {
    const body = {
      "grant_type": "authorization_code",
      "code": code,
      "redirect_uri": redirect_uri
    }

    const headers = {
      "Content-Type": "application/x-www-form-urlencoded"
    }

    const auth = {
      username: this.id,
      password: this.secret
    }

    const response = await axios({
      method: "post",
      url: `${this.#api_endpoint}/oauth2/token`,
      data: body,
      headers: headers,
      auth: auth
    })

    return {
      access_token: response.data.access_token,
      refresh_token: response.data.refresh_token,
      expires_in: response.data.expires_in
    }
  }

  async refresh_access_token(refresh_token) {
    const body = {
      "grand_type": "refresh_token",
      "refresh_token": refresh_token
    }

    const headers = {
      "Content-Type": "application/x-www-form-urlencoded"
    }

    const auth = {
      username: this.id,
      password: this.secret
    }

    const response = await axios({
      method: "post",
      url: `${this.#api_endpoint}/oauth2/token`,
      data: body,
      headers: headers,
      auth: auth
    })

    return {
      access_token: response.data.access_token,
      refresh_token: response.data.refresh_token,
      expires_in: response.data.expires_in
    }
  }

  async fetch_user_id(access_token) {
    const headers = {
      "Authorization": `Bearer ${access_token}`
    }

    const response = await axios({
      method: "get",
      url: `${this.#api_endpoint}/users/@me`,
      headers: headers
    })

    return response.data.id
  }
}

export default DiscordAuth
