import { InvalidParamError } from '../../utils/errors/index.js'

export default class SketchComment {
  constructor ({ author, date, content }) {
    this.author = author
    this.date = date
    this.content = content
  }

  static get MAX_CHARS () {
    return 200
  }

  static get MIN_CHARS () {
    return 10
  }

  static validate = sketchComment => {
    if (sketchComment.content.length > SketchComment.MAX_CHARS || sketchComment.content.length < SketchComment.MIN_CHARS) {
      throw new InvalidParamError('length')
    }
  }
}
