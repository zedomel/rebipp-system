import Interaction from '../models/Interaction'
import Term from '../models/Term'
export default class InteractionService {
    static async createRecordFromRow(row, schemaLayout, originalLanguage, experimentId, allTerms) {
        if(!row) {
            throw Error("Row is required")
        }
        if(!schemaLayout){
            throw Error("SchemaLayout is required")
        }
        if(!originalLanguage) {
            throw Error("Language is required")
        }
        if(!experimentId) {
            throw Error("Experiment Id is required")
        }
        
        while(row.length < schemaLayout.length) { // feel empty values at end on file (fix google spreadshee api limitation)
            row.push("")
        }
        
        if(row.length != schemaLayout.length) {
            console.log(`[${new Date().toISOString()}] `,{row:row.length, schemaLayout: schemaLayout.length})
            throw Error("row and schemaLayout must have the same lenght")
        }

        const plantRecordNumber = "plant:dwc:RecordLevel:recordNumber"
        const plantRecordNumberIndex = schemaLayout.indexOf(plantRecordNumber)
        if(!plantRecordNumberIndex == -1){
            throw Error("plantRecordNumber is required")
        }

        const animalRecordNumber = "animal:dwc:RecordLevel:recordNumber"
        const animalRecordNumberIndex = schemaLayout.indexOf(animalRecordNumber)
        if(!animalRecordNumberIndex == -1){
            throw Error("animalRecordNumber is required")
        }

        const interactionType = "interaction:rebipp:RecordLevel:interactionType"
        const interactionTypeIndex = schemaLayout.indexOf(interactionType)
        if(!interactionTypeIndex == -1){
            throw Error("interactionTypeIndex is required")
        }

        let terms = await schemaLayout.map( async schemaItem => {
            const splitedSchemaItem = schemaItem.split(":")
            const plantContext = Boolean(splitedSchemaItem[0] == "plant")
            const animalContext = Boolean(splitedSchemaItem[0] == "animal")
            const interactionContext = Boolean(splitedSchemaItem[0] == "interaction")            
            const schema_ = splitedSchemaItem[1]
            const class_ = splitedSchemaItem[2]
            const term = splitedSchemaItem[3]
            
            const termRecords = allTerms.filter(item => {
                return Boolean((item["plantContext"] === plantContext || item["animalContext"] === animalContext, item["interactionContext"] === interactionContext)
                    && item["schema_"] === schema_ && item["class_"] === class_ && item["term"] === term)
            })
            // await Term.find({$or:[{plantContext},{animalContext},{interactionContext}],schema_,class_,term,language:originalLanguage}).lean()
            return { schemaItem, termRecords }
        })
        terms = await Promise.all(terms)
        let record = {
            language: originalLanguage,
            originalLanguage,
            experimentId
        }
        terms.forEach(({schemaItem, termRecords}, index) => {                
            record[schemaItem] = {}
            
            record[schemaItem]["originalValue"] = row[index].trim()
            if(!termRecords) {
                throw new Error("Field not found in the schema: "+schemaItem)
            }
            if(record[schemaItem]["originalValue"].length === 0) { // empty
                return
            }
            if(termRecords.length > 1) { // states
                let state
                let vocabulary
                termRecords.forEach(termRecord => {
                    if(termRecord["state"] && termRecord["vocabulary"] && termRecord["vocabulary"].toLowerCase() === record[schemaItem]["originalValue"].toLowerCase()) {
                        state = termRecord["state"]
                        vocabulary = termRecord["vocabulary"]
                    }
                })
                if(state) {
                    record[schemaItem]["state"] = state
                    record[schemaItem]["vocabulary"] = vocabulary 
                } else {
                    console.log(`[${new Date().toISOString()}] `,`${record[schemaItem]["originalValue"]} is not in controlled vocabulary`)
                    record[schemaItem]["error"] = `${record[schemaItem]["originalValue"]} is not in controlled vocabulary`
                }
                
            }
        })
        return Interaction.create(record)
    }

    static async createRecordsFromTable(interactionTable, schemaLayout, originalLanguage, experimentId) {
        let result = []
        const terms = await Term.find({language: originalLanguage}).lean()
        const processNext = async () => {
            if(interactionTable.length>0) {
                console.log(`[${new Date().toISOString()}] `,interactionTable.length, `records left`)
                return processRow(interactionTable.pop())
            }
            return experimentId
        }
        const processRow = async row => {
            result.push(await InteractionService.createRecordFromRow(row, schemaLayout, originalLanguage, experimentId, terms))
            return processNext()
        }
        await Interaction.deleteMany({experimentId, language: originalLanguage})
        await processNext()
        return result
    }
    static async translateRecord(original, language, termRecords) {
        let vocabularies = {}
        termRecords.forEach(termRecord => {
            const {schema_, class_, term, state, vocabulary} = termRecord
            if(state) {
                vocabularies[`${schema_}:${class_}:${term}:${state}`] = vocabulary
            }

        })
        let translated = Object.assign({}, original)
        delete translated["_id"]
        translated["language"] = language
        Object.keys(translated).forEach(async keyString => {
            const key = keyString.split(":")
            if(key.length < 4) {
                return 
            }
            const schema_ = key[1]
            const class_ = key[2]
            const term = key[3]
            if(translated[keyString]["state"]) {
                const vocabulary = vocabularies[`${schema_}:${class_}:${term}:${translated[keyString]["state"]}`]
                translated[keyString]["vocabulary"] = vocabulary
            }
        })
        // console.log(`[${new Date().toISOString()}] TRANSLATED`,translated)
        return await Interaction.create(translated)
    }
    static async translate(experimentId, originalLanguage, originals) {
        try {
            console.log(`[${new Date().toISOString()}] STARTING TRANLATION`,)
            
            const languages = await Term.aggregate([
                {
                    $group: {
                        "_id": "$language",
                        count: {$sum: 1 }
                    }
                }
            ])
            // const originals = await Interaction.find({experimentId, originalLanguage}).lean()
            let result = []
            languages.forEach(async ({_id}) => {
                const language = _id
                if(originalLanguage === language) {
                    return 
                }
                const termRecords = await Term.find({language, state:{$exists:true}}).lean() 
                await Interaction.deleteMany({experimentId, language})
                
                const promises = originals.map(async original => {
                    if(original.toObject) {
                        original = original.toObject()
                    }
                    result.push(await this.translateRecord(original, language, termRecords))
                })
                await Promise.all(promises)
                return result
            })
        } catch (error) {
            console.log(`[${new Date().toISOString()}] ERROR`,error)
        }
    }
}

