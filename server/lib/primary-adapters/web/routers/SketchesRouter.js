import express from 'express'
import Controllers from '../controllers/index.js'
import ExpressRouterAdapter from './ExpressRouterAdapter.js'
import { createRateLimiter } from '../middlewares/RateLimiting/RateLimiter.js'

export default function SketchesRouter () {
  const router = express.Router()

  const postingSketchRateLimiter = createRateLimiter({
    windowMs: 3600000,
    max: 5,
    message: 'Oops, you have created too many sketches! Try again later!'
  })

  router.get('/', ExpressRouterAdapter.adapt(Controllers.SketchController.getAll.bind(Controllers.SketchController)))
  router.get('/:id', ExpressRouterAdapter.adapt(Controllers.SketchController.getByID.bind(Controllers.SketchController)))
  router.post('/', postingSketchRateLimiter, ExpressRouterAdapter.adapt(Controllers.SketchController.post.bind(Controllers.SketchController)))
  router.post('/:id/votes/:type', ExpressRouterAdapter.adapt(Controllers.SketchController.postVote.bind(Controllers.SketchController)))
  router.post('/:id/comments', ExpressRouterAdapter.adapt(Controllers.SketchController.postComment.bind(Controllers.SketchController)))

  return router
}
