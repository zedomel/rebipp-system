import Interaction from '../models/Interaction'
import Term from '../models/Term'
export default class InteractionService {
    static async createRecordFromRow(row, schemaLayout, originalLanguage, experimentId) {
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
        if(row.length != schemaLayout.length) {
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
            const termRecords = await Term.find({$or:[{plantContext},{animalContext},{interactionContext}],schema_,class_,term,language:originalLanguage}).lean()
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
                termRecords.forEach(termRecord => {
                    if(termRecord["state"] && termRecord["state"].toLowerCase() === record[schemaItem]["originalValue"].toLowerCase()) {
                        state = termRecord["state"]
                    }
                })
                if(state) {
                    record[schemaItem]["state"] = state
                } else {
                    record[schemaItem]["error"] = `${record[schemaItem]["originalValue"]} is not in controlled vocabulary`
                }
                
            }
        })
        return Interaction.create(record)
    }

    static async createRecordsFromTable(interactionTable, schemaLayout, originalLanguage, experimentId) {
        const processNext = async () => {
            if(interactionTable.length>0) {
                return processRow(interactionTable.pop())
            }
            return experimentId
        }
        const processRow = async row => {
            await InteractionService.createRecordFromRow(row, schemaLayout, originalLanguage, experimentId)
            return processNext()
        }
        await Interaction.deleteMany({experimentId, language: originalLanguage})
        return await processNext()        
    }
}

