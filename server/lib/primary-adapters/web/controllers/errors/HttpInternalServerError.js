export default class HttpInternalServerError {
  constructor () {
    return {
      statusCode: 500,
      body: 'Internal server error.'
    }
  }
}
