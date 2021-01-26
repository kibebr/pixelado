import bcrypt from 'bcryptjs'
import HasherHelper from '../../lib/utils/crypto/hasher-helper.js'

describe('HasherHelper', () => {
  describe('compare()', () => {
    it('should throw if bcrypt`s compare() throws', async () => {
      const sut = new HasherHelper()
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementationOnce(() => { throw new Error() })
      const promise = sut.compare('any_pwd', 'any_hashedPwd')
      expect(promise).rejects.toThrow()
    })
  })

  describe('hash()', () => {
    it('should throw if bcrypt`s hash() throws', async () => {
      const sut = new HasherHelper()
      jest
        .spyOn(bcrypt, 'hash')
        .mockImplementationOnce(() => { throw new Error() })
      const promise = sut.hash('any_pwd', sut.SALT_ROUNDS)
      expect(promise).rejects.toThrow()
    })
  })
})
