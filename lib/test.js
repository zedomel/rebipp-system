import InteractionService from './services/InteractionService'
import GlossaryService from './services/GlossaryService'
import TableService from './services/TableService'

TableService.importTable("https://docs.google.com/spreadsheets/d/1kmJkPbmsjitvcc6HquAn5QBmIl2Bfvr_SoDq9JkGx-0/edit#gid=0")
    .then(result => {
        console.log(`[${new Date().toISOString()}] RESULT`,result)
    }).catch(error => {
        console.log(`[${new Date().toISOString()}] ERROR`,error)
    })
// const populateInteraction = () => {
//     const schemaLayout = [
//         "plant:dwc:RecordLevel:institutionCode",
//         "plant:dwc:RecordLevel:collectionCode",
//         "plant:dwc:RecordLevel:catalogNumber",
//         "plant:dwc:Taxon:scientificName",
//         "animal:dwc:RecordLevel:institutionCode",
//         "animal:dwc:RecordLevel:collectionCode",
//         "animal:dwc:RecordLevel:catalogNumber",
//         "animal:dwc:Taxon:scientificName",
//         "interaction:rebipp:RecordLevel:interactionType"
//     ]
//     const table = [
//         [
//             "instituticao A",
//             "colecao da planta A",
//             "planta:123",
//             "Planis pepinus",
//             "instituticao A",
//             "colecao do animal A",
//             "animal:123",
//             "Apis mellifera",
//             "poliniza"
//         ],
//         [
//             "instituticao B",
//             "colecao da planta B",
//             "planta:023",
//             "Flor desal",
//             "instituticao B",
//             "colecao do animal B",
//             "animal:031",
//             "Tetragonica angustula",
//             "se alimenta de "
//         ]
//     ]
//     const language = "pt-BR"
//     const experimentId = "rebipp"
    
//     InteractionService.createRecordsFromTable(table, schemaLayout, language, experimentId)
//         .then(result => {
//             console.log(`[${new Date().toISOString()}] SUCCESS`, result)
//         }).catch(error => {
//             console.log(`[${new Date().toISOString()}] Error`,error)
//             throw error
//         })
// }

// const populateGlossary = () => {
//     const tableBR = [
//         [
//             "dwc",
//             "RecordLevel",
//             "institutionCode",
//             "",
//             true,
//             true,
//             false,
//             "Institutição",
//             "",
//             "definição...",
//             "referência..."
//         ],
//         [
//             "dwc",
//             "RecordLevel",
//             "collectionCode",
//             "",
//             true,
//             true,
//             false,
//             "Coleção",
//             "",
//             "definição...",
//             "referência..."
//         ],
//         [
//             "dwc",
//             "RecordLevel",
//             "catalogNumber",
//             "",
//             true,
//             true,
//             false,
//             "Número de Catálago",
//             "",
//             "definição...",
//             "referência..."
//         ],
//         [
//             "dwc",
//             "Taxon",
//             "scientificName",
//             "",
//             true,
//             true,
//             false,
//             "Nome Científico",
//             "",
//             "definição...",
//             "referência..."
//         ],
//         [
//             "rebipp",
//             "RecordLevel",
//             "interactionType",
//             "",
//             false,
//             false,
//             true,
//             "Tipo de interação",
//             "",
//             "definição...",
//             "referência..."
//         ],
//         [
//             "rebipp",
//             "RecordLevel",
//             "interactionType",
//             "eats",
//             false,
//             false,
//             true,
//             "Tipo de interação",
//             "Se alimenta de",
//             "definição...",
//             "referência..."
//         ],
//         [
//             "rebipp",
//             "RecordLevel",
//             "interactionType",
//             "pollinates",
//             false,
//             false,
//             true,
//             "Tipo de interação",
//             "Poliniza",
//             "definição...",
//             "referência..."
//         ]
//     ]
    
//     const tableUS = [
//         [
//             "dwc",
//             "RecordLevel",
//             "institutionCode",
//             "",
//             true,
//             true,
//             false,
//             "Institution",
//             "",
//             "definition...",
//             "reference..."
//         ],
//         [
//             "dwc",
//             "RecordLevel",
//             "collectionCode",
//             "",
//             true,
//             true,
//             false,
//             "Collection",
//             "",
//             "definition...",
//             "reference..."
//         ],
//         [
//             "dwc",
//             "RecordLevel",
//             "catalogNumber",
//             "",
//             true,
//             true,
//             false,
//             "Catalog number",
//             "",
//             "definition...",
//             "reference..."
//         ],
//         [
//             "dwc",
//             "Taxon",
//             "scientificName",
//             "",
//             true,
//             true,
//             false,
//             "Scientific Name",
//             "",
//             "definition...",
//             "reference..."
//         ],
//         [
//             "rebipp",
//             "RecordLevel",
//             "interactionType",
//             "",
//             false,
//             false,
//             true,
//             "Interaction type",
//             "",
//             "definition...",
//             "reference..."
//         ],
//         [
//             "rebipp",
//             "RecordLevel",
//             "interactionType",
//             "eats",
//             false,
//             false,
//             true,
//             "Tipo de interação",
//             "Eats",
//             "definition...",
//             "reference..."
//         ],
//         [
//             "rebipp",
//             "RecordLevel",
//             "interactionType",
//             "pollinates",
//             false,
//             false,
//             true,
//             "Interaction type",
//             "Pollinates",
//             "definition...",
//             "reference..."
//         ]
//     ]
//     return GlossaryService.createRecordsFromTable(tableBR, "pt-BR").then( () => GlossaryService.createRecordsFromTable(tableUS,"en-US") )
// }
// populateGlossary().then( () => populateInteraction() )
