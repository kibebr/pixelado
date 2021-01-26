import HttpInternalServerError from './errors/HttpInternalServerError.js'

export default class BaseController {
  handleInternalError = (err) => {
    console.error(err)
    return new HttpInternalServerError()
  }
}
