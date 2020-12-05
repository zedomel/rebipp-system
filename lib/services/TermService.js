import Term from '../models/Term'
export default class TermService {
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
        const plantContext = Boolean(String(row[4]).trim().toLowerCase() === "plant")
        const animalContext = Boolean(String(row[5]).trim().toLowerCase() === "animal")
        const interactionContext = Boolean(String(row[6]).trim().toLowerCase() === "interaction")
        if(!(plantContext || animalContext || interactionContext)) {
            throw Error("At least one context must be marked")
        }
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
            reference,
        }
        return Term.create(record)
    }
    static async createRecordsFromTable(termTable, language) {
        const processNext = async () => {
            if(termTable.length>0) {
                return processRow(termTable.pop())
            }
            return language
        }
        const processRow = async row => {
            try {
                await TermService.createRecordFromRow(row, language)    
            } catch (error) {
                console.log(`[${new Date().toISOString()}] error:createRecordFromRow`,error.message)
            }
            
            return processNext()
        }
        await Term.deleteMany({language})
        return await processNext()        
    }
}
