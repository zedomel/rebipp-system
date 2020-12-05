import Table from '../models/Table.js'
import InteractionService from './InteractionService'
import TermService from './TermService'

export default class TableService {
    static async updateTerms(url) {
        const readTermTable = async (url, language) => {            
            return Table.readSpreadsheetRange(url, `glossary.${language}!A:GW`)
        }
        const createTermRecordsFromTable = async (termTable, language) => {   
            const header = termTable.shift()         
            return TermService.createRecordsFromTable(termTable, language)

        }
        const termLanguages = await Table.getTermLanguages(url)
        const result = {}
        termLanguages.forEach(async language => {
            const termTable = await readTermTable(url,language)            
            result[language] = await createTermRecordsFromTable(termTable, language)
        })
        return result
    }

    static async importTable(url) {
        const readInteractionTable = async originalLanguage => {
            return Table.readSpreadsheetRange(url, `interaction.${originalLanguage}!A:GW`)
        }
        const createInteractionRecordsFromTable = async (interactionTable, originalLanguage) => {            
            const experimentId = url.split("/")[5]
            
            let schemaLayout = []
            const types = interactionTable.shift()
            const schemas = interactionTable.shift()
            const classes = interactionTable.shift()
            const terms = interactionTable.shift()
            const categories = interactionTable.shift()
            const fields = interactionTable.shift()

            types.forEach((currentType, index) => {
                schemaLayout.push(`${currentType}:${schemas[index]}:${classes[index]}:${terms[index]}`)
            })
            return InteractionService.createRecordsFromTable(interactionTable, schemaLayout, originalLanguage, experimentId)
        } 
        const originalLanguage = await Table.getOriginalLanguage(url)
        const interactionTable = await readInteractionTable(originalLanguage)
        const originalInteractionRecords = await createInteractionRecordsFromTable(interactionTable, originalLanguage)
        return originalInteractionRecords
        // const interactionRecords = await translateFromOriginalRecords(originalRecords, language)
    }
}

