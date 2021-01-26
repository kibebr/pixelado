import { SECRET } from '../../config.js'
import TokenHelper from './token-helper.js'
import HasherHelper from './hasher-helper.js'

const tokenHelper = new TokenHelper(SECRET)
const hasherHelper = new HasherHelper()

export { tokenHelper as TokenHelper, hasherHelper as HasherHelper }
