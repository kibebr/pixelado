import Sketch from '../domain/roots/Sketch.js'
import SketchComment from '../domain/entities/SketchComment.js'

export const makeSketchServiceFactory = ({ SketchRepository }) => ({
  makeAdd: ({ TokenHelper }) => async (sketchData, userToken) => {
    const authorUsername = (await TokenHelper.decrypt(userToken)).username

    const sketch = new Sketch({
      author: authorUsername,
      title: sketchData.title,
      size: sketchData.size,
      boxes: sketchData.boxes
    })

    Sketch.validate(sketch)

    await SketchRepository.insert(sketch)
  },

  makeAddVote: ({ TokenHelper, UserRepository }) => async (sketchID, type, userToken) => {
    const voter = (await TokenHelper.decrypt(userToken)).username
    const sketch = await SketchRepository.findById(sketchID)
    const author = await UserRepository.loadBy({ username: sketch.author })

    sketch.addVote({
      author: voter,
      type: type,
      count: 1
    })
    author.addKarma(1)

    await SketchRepository.update(sketch)
    await UserRepository.update(author)
  },

  makeAddComment: ({ TokenHelper }) => async (sketchID, commentData, userToken) => {
    const authorUsername = (await TokenHelper.decrypt(userToken)).username
    const sketch = await SketchRepository.findById(sketchID)

    const sketchComment = new SketchComment({
      ...commentData,
      author: authorUsername
    })
    SketchComment.validate(sketchComment)
    sketch.addComment(sketchComment)

    await SketchRepository.update(sketch)
  },

  makeFindAll: ({ Presenter }) => async ({ sortBy }) => {
    let sketches

    if (sortBy === 'popular') {
      sketches = await SketchRepository.loadByPopularity()
    } else {
      sketches = await SketchRepository.loadByDate()
    }

    if (sketches) {
      return sketches.map(Presenter.toSketchDto)
    }
  },

  makeFindById: ({ Presenter }) => async id => {
    let sketch
    return ((sketch = await SketchRepository.findById(id))) ? Presenter.toSketchDto(sketch) : null
  }
})

export default makeSketchServiceFactory
