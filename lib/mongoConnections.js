import mongoose from 'mongoose'

import { mongoUrl } from './config.js'

const connectionOptions = { useNewUrlParser: true, useUnifiedTopology: true }

mongoose.Promise = Promise

function handleConnectionError(err, dbName) {
    if (err) {
        console.error(`[${new Date().toISOString()}] ${dbName} mongo could not be connected`, err)
    } else {
        console.log(`[${new Date().toISOString()}] ${dbName} mongo connected successfully`)
    }
}

export const mongoServiceConnection = mongoose.createConnection(`${mongoUrl}`, connectionOptions, (err) => handleConnectionError(err, 'rebipp-system'))
