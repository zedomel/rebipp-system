import express from 'express'
import InteractionService from '../services/InteractionService'
import TermService from '../services/TermService'
import Term from '../models/Term'
import Interacion from '../models/Interaction'
import TableService from '../services/TableService'

var apiRouter = function (app) {
    const router = express.Router();   
    
    router.route("/table/publish").get((request, response) => {
        const {url, adminTableId} = request.query
        console.log(`[${new Date().toISOString()}] PUBLISH `,url)
        if(!url) {
            throw new Error("URL was not supplied")
        }
        return TableService.importTable(url)
            .then(async ({experimentId, originalLanguage, records}) => {
                records = await TableService.includeDatasetMetadata(url, records)
                records = await InteractionService.translate(experimentId, originalLanguage, records)
                TableService.updateDatabaseTablePublish(url, adminTableId, "PUBLISHED")
                return response.send({experimentId, records})
            }).catch(error => {
                TableService.updateDatabaseTablePublish(url, adminTableId, `ERROR ON PUBLISH: ${error.message}`)
                console.log(`[${new Date().toISOString()}] ERROR ON PUBLISH`,error)
            })
    })
    
    router.route("/table/delete").get((request, response) => {
        const {url, adminTableId} = request.query
        console.log(`[${new Date().toISOString()}] DELETING `,url)
        if(!url) {
            throw new Error("URL was not supplied")
        }
        return TableService.deleteTable(url)
            .then(result => {
                console.log(`[${new Date().toISOString()}] DELETED`, {url})
                TableService.updateDatabaseTableDelete(url, adminTableId, "DELETED")
                return response.send({SUCCESS: true})
            }).catch(error => {
                TableService.updateDatabaseTableDelete(url, adminTableId, `ERROR ON DELETE: ${error.message}`)
                console.log(`[${new Date().toISOString()}] ERROR`,error)
            })
    })
    router.route("/table/update-terms").get((request, response) => {
        const {url, adminTableId} = request.query
        console.log(`[${new Date().toISOString()}] PUBLISH `,url, adminTableId)
        if(!url) {
            throw new Error("URL was not supplied")
        }
        return TableService.updateTerms(url)
            .then(result => {
                console.log(`[${new Date().toISOString()}] RESULT`,result)
                TableService.updateTermsTable(url, adminTableId, "PUBLISHED")
                return response.send(result)
            }).catch(error => {
                TableService.updateTermsTable(url, adminTableId, `ERROR ON PUBLISH: ${error.message}`)
                console.log(`[${new Date().toISOString()}] ERROR`,error)
            })
    })

    router.route("/terms/:language/interactionType").get(async (request, response) => {
        const language = request.params.language
        const result = await Term.find({term:"interactionType",language, state:{$exists:true}}).lean().then(records => {
            return records.map(record => record["vocabulary"])
        })    
        return response.send(result)
    })
    router.route("/interactions/:language").get((request, response) => {
        const language = request.params.language
        let { page, filterPlantName, filterInteractionType, filterAnimalName, filterSource } = request.query
        page = page || 1
        const limit = 10 
        const skip = (page - 1) * limit
        let query = {language}
        if(filterPlantName) {
            query["plant:dwc:Taxon:scientificName.originalValue"] = {$regex: filterPlantName, $options : 'i'}
        }
        if(filterInteractionType) {
            query["interaction:rebipp:Interaction:interactionType.vocabulary"] = {$regex: filterInteractionType, $options : 'i'}
        }
        if(filterAnimalName) {
            query["animal:dwc:Taxon:scientificName.originalValue"] = {$regex: filterAnimalName, $options : 'i'}
        }
        if(filterSource) {
            query["$or"] = [
                {"datasetMetadata.eml:dataset:title:en": {$regex: filterSource, $options : 'i'}},
                {"datasetMetadata.eml:dataset:creator:individualName": {$regex: filterSource, $options : 'i'}},
                {"datasetMetadata.eml:dataset:creator:organizationName": {$regex: filterSource, $options : 'i'}},
                {"datasetMetadata.eml:dataset:creator:organizationName": {$regex: filterSource, $options : 'i'}},
                {"experimentId": filterSource},
            ]
        }
        return Interacion.find(query).skip(skip).limit(limit).lean().then(result => {
            response.send(result)
        })    
    })

    router.route("/interactions/:language/download").get((request, response) => {
        const language = request.params.language
        let { filterPlantName, filterInteractionType, filterAnimalName, filterSource } = request.query
        let query = {language}
        if(filterPlantName) {
            query["plant:dwc:Taxon:scientificName.originalValue"] = {$regex: filterPlantName, $options : 'i'}
        }
        if(filterInteractionType) {
            query["interaction:rebipp:Interaction:interactionType.vocabulary"] = {$regex: filterInteractionType, $options : 'i'}
        }
        if(filterAnimalName) {
            query["animal:dwc:Taxon:scientificName.originalValue"] = {$regex: filterAnimalName, $options : 'i'}
        }
        if(filterSource) {
            query["$or"] = [
                {"datasetMetadata.eml:dataset:title:en": {$regex: filterSource, $options : 'i'}},
                {"datasetMetadata.eml:dataset:creator:individualName": {$regex: filterSource, $options : 'i'}},
                {"datasetMetadata.eml:dataset:creator:organizationName": {$regex: filterSource, $options : 'i'}},
                {"datasetMetadata.eml:dataset:creator:organizationName": {$regex: filterSource, $options : 'i'}},
                {"experimentId": filterSource},
            ]
        }
        return Interacion.find(query).lean().then(async result => {
            response.setHeader('Content-disposition', 'attachment; filename=rebipp.json');
            response.setHeader('Content-type', 'application/json');
            await response.write(JSON.stringify(result))
            return response.end();
        })    
    })
    
    app.use('/api/v1', router)
}
module.exports = apiRouter;