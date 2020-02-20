import Interaction from '../models/Interaction'
import Glossary from '../models/Glossary'
export default class InteractionService {
    static createRecordFromRow(row, schemaLayout, language, experimentId) {
        const originalLanguage = language
        console.log(`[${new Date().toISOString()}] Processing row`,{row, schemaLayout, language, experimentId})
        if(!row) {
            throw Error("Row is required")
        }
        if(!schemaLayout){
            throw Error("SchemaLayout is required")
        }
        if(!language) {
            throw Error("Language is required")
        }
        if(!experimentId) {
            throw Error("Experiment Id is required")
        }
        if(row.length != schemaLayout.length) {
            throw Error("row and schemaLayout must have the same lenght")
        }
        const checkRequiredFields = () => {
            const plantInstitutionCode = "plant:dwc:RecordLevel:institutionCode"
            const plantCollectionCode = "plant:dwc:RecordLevel:collectionCode"
            const plantCatalogNumber = "plant:dwc:RecordLevel:catalogNumber"
            const animalInstitutionCode = "animal:dwc:RecordLevel:institutionCode"
            const animalCollectionCode = "animal:dwc:RecordLevel:collectionCode"
            const animalCatalogNumber = "animal:dwc:RecordLevel:catalogNumber"
            const interactionType = "interaction:rebipp:RecordLevel:interactionType"
            
            const plantInstitutionCodeIndex = schemaLayout.indexOf(plantInstitutionCode)
            const plantCollectionCodeIndex = schemaLayout.indexOf(plantCollectionCode)
            const plantCatalogNumberIndex = schemaLayout.indexOf(plantCatalogNumber)
            const animalInstitutionCodeIndex = schemaLayout.indexOf(animalInstitutionCode)
            const animalCollectionCodeIndex = schemaLayout.indexOf(animalCollectionCode)
            const animalCatalogNumberIndex = schemaLayout.indexOf(animalCatalogNumber)
            const interactionTypeIndex = schemaLayout.indexOf(interactionType)

            if(!plantInstitutionCodeIndex == -1){
                throw Error("plantInstitutionCode is required")
            }
            if(!plantCollectionCodeIndex == -1){
                throw Error("plantCollectionCode is required")
            }
            if(!plantCatalogNumberIndex == -1){
                throw Error("plantCatalogNumber is required")
            }
            if(!animalInstitutionCodeIndex == -1){
                throw Error("animalInstitutionCode is required")
            }
            if(!animalCollectionCodeIndex == -1){
                throw Error("animalCollectionCode is required")
            }
            if(!animalCatalogNumberIndex == -1){
                throw Error("animalCatalogNumber is required")
            }
            if(!interactionTypeIndex == -1){
                throw Error("interactionTypeIndex is required")
            }
        }
        checkRequiredFields() 

        const getGlossaryFromSchema = schemaLayout.map((schemaItem, index) => {
            const splitedSchemaItem = schemaItem.split(":")
            const plantContext = Boolean(splitedSchemaItem[0] == "plant")
            const animalContext = Boolean(splitedSchemaItem[0] == "animal")
            const interactionContext = Boolean(splitedSchemaItem[0] == "interaction")            
            const schema_ = splitedSchemaItem[1]
            const class_ = splitedSchemaItem[2]
            const term = splitedSchemaItem[3]            
            console.log(`[${new Date().toISOString()}] QUERY`,{$or:[{plantContext},{animalContext},{interactionContext}],schema_,class_,term})
            return Glossary.find({$or:[{plantContext},{animalContext},{interactionContext}],schema_,class_,term}).lean()            
        })        
        const handleGlossaryFields = ((glossaryResults) => {    
            console.log(`[${new Date().toISOString()}] GLOSSARY RESULTS`,glossaryResults) 
            let glossary = {}   
            const defineGlossary = (glossaryItem, context) => {
                const glossaryLanguage = glossaryItem.language                
                const term = `${context}:${glossaryItem.schema_}:${glossaryItem.class_}:${glossaryItem.term}`                
                glossary[glossaryLanguage] = glossary[glossaryLanguage] || {}
                glossary[glossaryLanguage][term] = glossary[glossaryLanguage][term] || {}
                glossary[glossaryLanguage][term]["field"] = glossary[glossaryLanguage][term]["field"] || glossaryItem["field"]                
                if(glossaryItem["state"] && glossaryItem["state"].trim().length > 0) {
                    glossary[glossaryLanguage][term]["state"] = glossary[glossaryLanguage][term]["state"] || []
                    glossary[glossaryLanguage][term]["state"].push(glossaryItem["state"].trim().toLowerCase())
                    glossary[glossaryLanguage][term]["vocabulary"] = glossary[glossaryLanguage][term]["vocabulary"] || []
                    glossary[glossaryLanguage][term]["vocabulary"].push(glossaryItem["vocabulary"].trim().toLowerCase())
                }                
            }
            glossaryResults.forEach(glossaryRecords => {                
                glossaryRecords.forEach(glossaryItem => {
                    if(glossaryItem.plantContext) {
                        defineGlossary(glossaryItem, "plant")
                    }
                    if(glossaryItem.animalContext) {
                        defineGlossary(glossaryItem, "animal")
                    }
                    if(glossaryItem.interactionContext) {
                        defineGlossary(glossaryItem, "interaction")
                    }
                })
            })
            return glossary
        })

        const handleInteractionRecord = (glossary) => {
            console.log(`[${new Date().toISOString()}] HANDLE INTERATION`,glossary)
            Object.keys(glossary).forEach(currentLanguage => {
                let record = {
                    language: currentLanguage,
                    originalLanguage,
                    experimentId
                }
                schemaLayout.forEach((schemaItem, index) => {                
                    record[schemaItem] = {}
                    record[schemaItem]["originalValue"] = row[index].trim()
                    
                    const handleControlledVocabulary = () => {
                        const stateIndex = glossary[originalLanguage][schemaItem].vocabulary.indexOf(record[schemaItem]["originalValue"].toLowerCase())
                        if(stateIndex == -1) {
                            // console.log(`[${new Date().toISOString()}] `,{schemaItem, value: row[index].trim(), currentLanguage, vocabulary:glossary[currentLanguage][schemaItem].vocabulary})
                            // console.log(`[${new Date().toISOString()}] `,`error: ${record[schemaItem]["originalValue"]} (was no found in controlled vocabulary)`)
                            record[schemaItem]["value"] = `error: ${record[schemaItem]["originalValue"]} (was no found in controlled vocabulary)`
                        } else {
                            record[schemaItem]["value"] = glossary[currentLanguage][schemaItem].vocabulary[stateIndex]
                            record[schemaItem]["state"] = glossary[currentLanguage][schemaItem].state[stateIndex]
                        }
                    }
                    if(glossary[currentLanguage][schemaItem] && glossary[currentLanguage][schemaItem].state && glossary[currentLanguage][schemaItem].state.length>0) {
                        handleControlledVocabulary()
                    } else {
                        record[schemaItem]["value"] = record[schemaItem]["originalValue"].trim()
                    }                     
                    console.log(`[${new Date().toISOString()}] FIELD`,glossary[currentLanguage])
                    if(glossary[currentLanguage][schemaItem] && glossary[currentLanguage][schemaItem].field) {
                        record[schemaItem]["field"] = glossary[currentLanguage][schemaItem].field
                    }
                })
                // console.log(`[${new Date().toISOString()}] ROW`,record)
                Interaction.create(record)
            })
        }
        return Promise.all(getGlossaryFromSchema)
                .then(handleGlossaryFields)
                .then(handleInteractionRecord)                
        
    }
    static createRecordsFromTable(table, schemaLayout, language, experimentId) {
        
        console.log(`[${new Date().toISOString()}] Creating interactions`,table.length, {language, experimentId})        
        const processNext = () => {
            if(table.length>0) {
                return processRow(table.pop())
            }
            return experimentId
        }
        const processRow = row => {
            return InteractionService.createRecordFromRow(row, schemaLayout, language, experimentId)
                .then(result => {                            
                    return processNext()
                })
                .catch(error => {
                    throw error
            })
        }
        return Interaction.deleteMany({experimentId}).then(processNext)
    }
}

