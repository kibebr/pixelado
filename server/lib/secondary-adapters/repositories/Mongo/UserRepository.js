import mongodb from 'mongodb'
import MongoHelper from './helpers/mongo-helper.js'
import User from '../../../domain/roots/User.js'

const { ObjectId } = mongodb
const getUserModel = async () => await MongoHelper.getCollection('users')

export default class UserRepository {
  loadBy = async query => {
    const userModel = await getUserModel()
    const data = await userModel
      .aggregate(
        [
          { $match: { $or: [query] } },
          { $lookup: { from: 'sketches', localField: 'username', foreignField: 'author', as: 'sketches' } },
          { $limit: 1 }
        ],
        { collation: { locale: 'en', strength: 2 } }).toArray()

    if (!data.length) {
      return null
    } else {
      const user = new User()

      for (const field in data[0]) {
        user[field] = data[0][field]
      }

      return user
    }
  }

  loadAnyWith = async query => {
    const userModel = await getUserModel()
    return await userModel
      .findOne({ $or: query }, { collation: { locale: 'en', strength: 2 } })
  }

  insert = async user => {
    const userModel = await getUserModel()
    const result = await userModel
      .insertOne(user)
    return (result.insertedCount > 0)
  }

  update = async user => {
    const userModel = await getUserModel()
    return await userModel
      .replaceOne({ _id: ObjectId(user._id) }, user)
  }
}
