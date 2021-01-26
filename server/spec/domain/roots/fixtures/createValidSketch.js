import Sketch from '../../../../lib/domain/roots/Sketch.js'

export const createValidSketch = replacements => new Sketch({
  id: '5ec9b3d308d15319690d5a09',
  author: 'kibe',
  title: 'my beautiful sketch',
  size: Sketch.MIN_SIZE,
  boxes: {
    '0,0': 'black'
  },
  ...replacements
})
