import MongoHelper from './helpers/mongo-helper.js'
import mongodb from 'mongodb'
import Sketch from '../../../domain/roots/Sketch.js'

const { ObjectId } = mongodb
const getSketchModel = async () => await MongoHelper.getCollection('sketches')

export const compare = (a, b) => {
  const aVotes = Sketch.getAllVotes(a)
  const bVotes = Sketch.getAllVotes(b)

  if (aVotes > bVotes) {
    return -1
  } else if (aVotes < bVotes) {
    return 1
  } else {
    return 0
  }
}

export default class SketchRepository {
  insert = async sketch => {
    const sketchModel = await getSketchModel()
    const result = await sketchModel.insertOne(sketch)
    return (result.insertedCount > 0)
  }

  loadAll = async query => {
    const sketchModel = await getSketchModel()
    const sketchesData = await sketchModel.find().toArray()
    return sketchesData.map(sketchData => new Sketch({
      ...sketchData,
      id: sketchData._id
    }))
  }

  loadByPopularity = async query => {
    const sketchModel = await getSketchModel()
    const sketchesData = await sketchModel.find().toArray()

    // sketchesData.sort(compare)
    const returned = sketchModel
      .find()
      .sort({ 'votes.claps': 1, 'votes.ab': 1 })
      .toArray()

    return returned
  }

  findById = async id => {
    const sketchModel = await getSketchModel()
    const sketchData = await sketchModel.findOne({ _id: ObjectId(id) })
    return sketchData && new Sketch({
      ...sketchData,
      id: sketchData._id
    })
  }

  update = async sketch => {
    const sketchModel = await getSketchModel()
    await sketchModel.replaceOne({ _id: ObjectId(sketch.id) }, sketch)
  }
}
