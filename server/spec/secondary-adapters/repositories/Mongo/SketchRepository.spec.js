import mongodb from 'mongodb'
import MongoHelper from '../../../../lib/secondary-adapters/repositories/Mongo/helpers/mongo-helper.js'
import SketchRepository from '../../../../lib/secondary-adapters/repositories/Mongo/SketchRepository.js'

const { ObjectId } = mongodb
let sketchModel

beforeAll(async () => {
  await MongoHelper.connect(process.env.MONGO_URL)
  sketchModel = await MongoHelper.getCollection('sketches')
})
afterEach(async () => { await sketchModel.deleteMany({}) })
afterAll(async () => { await MongoHelper.disconnect() })

const sut = new SketchRepository()
const sampleSketch = {
  title: 'a beautiful sketch'
}

describe('Sketch Repository', () => {
  it('inserts a new sketch', async () => {
    const result = await sut.insert(sampleSketch)

    expect(result).toBe(true)
  })

  it('gets all the sketches', async () => {
    await sketchModel.insertMany([
      { title: 'sketch1' },
      { title: 'sketch2' }
    ], { ordered: false })

    const result = await sut.loadAll()

    expect(result[0].title).toBe('sketch1')
    expect(result[1].title).toBe('sketch2')
  })

  it('finds a sketch by its ID', async () => {
    await sketchModel.insertOne({
      _id: new ObjectId('5ec9b3d308d15319690d5a09'),
      title: 'sketch1'
    })

    const result = await sut.findById('5ec9b3d308d15319690d5a09')

    expect(result.title).toBe('sketch1')
  })

  it('updates a sketch', async () => {
    await sketchModel.insertOne({
      _id: new ObjectId('5ec9b3d308d15319690d5a09'),
      title: 'a sketch'
    })
    await sut.update({
      id: '5ec9b3d308d15319690d5a09',
      title: 'a updated sketch'
    })

    const updatedSketch = await sketchModel.findOne({ _id: ObjectId('5ec9b3d308d15319690d5a09') })

    expect(updatedSketch.title).toBe('a updated sketch')
  })
})
