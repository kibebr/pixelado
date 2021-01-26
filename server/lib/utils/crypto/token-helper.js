import jsonwebtoken from 'jsonwebtoken'

export default class TokenHelper {
  constructor (secret) {
    this.secret = secret
  }

  async encrypt (data) {
    return await jsonwebtoken.sign(data, this.secret)
  }

  async decrypt (encrypted) {
    return await jsonwebtoken.verify(encrypted, this.secret)
  }
}
