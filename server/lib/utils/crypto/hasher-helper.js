import bcrypt from 'bcryptjs'

export default class HasherHelper {
  constructor () {
    this.SALT_ROUNDS = 10
  }

  compare = async (pwd, hashedPwd) => await bcrypt.compare(pwd, hashedPwd)
  hash = async (pwd) => await bcrypt.hash(pwd, this.SALT_ROUNDS)
}
