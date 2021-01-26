import express from 'express'
import cors from 'cors'
import MongoHelper from './secondary-adapters/repositories/Mongo/helpers/mongo-helper.js'
import UsersRouter from './primary-adapters/web/routers/UsersRouter.js'
import SessionRouter from './primary-adapters/web/routers/SessionRouter.js'
import SketchesRouter from './primary-adapters/web/routers/SketchesRouter.js'
import { PORT, MONGODB_URI } from './config.js'
import { createRateLimiter } from './primary-adapters/web/middlewares/RateLimiting/RateLimiter.js'

const app = express()
const defaultRateLimiter = createRateLimiter()

app.use(express.json())
app.use(cors())
app.use(defaultRateLimiter)
app.use('/api/users', UsersRouter())
app.use('/api/sketches', SketchesRouter())
app.use('/api/session', SessionRouter())

MongoHelper.connect(MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => { console.log(`Server is running on port ${PORT}.`) })
  })
  .catch((err) => console.error(err))

const cleanup = async () => {
  console.log('Exiting...')
  await MongoHelper.disconnect()
  process.exit()
}

process.on('exit', cleanup)
process.on('SIGINT', cleanup)
