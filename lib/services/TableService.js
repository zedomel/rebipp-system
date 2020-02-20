import Table from '../models/Table.js'
import InteractionService from './InteractionService'
import GlossaryService from './GlossaryService'

export default class TableService {
    static importTable(url) {

        const readGlossary = (url, language) => {            
            return Table.readSpreadsheetRange(url, `glossary.${language}!A:Z`)
                .then(values => {                    
                    return {language,values}
                })
        }
        const readInteraction = (url, language) => {            
            return Table.readSpreadsheetRange(url, `interaction.${language}!A:Z`)
                .then(values => {
                    return {language,values}
                })
        }
        const readTable = (metadata) => {
            const glossaries = metadata.glossariesLanguages.map(language => {
                return readGlossary(url, language)
            })            
            const glossariesResults = Promise.all(glossaries)
            return glossariesResults.then(glossaries => {
                    return readInteraction(url,metadata.originalLanguage)
                        .then(interaction => {
                            return {interaction, glossaries}
                        })                    
                })
        }
        const persistGlossary = ({interaction, glossaries}) => {            
            const persistGlossaries  = glossaries.map(glossary => {
                return GlossaryService.createRecordsFromTable(glossary.values, glossary.language)
            })
            return Promise.all(persistGlossaries)
                .then(()=> {                    
                    return {interaction, glossaries}
                })
        }
        const persistInteraction = ({interaction, glossaries}) => {            
            const experimentId = url.split("/")[5]
            
            let schemaLayout = []
            const types = interaction.values.shift()
            const schemas = interaction.values.shift()
            const classes = interaction.values.shift()
            const terms = interaction.values.shift()
            const categories = interaction.values.shift()
            const fields = interaction.values.shift()

            types.forEach((type, index) => {
                schemaLayout.push(`${type}:${schemas[index]}:${classes[index]}:${terms[index]}`)
            })            
            return InteractionService.createRecordsFromTable(interaction.values, schemaLayout, interaction.language, experimentId)
        } 

        return Table.readSpreadsheetMetadata(url)
            .then(readTable)
            .then(persistGlossary)
            .then(persistInteraction)
    }
}