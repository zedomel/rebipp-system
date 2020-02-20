export const port = process.env.PORT || 3000
export const mongoHost = process.env.MONGO_HOST || 'localhost'
export const mongoUrl = process.env.MONGO_URL || `mongodb://${mongoHost}:27017`