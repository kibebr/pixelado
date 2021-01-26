import HttpInternalServerError from './errors/HttpInternalServerError.js'

export default class SessionController {
  constructor ({ UserService }) {
    this.userService = UserService
  }

  post = async (httpRequest = {}) => {
    try {
      const { username, password } = httpRequest.body

      if (!username) {
        return {
          statusCode: 400,
          body: 'Username not provided.'
        }
      }

      if (!password) {
        return {
          statusCode: 400,
          body: 'Password not provided.'
        }
      }

      const accessToken = await this.userService.auth({ username, password })

      if (accessToken) {
        return {
          statusCode: 200,
          body: accessToken
        }
      } else {
        return {
          statusCode: 401,
          body: 'Username or password is invalid.'
        }
      }
    } catch (err) {
      console.error(err)
      return new HttpInternalServerError()
    }
  }
}
