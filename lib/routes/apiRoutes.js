import express from 'express'
import InteractionService from '../services/InteractionService'
import GlossaryService from '../services/GlossaryService'
import Glossary from '../models/Glossary'
import Interacion from '../models/Interaction'

var apiRouter = function (app) {
    const router = express.Router();   
    
    router.route("/glossary").get((request, response) => {
        return Glossary.find({}).lean().then(result => {
            response.send(result)
        })    
    })
    
    router.route("/interactions/:language").get((request, response) => {
        const language = request.params.language
        return Interacion.find({language}).lean().then(result => {
            response.send(result)
        })    
    })
    
    app.use('/api/v1', router)
}
module.exports = apiRouter;