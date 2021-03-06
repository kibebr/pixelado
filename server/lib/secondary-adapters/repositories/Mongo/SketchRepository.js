import MongoHelper from './helpers/mongo-helper.js'
import mongodb from 'mongodb'
import Sketch from '../../../domain/roots/Sketch.js'
import { objectIdToDate } from './Utils.js'

const { ObjectId } = mongodb
const getSketchModel = async () => await MongoHelper.getCollection('sketches')

const persistanceToDomain = p => new Sketch({
  ...p,
  date: objectIdToDate(p._id),
  id: p._id
})

export default class SketchRepository {
  insert = async sketch => {
    const sketchModel = await getSketchModel()
    const result = await sketchModel.insertOne(sketch)
    return (result.insertedCount > 0)
  }

  loadAll = async query => {
    const sketchModel = await getSketchModel()
    const sketchesData = await sketchModel.find().toArray()
    return sketchesData.map(persistanceToDomain)
  }

  load = async (sort, range) => {
    const sketchModel = await getSketchModel()
    const mongoSort = sort === 'popular' ? { totalVotes: -1 } : { _id: 1 }

    const data = await sketchModel
      .aggregate([
        {
          $addFields:
          {
            totalVotes:
            {
              $sum:
              {
                $map:
                {
                  input: { $objectToArray: '$votes' },
                  as: 'x',
                  in:
                  {
                    $reduce:
                    {
                      input: '$$x.v',
                      initialValue: 0,
                      in:
                      {
                        $add: ['$$value', '$$this.count']
                      }
                    }
                  }
                }
              }
            }
          }
        }
      ])
      .sort(mongoSort)

    if (range) {
      await data
        .skip(range[0])
        .limit(range[1])
    }

    const dataArr = await data.toArray()

    return dataArr.map(persistanceToDomain)
  }

  findById = async id => {
    const sketchModel = await getSketchModel()
    return persistanceToDomain(await sketchModel.findOne({ _id: ObjectId(id) }))
  }

  update = async sketch => {
    const sketchModel = await getSketchModel()
    await sketchModel.replaceOne({ _id: ObjectId(sketch.id) }, sketch)
  }
}
