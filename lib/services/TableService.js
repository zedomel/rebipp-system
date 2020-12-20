import Interaction from '../models/Interaction.js'
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
    static async updateDatabaseTablePublish(url, adminTableId, message) {
        const rows =  await Table.readSpreadsheetRange(`https://docs.google.com/spreadsheets/d/${adminTableId}`, "datasets!A:A")
        rows.forEach(async (row, rowIndex) => {
            const splited = row[0].split("/")
            console.log(`[${new Date().toISOString()}] `,)
            if(splited.length < 6) {
                return
            }
            console.log(`[${new Date().toISOString()}] `,splited[5] !== url.split("/")[5],splited[5] , url.split("/")[5])
            if(splited[5] !== url.split("/")[5]) {
                return 
            }
            const statusRange = `datasets!F${rowIndex+1}`
            const lastUpdateRange = `datasets!D${rowIndex+1}`
            
            await Table.writeSpreadsheetRange(adminTableId, statusRange, message)
            let date = new Date().toLocaleString()
            let formattedDate = date.split("/")[2].split(" ")[0].split(",")[0]+"-"
            formattedDate = formattedDate + date.split("/")[0]+"-"
            formattedDate = formattedDate + date.split("/")[1]+" "
            formattedDate = formattedDate + date.split(" ")[1]+" "+date.split(" ")[2]
            await Table.writeSpreadsheetRange(adminTableId, lastUpdateRange, `${formattedDate}`)
        })
    }
    static async updateDatabaseTableDelete(url, adminTableId, message) {
        const rows =  await Table.readSpreadsheetRange(`https://docs.google.com/spreadsheets/d/${adminTableId}`, "datasets!A:A")
        rows.forEach(async (row, rowIndex) => {
            const splited = row[0].split("/")
            console.log(`[${new Date().toISOString()}] `,)
            if(splited.length < 6) {
                return
            }
            console.log(`[${new Date().toISOString()}] `,splited[5] !== url.split("/")[5],splited[5] , url.split("/")[5])
            if(splited[5] !== url.split("/")[5]) {
                return 
            }
            const statusRange = `datasets!F${rowIndex+1}`
            const lastUpdateRange = `datasets!E${rowIndex+1}`
            
            await Table.writeSpreadsheetRange(adminTableId, statusRange, message)
            let date = new Date().toLocaleString()
            let formattedDate = date.split("/")[2].split(" ")[0].split(",")[0]+"-"
            formattedDate = formattedDate + date.split("/")[0]+"-"
            formattedDate = formattedDate + date.split("/")[1]+" "
            formattedDate = formattedDate + date.split(" ")[1]+" "+date.split(" ")[2]
            await Table.writeSpreadsheetRange(adminTableId, lastUpdateRange, `${formattedDate}`)
        })
    }
    static async updateTermsTable(url, adminTableId, message) {
        const rows =  await Table.readSpreadsheetRange(`https://docs.google.com/spreadsheets/d/${adminTableId}`, "schema!A:A")
        rows.forEach(async (row, rowIndex) => {
            const splited = row[0].split("/")
            if(splited.length < 6) {
                return
            }
            if(splited[5] !== url.split("/")[5]) {
                return 
            }
            const statusRange = `schema!D${rowIndex+1}`
            const lastUpdateRange = `schema!C${rowIndex+1}`
            
            await Table.writeSpreadsheetRange(adminTableId, statusRange, message)
            let date = new Date().toLocaleString()
            let formattedDate = date.split("/")[2].split(" ")[0].split(",")[0]+"-"
            formattedDate = formattedDate + date.split("/")[0]+"-"
            formattedDate = formattedDate + date.split("/")[1]+" "
            formattedDate = formattedDate + date.split(" ")[1]+" "+date.split(" ")[2]
            await Table.writeSpreadsheetRange(adminTableId, lastUpdateRange, `${formattedDate}`)
        })
    }
    static async includeDatasetMetadata(url, records) {
        const readInteractionTable = async (url) => {
            return Table.readSpreadsheetRange(url, `metadata!A2:C21`)
        }
        const metadataTable = await readInteractionTable(url)
        let datasetMetadata = {}
        metadataTable.forEach(row => {
            if(row.length === 3) {
                datasetMetadata[row[0]] = row[2]
            }
        })
        let result = []
        const promises = records.map(async record => {
            record["datasetMetadata"] = datasetMetadata
            record.markModified("datasetMetadata")
            record = await record.save()
            result.push(record)
        })
        await Promise.all(promises)
        return result
    }
    static async importTable(url) {
        const experimentId = url.split("/")[5]
        const readInteractionTable = async originalLanguage => {
            return Table.readSpreadsheetRange(url, `interaction.${originalLanguage}!A:GW`)
        }
        const createInteractionRecordsFromTable = async (interactionTable, originalLanguage) => {            
            
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
        const records  = await createInteractionRecordsFromTable(interactionTable, originalLanguage)
        return {experimentId, originalLanguage, records}
        // const interactionRecords = await translateFromOriginalRecords(originalRecords, language)
    }
    static async deleteTable(url) {
        const experimentId = url.split("/")[5]
        return await Interaction.deleteMany({experimentId})
    }
}

