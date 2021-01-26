import { ParamInUseError } from '../utils/errors/index.js'
import User from '../domain/roots/User.js'

export const makeUserServiceFactory = ({ UserRepository }) => ({
  makeAdd: ({ Hasher }) => async ({ username, email, password }) => {
    const user = new User(username, email)
    const existentUser = await UserRepository.loadAnyWith([{ username }, { email }])

    if (existentUser) {
      if (existentUser.username === user.username) {
        throw new ParamInUseError('username')
      } else {
        throw new ParamInUseError('email')
      }
    }

    User.validate(user)

    await UserRepository.insert({
      ...user,
      password: await Hasher.hash(password)
    })

    return true
  },

  makeAuth: ({ TokenGenerator, Encrypter }) => async ({ username, password }) => {
    const user = await UserRepository.loadBy({ username: username })
    const isValid = user && await Encrypter.compare(password, user.password)

    if (isValid) {
      return {
        token: await TokenGenerator.encrypt({ id: user._id, username: user.username }),
        username: user.username,
        karma: user.karma
      }
    } else {
      return null
    }
  },

  makeEdit: ({ TokenHelper }) => async (token, changes) => {
    const user = await UserRepository.loadBy({
      username: (await TokenHelper.decrypt(token)).username
    })

    user.editFrom(changes)

    await UserRepository.update(user)
  },

  makeFind: ({ Presenter }) => async user => ((user = await UserRepository.loadBy(user))) ? Presenter.toUserDto(user) : null
})
