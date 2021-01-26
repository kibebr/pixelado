console.log(process.env.SERVER_URI_TEST)
export const SERVER_URI = process.env.NODE_ENV === 'production' ? process.env.SERVER_URI : process.env.SERVER_URI_TEST
