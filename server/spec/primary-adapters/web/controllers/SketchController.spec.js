import SketchController from '../../../../lib/primary-adapters/web/controllers/SketchController.js'
import { InvalidParamError, ActionOverperformedError } from '../../../../lib/utils/errors/index.js'
import HttpInternalServerError from '../../../../lib/primary-adapters/web/controllers/errors/HttpInternalServerError.js'

const sketchServiceStub = new class SketchServiceStub {
  constructor () {
    this.inserted = true
  }

  add = async () => this.inserted
}()

const sut = new SketchController({ SketchService: sketchServiceStub })

describe('SketchController', () => {
  describe('POST', () => {
    it('returns 201 if stub there is no exception', async () => {
      const result = await sut.post({
        token: 'any_token',
        body: {
          sketch: {
            title: 'valid',
            size: 16,
            boxes: {}
          }
        }
      })

      expect(result).toStrictEqual({
        statusCode: 201,
        body: 'Sketch created!'
      })
    })

    it('returns 400 if stub throws an InvalidParamError', async () => {
      const error = new InvalidParamError('something')
      sketchServiceStub.add = jest.fn(() => { throw error })

      const result = await sut.post({
        token: 'any_token',
        body: {
          sketch: {
            title: 'inval|d',
            size: 999999999999,
            boxes: null
          }
        }
      })

      expect(result).toStrictEqual({
        statusCode: 400,
        body: error.message
      })
    })

    it('returns 500 if stub throws an internal error', async () => {
      sketchServiceStub.add = jest.fn(() => { throw new Error() })

      const result = await sut.post({
        token: 'any_token',
        body: {
          sketch: {
            title: 'inval|d',
            size: 999999999999,
            boxes: null
          }
        }
      })

      expect(result).toStrictEqual({
        statusCode: 500,
        body: new HttpInternalServerError().body
      })
    })
  })

  describe('POST COMMENT', () => {
    it('should return 201 if stub returns true', async () => {
      sketchServiceStub.addComment = jest.fn(() => true)

      const result = await sut.postComment({
        token: 'any_token',
        params: {
          id: 'any_id'
        },
        body: {
          comment: {}
        }
      })

      expect(result).toStrictEqual({
        statusCode: 201,
        body: 'Commented!'
      })
    })

    it('should return 500 if stub throws an internal error', async () => {
      sketchServiceStub.addComment = jest.fn(() => { throw new Error() })

      const result = await sut.postComment({
        token: 'any_token',
        params: {
          id: 'any_id'
        },
        body: {
          comment: {}
        }
      })

      expect(result).toStrictEqual({
        statusCode: 500,
        body: new HttpInternalServerError().body
      })
    })
  })

  describe('POST VOTE', () => {
    it('should return 201 if stub returns true', async () => {
      sketchServiceStub.addVote = jest.fn(() => true)

      const result = await sut.postVote({
        token: 'valid_token',
        params: {
          id: 'valid_id',
          type: 'upvote'
        }
      })

      expect(result).toStrictEqual({
        statusCode: 201,
        body: 'Voted!'
      })
    })

    it('should return 500 if stub throws an ActionOverperformedError (too many votes)', async () => {
      const error = new ActionOverperformedError('voted')
      sketchServiceStub.addVote = jest.fn(() => { throw error })

      const result = await sut.postVote({
        token: 'valid_token',
        params: {
          id: 'valid_id',
          type: 'upvote'
        }
      })

      expect(result).toStrictEqual({
        statusCode: 403,
        body: error.message
      })
    })

    it('should return 500 if stub throws an internal error', async () => {
      sketchServiceStub.addVote = jest.fn(() => { throw new Error() })

      const result = await sut.postVote({
        token: 'any_token',
        params: {
          id: 'any_id',
          type: 'upvote'
        }
      })

      expect(result).toStrictEqual({
        statusCode: 500,
        body: new HttpInternalServerError().body
      })
    })
  })
})
