import { InvalidParamError } from '../../utils/errors/index.js'
import ProfileSketch from '../entities/ProfileSketch.js'

export default class User {
  constructor (username, email) {
    this.username = username
    this.email = email
    this.profileSketch = new ProfileSketch({
      boxes: {
        37: 'black',
        42: 'black',
        53: 'black',
        58: 'black',
        69: 'black',
        74: 'black',
        85: 'black',
        90: 'black',
        101: 'black',
        106: 'black',
        117: 'black',
        122: 'black',
        133: 'black',
        138: 'black',
        147: 'black',
        156: 'black',
        163: 'black',
        164: 'black',
        171: 'black',
        172: 'black',
        180: 'black',
        181: 'black',
        186: 'black',
        187: 'black',
        197: 'black',
        198: 'black',
        199: 'black',
        200: 'black',
        201: 'black',
        202: 'black'
      }
    })
    this.karma = 0
    this.accentColor = 'grey'
    this.biography = 'This user prefers to remain mysterious.'
    this.sketches = []
  }

  editFrom = changes => {
    if (changes?.biography) {
      this.setBiography(changes.biography)
    }

    if (changes?.profileSketchBoxes) {
      this.setProfileSketchBoxes(changes.profileSketchBoxes)
    }
  }

  setProfileSketchBoxes = boxes => {
    this.profileSketch = new ProfileSketch({ boxes })
  }

  addKarma = quantity => {
    this.karma += quantity
  }

  setBiography = bio => {
    if (bio.length >= 50 || bio.length === 0) {
      throw new InvalidParamError('biography')
    } else {
      this.biography = bio
    }
  }

  static validate = user => {
    if (!user.username.match(/^[a-z0-9]+$/i)) {
      throw new InvalidParamError('username')
    } else if (!user.email.match(/^\S+@\S+$/)) {
      throw new InvalidParamError('email')
    }
  }
}
