import Glossary from '../models/Glossary'
export default class GlossaryService {
    static createRecordFromRow(row, language) {
        if(!row)
            throw Error("Row is required")
        if(!language)
            throw Error("Language is required")
        
        const schema_ = row[0]
        const class_ = row[1]
        const term = row[2]
        const state = row[3]
        
        if(!schema_)
            throw Error("Schema is required")
        if(!class_)
            throw Error("Class is required")
        if(!term)
            throw Error("Term is required")                
        const plantContext = String(row[4]).trim().toLowerCase() === "false" || String(row[4]).trim().toLowerCase() === "true" ? JSON.parse(String(row[4]).trim().toLowerCase()) : undefined
        const animalContext = String(row[5]).trim().toLowerCase() === "false" || String(row[5]).trim().toLowerCase() === "true" ? JSON.parse(String(row[5]).trim().toLowerCase()) : undefined
        const interactionContext = String(row[6]).trim().toLowerCase() === "false" || String(row[6]).trim().toLowerCase() === "true" ? JSON.parse(String(row[6]).trim().toLowerCase()) : undefined
        const field = row[7]
        const vocabulary = row[8]
        const definition = row[9]
        const reference = row[10]
        const record = {
            language,
            schema_,
            class_,
            term,
            state,
            plantContext,
            animalContext,
            interactionContext,
            field,
            vocabulary,
            definition,
            reference
        }
        
        return Glossary.create(record)            
            .catch(error => {
                console.log(`[${new Date().toISOString()}] Error to create glossary term`,{record,error})
                throw error
            })
    }
    static createRecordsFromTable(table, language) {
        console.log(`[${new Date().toISOString()}] Creating glossary`,table.length, {language})
        const processNext = () => {
            if(table.length>0) {
                return processRow(table.pop())
            }
            return "SUCESS"
        }
        const processRow = row => {
            return GlossaryService.createRecordFromRow(row, language)
                .then(result => {                            
                    processNext()
                })
                .catch(error => {
                    Glossary.deleteMany({language})
                    throw error
            })
        }
        return Glossary.deleteMany({language}).then(processNext)
    }
}
