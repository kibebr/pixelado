import mongodb from 'mongodb'
import MongoHelper from '../../../../lib/secondary-adapters/repositories/Mongo/helpers/mongo-helper.js'
import SketchRepository from '../../../../lib/secondary-adapters/repositories/Mongo/SketchRepository.js'
import { createValidSketch } from '../../../domain/roots/fixtures/createValidSketch.js'

const { ObjectId } = mongodb
let sketchModel

beforeAll(async () => {
  await MongoHelper.connect(process.env.MONGO_URL)
  sketchModel = await MongoHelper.getCollection('sketches')
})
afterEach(async () => { await sketchModel.deleteMany({}) })
afterAll(async () => { await MongoHelper.disconnect() })

const sut = new SketchRepository()

describe('Sketch Repository', () => {
  it('inserts a new sketch', async () => {
    const sketch = createValidSketch({ title: 'tobefound' })
    await sut.insert(sketch)

    const allSketches = await sketchModel.find().toArray()

    expect(() => allSketches.find(s => s.title === sketch.title)).toBeTruthy()
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

  it('sort sketches by popularity', async () => {
    const sketch1 = createValidSketch({ title: 'last' })
    sketch1.addVote({
      author: 'kibe',
      type: 'claps',
      count: 5
    })
    const sketch2 = createValidSketch({ title: 'first' })
    sketch2.addVote({
      author: 'kibe',
      type: 'claps',
      count: 10
    })

    await sketchModel.insertMany([sketch1, sketch2])

    const result = await sut.loadByPopularity()
    expect(result[0].title).toBe('first')
    expect(result[1].title).toBe('last')
  })

  it('sort sketches by popularity', async () => {
    const sketch1 = createValidSketch({ title: 'last' })
    sketch1.addVote({
      author: 'kibe',
      type: 'claps',
      count: 5
    })
    sketch1.addVote({
      author: 'kibe',
      type: 'ab',
      count: 10
    })

    const sketch2 = createValidSketch({ title: 'first' })
    sketch2.addVote({
      author: 'kibe',
      type: 'claps',
      count: 10
    })

    await sketchModel.insertMany([sketch1, sketch2])

    const result = await sut.loadByPopularity()
    expect(result[0].title).toBe('last')
    expect(result[1].title).toBe('first')
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
