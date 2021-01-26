import SketchComment from '../../../../domain/entities/SketchComment.js'

export const createValidSketchComment = replacements => new SketchComment({
  author: 'kibe',
  content: 'a valid comment =)',
  ...replacements
})
