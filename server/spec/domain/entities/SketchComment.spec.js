import SketchComment from '../../../lib/domain/entities/SketchComment.js'

describe('SketchComment', () => {
  describe('Validation', () => {
    it('should throw InvalidParamError if content is larger than max chars', () => {
      expect.assertions(2)
      let content = ''

      for (let i = 0; i < SketchComment.MAX_CHARS + 1; ++i) {
        content += 'x'
      }

      const sut = new SketchComment({
        author: 'any_author',
        content
      })

      try {
        SketchComment.validate(sut)
      } catch (err) {
        expect(err.name).toBe('InvalidParamError')
        expect(err.param).toBe('length')
      }
    })

    it('should not throw if comment has valid length', () => {
      let content = ''

      for (let i = 0; i < SketchComment.MAX_CHARS - 1; ++i) {
        content += 'x'
      }

      const sut = new SketchComment({
        author: 'any_author',
        content
      })

      expect(() => SketchComment.validate(sut)).not.toThrow()
    })

    it('should throw InvalidParamError if content is not enough', () => {
      expect.assertions(2)

      let content = ''

      for (let i = 0; i < SketchComment.MIN_CHARS - 1; ++i) {
        content += 'x'
      }

      const sut = new SketchComment({
        author: 'any_author',
        content
      })

      try {
        SketchComment.validate(sut)
      } catch (err) {
        expect(err.name).toBe('InvalidParamError')
        expect(err.param).toBe('length')
      }
    })
  })
})
