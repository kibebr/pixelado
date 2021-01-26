import TokenHelper from '../../lib/utils/crypto/token-helper.js'
import jsonwebtoken from 'jsonwebtoken'

jest.mock('jsonwebtoken', () => ({
  async sign () {
    return 'any_token'
  },

  async verify () {
    return 'any_value'
  }
}))

describe('TokenHelper', () => {
  describe('sign()', () => {
    it('should throw if sign() throws', async () => {
      const sut = new TokenHelper('secret')
      jest
        .spyOn(jsonwebtoken, 'sign')
        .mockImplementationOnce(() => { throw new Error() })
      const promise = sut.encrypt('any_id')
      expect(promise).rejects.toThrow()
    })

    it('returns a token if nothing wrong happens', async () => {
      const sut = new TokenHelper('secret')
      const accessToken = await sut.encrypt('any_id')
      expect(accessToken).toBe('any_token')
    })
  })

  describe('verify()', () => {
    it('should throw if verify() throws', async () => {
      const sut = new TokenHelper('secret')
      jest
        .spyOn(jsonwebtoken, 'verify')
        .mockImplementationOnce(() => { throw new Error() })
      const promise = sut.decrypt('any_token')
      expect(promise).rejects.toThrow()
    })

    it('returns a value if nothing wrong happens', async () => {
      const sut = new TokenHelper('secret')
      const value = await sut.decrypt('any_token')
      expect(value).toBe('any_value')
    })

    it('should call verify() with the correct values', async () => {
      const sut = new TokenHelper('secret')
      const signSpy = jest.spyOn(jsonwebtoken, 'verify')
      await sut.decrypt('any_token')
      expect(signSpy).toHaveBeenCalledWith('any_token', 'secret')
    })
  })
})
