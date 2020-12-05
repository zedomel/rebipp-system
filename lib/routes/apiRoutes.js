import express from 'express'
import InteractionService from '../services/InteractionService'
import TermService from '../services/TermService'
import Term from '../models/Term'
import Interacion from '../models/Interaction'
import TableService from '../services/TableService'

var apiRouter = function (app) {
    const router = express.Router();   
    
    router.route("/table/publish").get((request, response) => {
        const url = request.query.url
        console.log(`[${new Date().toISOString()}] PUBLISH `,url)
        if(!url) {
            throw new Error("URL was not supplied")
        }
        return TableService.importTable(url)
            .then(result => {
                console.log(`[${new Date().toISOString()}] RESULT`,result)
                return response.send(result)
            }).catch(error => {
                console.log(`[${new Date().toISOString()}] ERROR`,error)
            })
    })
    router.route("/table/update-terms").get((request, response) => {
        const url = request.query.url
        console.log(`[${new Date().toISOString()}] PUBLISH `,url)
        if(!url) {
            throw new Error("URL was not supplied")
        }
        return TableService.updateTerms(url)
            .then(result => {
                console.log(`[${new Date().toISOString()}] RESULT`,result)
                return response.send(result)
            }).catch(error => {
                console.log(`[${new Date().toISOString()}] ERROR`,error)
            })
    })

    router.route("/glossary").get((request, response) => {
        return Term.find({}).lean().then(result => {
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