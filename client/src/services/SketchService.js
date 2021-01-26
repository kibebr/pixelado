import { SERVER_URI } from './Config.js'
import { promise } from './PromiseMaker.js'

export const fetchSketchWithId = id => (promise({
  url: `${SERVER_URI}/api/sketches/${id}`,
  type: 'GET',
  errorMessage: 'There was a problem while fetching the sketch.'
}))()

export const fetchSketches = promise({
  url: `${SERVER_URI}/api/sketches`,
  type: 'GET',
  errorMessage: 'There was a problem while fetching the sketches.'
})

export const sendVote = (sketchId, type, token) => (promise({
  url: `${SERVER_URI}/api/sketches/${sketchId}/votes/${type}`,
  type: 'POST',
  headers: [{ name: 'Authorization', value: `Bearer ${token}` }],
  errorMessage: 'There was a problem while voting on a sketch.'
}))()

export const submitSketch = ({ sketch, token }) => (promise({
  url: `${SERVER_URI}/api/sketches`,
  type: 'POST',
  headers: [{
    name: 'Content-type',
    value: 'application/json'
  }, {
    name: 'Authorization',
    value: `Bearer ${token}`
  }],
  errorMessage: 'There was a problem while submitting your sketch.',
  data: { sketch }
}))()

export const submitComment = ({ sketchId, comment, token }) => (promise({
  url: `${SERVER_URI}/api/sketches/${sketchId}/comments`,
  type: 'POST',
  headers: [{
    name: 'Content-type',
    value: 'application/json'
  }, {
    name: 'Authorization',
    value: `Bearer ${token}`
  }],
  errorMessage: 'There was a problem while commenting on this sketch.',
  data: { sketchId, comment }
}))()
