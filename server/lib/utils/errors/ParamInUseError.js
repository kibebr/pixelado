export default class ParamInUseError extends Error {
  constructor (param) {
    super(`Oops, ${param} is already taken!`)
    this.param = param
    this.name = 'ParamInUseError'
  }
}
