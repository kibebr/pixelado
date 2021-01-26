export default class ActionOverperformedError extends Error {
  constructor (verb) {
    super(`Oops, you have ${verb} too many times!`)
    this.verb = verb
    this.name = 'ActionOverperformedError'
  }
}
