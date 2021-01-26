import MongoHelper from './helpers/mongo-helper.js'
import mongodb from 'mongodb'
import Sketch from '../../../domain/roots/Sketch.js'

const { ObjectId } = mongodb
const getSketchModel = async () => await MongoHelper.getCollection('sketches')

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
