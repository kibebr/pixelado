import express from 'express'
import Controllers from '../controllers/index.js'
import ExpressRouterAdapter from './ExpressRouterAdapter.js'

export default function SessionRouter () {
  const router = express.Router()

  router.post('/', ExpressRouterAdapter.adapt(Controllers.SessionController.post.bind(Controllers.SessionController)))

  return router
}
