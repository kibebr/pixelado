import dotenv from 'dotenv'
dotenv.config()

export const MONGODB_URI = (process.env.NODE_ENV === 'test')
  ? process.env.MONGODB_URI_TEST
  : process.env.MONGODB_URI

export const SERVER_URI = (process.env.NODE_ENV === 'test')
  ? process.env.SERVER_URI_TEST
  : process.env.SERVER_URI

export const PORT = process.env.PORT

export const SECRET = process.env.SECRET
