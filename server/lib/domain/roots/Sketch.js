import { InvalidParamError, ActionOverperformedError } from '../../utils/errors/index.js'

export default class Sketch {
  constructor ({ id, author, title, size, boxes, votes, comments, dominantColors }) {
    this.id = id
    this.author = author
    this.title = title
    this.size = size
    this.boxes = boxes
    this.votes = votes || {}
    this.comments = comments || []
    this.dominantColors = dominantColors
  }

  addComment = sketchComment => {
    this.comments.forEach(comment => {
      if (comment.author === sketchComment.author && comment.content === sketchComment.content) {
        throw new InvalidParamError('repetition') // TODO: create better error
      }
    })

    this.comments.push(sketchComment)
  }

  addVote = ({ author, type, count }) => {
    const toBeInserted = {
      author: author,
      count: count
    }

    if (this.votes[type]) {
      for (const vote of this.votes[type]) {
        if (vote.author === author) {
          if ((vote.count + count) > 10) {
            throw new ActionOverperformedError('voted')
          } else {
            vote.count += count
            return
          }
        }
      }

      this.votes[type].push(toBeInserted)
    } else {
      this.votes[type] = [toBeInserted]
    }
  }

  static get MAX_SIZE () {
    return 64
  }

  static get MIN_SIZE () {
    return 16
  }

  static validate = sketch => {
    if (!sketch.author) {
      throw new InvalidParamError('author')
    } else if (!sketch.title) {
      throw new InvalidParamError('title')
    } else if (((sketch.size.w < Sketch.MIN_SIZE || sketch.size.h < Sketch.MIN_SIZE) || (sketch.size.w > Sketch.MAX_SIZE || sketch.size.h > Sketch.MAX_SIZE))) {
      throw new InvalidParamError('size')
    } else if (!sketch.title.match(/^[a-z0-9 ]+$/i)) {
      throw new InvalidParamError('title')
    }
  }
}
