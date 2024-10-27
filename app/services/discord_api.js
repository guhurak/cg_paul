import axios from "axios"

class DiscordApi {
  #api_endpoint = process.env.DISCORD_API_ENDPOINT
  #guild_id = process.env.CEGOMOS_GUILD_ID

  constructor(access_token) {
    this.access_token = access_token
  }

  async get_user_roles() {
    const headers = {
      "Authorization": `Bearer ${this.access_token}`
    }

    const response = await axios({
      method: "get",
      url: `${this.#api_endpoint}/users/@me/guilds/${this.#guild_id}/member`,
      headers: headers
    })

    return response.data.roles
  }

  async get_user_id() {
    const headers = {
      "Authorization": `Bearer ${this.access_token}`
    }

    const response = await axios({
      method: "get",
      url: `${this.#api_endpoint}/users/@me`,
      headers: headers
    })

    return response.data.id
  }
}

export default DiscordApi
