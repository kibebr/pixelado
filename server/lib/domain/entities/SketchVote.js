export default class SketchVote {
  constructor ({ author, type, count }) {
    this.author = author
    this.type = type
    this.count = count || 1
  }
}
