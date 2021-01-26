import mongodb from 'mongodb'
import MongoHelper from '../../../../lib/secondary-adapters/repositories/Mongo/helpers/mongo-helper.js'
import UserRepository from '../../../../lib/secondary-adapters/repositories/Mongo/UserRepository.js'
let userModel
const { ObjectId } = mongodb

beforeAll(async () => {
  await MongoHelper.connect(process.env.MONGO_URL)
  userModel = await MongoHelper.getCollection('users')
})
afterEach(async () => { await userModel.deleteMany({}) })
afterAll(async () => { await MongoHelper.disconnect() })

const sut = new UserRepository()
const sampleUser = {
  _id: 'any_id',
  username: 'any_username',
  email: 'any_email@mail.com',
  password: 'any_hash',
  sketches: []
}
const sampleSketch = {
  _id: new ObjectId(),
  title: 'a beautiful sketch',
  author: 'any_author'
}

describe('User Repository - MONGO', () => {
  describe('insert()', () => {
    it('inserts a sample user', async () => {
      const result = await sut.insert(sampleUser)

      expect(result).toBe(true)
    })
  })

  describe('loadByUsername()', () => {
    it('finds a sample user', async () => {
      await sut.insert(sampleUser)

      const result = await sut.loadBy({ username: sampleUser.username })

      expect(result.username).toBe(sampleUser.username)
      expect(result.email).toBe(sampleUser.email)
    })

    it('finds a sample user and returns with their sketches', async () => {
      await sut.insert(sampleUser)
      const sketchModel = await MongoHelper.getCollection('sketches')

      await sketchModel.insertMany([{
        ...sampleSketch,
        _id: '1',
        author: sampleUser.username
      }, {
        ...sampleSketch,
        _id: '2',
        author: sampleUser.username
      }])

      const result = await sut.loadBy({ username: sampleUser.username })

      expect(result.sketches[0]._id).toBe('1')
      expect(result.sketches[1]._id).toBe('2')
    })

    it('uses collation when finding by username', async () => {
      const defaultName = 'kibe'
      const namesToTest = ['kiBe', 'KIBE', 'Kibe']
      await sut.insert({ username: defaultName })

      for (const name of namesToTest) {
        const result = await sut.loadBy({ username: name })
        expect(result.username).toBe(defaultName)
      }
    })

    it('uses collation when finding by email', async () => {
      const defaultEmail = 'kibe@mail.com'
      const emailsToTest = ['kiBe@mAil.cOm', 'KIBE@MAIL.COM', 'Kibe@mail.com']
      await sut.insert({ email: defaultEmail })

      for (const email of emailsToTest) {
        const result = await sut.loadBy({ email: email })
        expect(result.email).toBe(defaultEmail)
      }
    })
  })

  describe('loadAnyWith()', () => {
    it('finds a user with one or more queries equal', async () => {
      const user = {
        username: 'kibe',
        email: 'kibe@mail.com'
      }
      await sut.insert(user)

      const result = await sut.loadAnyWith([{ username: 'any' }, { email: user.email }])

      expect(result).toEqual(user)
    })
  })
})
