import UserController from './UserController.js'
import SessionController from './SessionController.js'
import SketchController from './SketchController.js'
import { UserService, SketchService } from '../../../application/index.js'

export default {
  UserController: new UserController({ UserService }),
  SessionController: new SessionController({ UserService }),
  SketchController: new SketchController({ SketchService })
}
