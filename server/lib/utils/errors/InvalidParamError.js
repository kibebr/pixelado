export default class InvalidParamError extends Error {
  constructor (param) {
    super(`Oops, ${param} seems invalid!`)
    this.param = param
    this.name = 'InvalidParamError'
  }
}
