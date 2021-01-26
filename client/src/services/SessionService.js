import { SERVER_URI } from './Config.js'
import { promise } from './PromiseMaker.js'

export const login = (username, password) => (promise({
  url: `${SERVER_URI}/api/session`,
  type: 'POST',
  headers: [{ name: 'Content-type', value: 'application/json' }],
  errorMessage: 'There was a problem while logging in.',
  data: { username, password }
}))()

export const register = (username, email, password) => (promise({
  url: `${SERVER_URI}/api/users`,
  type: 'POST',
  headers: [{ name: 'Content-type', value: 'application/json' }],
  errorMessage: 'There was a problem while registering.',
  data: { username, email, password }
}))()
