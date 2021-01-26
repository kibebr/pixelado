import { SERVER_URI } from './Config.js'
import { promise } from './PromiseMaker.js'

export const fetchUserWithUsername = username => (promise({
  url: `${SERVER_URI}/api/users/${username}`,
  type: 'GET',
  errorMessage: 'There was a problem while fetching this user.'
}))()

export const updateUserProfile = ({ changes, token }) => (promise({
  url: `${SERVER_URI}/api/users`,
  type: 'PUT',
  headers: [{
    name: 'Content-type',
    value: 'application/json'
  }, {
    name: 'Authorization',
    value: `Bearer ${token}`
  }],
  errorMessage: 'There was a problem while updating the profile.',
  data: { changes }
}))()
