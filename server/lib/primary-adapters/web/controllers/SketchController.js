import BaseController from './BaseController.js'
import { InvalidParamError, ActionOverperformedError } from '../../../utils/errors/index.js'

export default class SketchController extends BaseController {
  constructor ({ SketchService }) {
    super()
    this.sketchService = SketchService
  }

  post = async httpRequest => {
    try {
      const token = httpRequest.token
      const { sketch } = httpRequest.body

      await this.sketchService.add(sketch, token)

      return {
        statusCode: 201,
        body: 'Sketch created!'
      }
    } catch (err) {
      if (err instanceof InvalidParamError) {
        return {
          statusCode: 400,
          body: err.message
        }
      }
      return this.handleInternalError(err)
    }
  }

  postComment = async httpRequest => {
    try {
      const token = httpRequest.token
      const { id } = httpRequest.params
      const { comment } = httpRequest.body

      await this.sketchService.addComment(id, comment, token)

      return {
        statusCode: 201,
        body: 'Commented!'
      }
    } catch (err) {
      if (err instanceof InvalidParamError) {
        console.log(err)
        return {
          statusCode: 400,
          body: err.message
        }
      }
      return this.handleInternalError(err)
    }
  }

  postVote = async httpRequest => {
    try {
      const token = httpRequest.token
      const { id, type } = httpRequest.params

      console.log(type)
      await this.sketchService.addVote(id, type, token)

      return {
        statusCode: 201,
        body: 'Voted!'
      }
    } catch (err) {
      if (err instanceof ActionOverperformedError) {
        return {
          statusCode: 403,
          body: err.message
        }
      } else {
        return this.handleInternalError(err)
      }
    }
  }

  getAll = async httpRequest => {
    try {
      const result = await this.sketchService.findAll({
        sortBy: httpRequest.query.sort_by
      })
      console.log(httpRequest)

      return {
        statusCode: 200,
        body: result
      }
    } catch (err) {
      return this.handleInternalError(err)
    }
  }

  getByID = async httpRequest => {
    try {
      const { id } = httpRequest.params

      if (!id) {
        return {
          statusCode: 400,
          body: 'Missing sketch ID parameter.'
        }
      }

      const sketch = await this.sketchService.findById(id)

      if (!sketch) {
        return {
          statusCode: 404,
          body: 'Sketch not found.'
        }
      } else {
        return {
          statusCode: 200,
          body: sketch
        }
      }
    } catch (err) {
      return this.handleInternalError(err)
    }
  }
}
