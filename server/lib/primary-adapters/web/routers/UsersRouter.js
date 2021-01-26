import express from 'express'
import Controllers from '../controllers/index.js'
import ExpressRouterAdapter from './ExpressRouterAdapter.js'
import { createRateLimiter } from '../middlewares/RateLimiting/RateLimiter.js'

export default function UsersRouter () {
  const router = express.Router()

  const postingUserRateLimiter = createRateLimiter({
    skipFailedRequests: true,
    max: 2,
    message: 'Oops, you have created too many accounts in a short period of time! Try again later!'
  })

  router.get('/:username', ExpressRouterAdapter.adapt(Controllers.UserController.getByUsername.bind(Controllers.UserController)))
  router.get('/:username/sketches', ExpressRouterAdapter.adapt(Controllers.UserController.getSketchesFromUsername.bind(Controllers.UserController)))
  router.post('/', postingUserRateLimiter, ExpressRouterAdapter.adapt(Controllers.UserController.post.bind(Controllers.UserController)))
  router.put('/', ExpressRouterAdapter.adapt(Controllers.UserController.put.bind(Controllers.UserController)))

  return router
}
