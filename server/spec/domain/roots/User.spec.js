import { InvalidParamError } from '../../../lib/utils/errors/'
import User from '../../../lib/domain/roots/User.js'

describe('User Validator', () => {
  describe('Validation', () => {
    it('should throw InvalidParamError("username") if username is not alphanumeric', () => {
      const user = new User('$$$$$', 'valid_email@mail.com')

      const result = () => User.validate(user)

      expect(result).toThrow(InvalidParamError)
    })

    it('should throw InvalidParamError("email") if email is not email', () => {
      const user = new User('validUsername', 'invalid@')

      const result = () => User.validate(user)

      expect(result).toThrow(InvalidParamError)
    })
  })

  describe('Changing biography', () => {
    it('should throw if biography has 50+ characters', () => {
      const sut = new User('validUsername', 'valid_email@mail.com')

      const result = () => sut.setBiography('Lorem ipsum dolor sit amet, consectetuer adipiscin')

      expect(result).toThrow()
    })

    it('should throw if biography has no characters', () => {
      const sut = new User('validUsername', 'valid_email@mail.com')

      const result = () => sut.setBiography('')

      expect(result).toThrow()
    })
  })

  describe('Editing user', () => {
    it('calls "set Biography" function if changes include a "biography" field', () => {
      const changes = {
        biography: 'new bio!!'
      }
      const sut = new User('validUsername', 'valid_email@mail.com')
      const spy = jest.spyOn(sut, 'setBiography')

      sut.editFrom(changes)

      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(changes.biography)
    })

    it('should not call "setBiography" func if changes does NOT include a "biography" field', () => {
      const changes = {
        someOtherField: 'x'
      }
      const sut = new User('validUsername', 'valid_email@mail.com')
      const spy = jest.spyOn(sut, 'setBiography')

      sut.editFrom(changes)

      expect(spy).toHaveBeenCalledTimes(0)
    })
  })

  describe('Karma', () => {
    it('adds 1 karma to user', () => {
      const user = new User('username', 'email')

      user.addKarma(1)

      expect(user.karma).toBe(1)
    })

    it('adds 5 karma to user', () => {
      const user = new User('username', 'email')

      user.addKarma(5)

      expect(user.karma).toBe(5)
    })
  })
})
