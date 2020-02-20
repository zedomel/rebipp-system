
import { Schema } from 'mongoose'
import { mongoServiceConnection } from '../mongoConnections'
import uuid from 'node-uuid' 

const Interaction = new Schema({
    _id: {type: String, default: uuid.v4}    
}, {strict:false })

export default mongoServiceConnection.model('interaction', Interaction) 