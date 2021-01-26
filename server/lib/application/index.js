import { makeUserServiceFactory } from './makeUserServiceFactory.js'
import { makeSketchServiceFactory } from './makeSketchServiceFactory.js'

import UserRepository from '../secondary-adapters/repositories/Mongo/UserRepository.js'
import SketchRepository from '../secondary-adapters/repositories/Mongo/SketchRepository.js'

import { TokenHelper, HasherHelper } from '../utils/crypto/index.js'
import Presenter from '../primary-adapters/web/presenter/presenter.js'

const presenter = new Presenter()
const userRepository = new UserRepository()
const sketchRepository = new SketchRepository()

const userServiceFactory = makeUserServiceFactory({ UserRepository: userRepository })
const sketchServiceFactory = makeSketchServiceFactory({ SketchRepository: sketchRepository })

export const UserService = {
  add: userServiceFactory.makeAdd({ Hasher: HasherHelper }),
  auth: userServiceFactory.makeAuth({
    TokenGenerator: TokenHelper,
    Encrypter: HasherHelper
  }),
  edit: userServiceFactory.makeEdit({ TokenHelper: TokenHelper }),
  find: userServiceFactory.makeFind({ Presenter: presenter })
}

export const SketchService = {
  add: sketchServiceFactory.makeAdd({ TokenHelper: TokenHelper }),
  addComment: sketchServiceFactory.makeAddComment({ TokenHelper: TokenHelper }),
  addVote: sketchServiceFactory.makeAddVote({
    TokenHelper: TokenHelper,
    UserRepository: userRepository
  }),
  findAll: sketchServiceFactory.makeFindAll({ Presenter: presenter }),
  findById: sketchServiceFactory.makeFindById({ Presenter: presenter })
}
