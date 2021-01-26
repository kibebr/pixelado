import HttpInternalServerError from './errors/HttpInternalServerError.js'
import { ParamInUseError, InvalidParamError } from '../../../utils/errors/index.js'

export default class UserController {
  constructor ({ UserService }) {
    this.userService = UserService
  }

  getByUsername = async httpRequest => {
    try {
      const { username } = httpRequest.params

      if (!username) {
        return {
          statusCode: 400,
          body: 'Missing username parameter.'
        }
      }

      const user = await this.userService.find({ username })

      if (!user) {
        return {
          statusCode: 404,
          body: `User ${username} not found.`
        }
      } else {
        return {
          statusCode: 200,
          body: user
        }
      }
    } catch (err) {
      console.error(err)
      return new HttpInternalServerError()
    }
  }

  getSketchesFromUsername = async httpRequest => {
    try {
      const { username } = httpRequest.params

      if (!username) {
        return {
          statusCode: 400,
          body: 'Missing username parameter.'
        }
      }

      const sketches = await this.userService.findAllSketches(username)

      if (!sketches) {
        return {
          statusCode: 404,
          body: 'This user does not contain any sketches.'
        }
      } else {
        return {
          statusCode: 200,
          body: sketches
        }
      }
    } catch (err) {
      console.error(err)
      return new HttpInternalServerError()
    }
  }

  post = async httpRequest => {
    try {
      const { username, email, password } = httpRequest.body

      if (!username) {
        return {
          statusCode: 400,
          body: 'Missing username parameter.'
        }
      }

      if (!email) {
        return {
          statusCode: 400,
          body: 'Missing email parameter.'
        }
      }

      if (!password) {
        return {
          statusCode: 400,
          body: 'Missing password parameter.'
        }
      }

      const result = await this.userService.add({ username, email, password })

      return {
        statusCode: 201,
        body: result
      }
    } catch (err) {
      if (err instanceof InvalidParamError) {
        return {
          statusCode: 400,
          body: err.message
        }
      } else if (err instanceof ParamInUseError) {
        return {
          statusCode: 403,
          body: err.message
        }
      } else {
        console.error(err)
        return new HttpInternalServerError()
      }
    }
  }

  put = async httpRequest => {
    try {
      const token = httpRequest.token
      const { changes } = httpRequest.body

      await this.userService.edit(token, changes)

      return {
        statusCode: 200,
        body: 'Profile updated successfully.'
      }
    } catch (err) {
      if (err instanceof InvalidParamError) {
        return {
          statusCode: 400,
          body: err.message
        }
      } else {
        console.error(err)
        return new HttpInternalServerError()
      }
    }
  }
}
