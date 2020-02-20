var google = require('googleapis');

export default class Table {
    static readSpreadsheetMetadata(url, range) { 
        let metadata = {
            originalLanguage: undefined,
            glossariesLanguages: []
        }       
        const getIdFromUrl = (url) => {
            return url.split("/")[5]
        }
        const getOriginalLanguage = (sheets) => {
            let i = 0
            while(!metadata.originalLanguage || i === 10) {
                if(sheets[i].properties.title.split(".")[0].trim().toLowerCase() === "interaction") {
                    metadata.originalLanguage = sheets[i].properties.title.split(".")[1].trim()
                }
                i++
            }
            return 
        }
        const getGlossariesLanguages = (sheets) => {
            sheets.forEach(sheet => {
                if(sheet.properties.title.split(".")[0].trim().toLowerCase() === "glossary") {
                    metadata.glossariesLanguages.push(sheet.properties.title.split(".")[1].trim())
                }                
            })            
            return 
        }
        const getMetadata = (id) => {
            return new Promise((resolve, reject) => {
                var key = require('rebipp-system-key.json');
                var SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];        
                var jwtClient = new google.auth.JWT(
                    key.client_email,
                    null,
                    key.private_key,
                    [SCOPES],
                    null
                )
                jwtClient.authorize(function (err, tokens) {
                    if (err) {
                        console.log(err.errorDescription,err.error_description,tokens);
                        return reject(err)
                    }          
                    var service = google.sheets('v4');      
                    service.spreadsheets.get({
                        auth: jwtClient,
                        spreadsheetId: id
                    }, function(err, spreadsheet) {
                        if (err){
                            console.log('The API returned an error: ' + err);    
                            return reject(err)      
                        }                        
                        getOriginalLanguage(spreadsheet.sheets)
                        getGlossariesLanguages(spreadsheet.sheets)
                        return resolve(metadata)
                        });
                })
            })            
        }
        const id = getIdFromUrl(url)
        return getMetadata(id)
    }
    static readSpreadsheetRange(url, range) {        
        const getIdFromUrl = (url) => {
            return url.split("/")[5]
        }        
        const getRange = (id, range) => {
            return new Promise((resolve, reject) => {
                var key = require('rebipp-system-key.json');
                var SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];        
                var jwtClient = new google.auth.JWT(
                    key.client_email,
                    null,
                    key.private_key,
                    [SCOPES],
                    null
                )
                jwtClient.authorize(function (err, tokens) {
                    if (err) {
                        console.log(err.errorDescription,err.error_description,tokens);
                        return reject(err)
                    }          
                    var service = google.sheets('v4');      
                    service.spreadsheets.values.get({
                        auth: jwtClient,
                        spreadsheetId: id,
                        range: range
                    }, function(err, data) {
                        if (err){
                            console.log('The API returned an error: ' + err);    
                            return reject(err)      
                        }
                        return resolve(data.values)
                        });
                })
            })            
        }
        const id = getIdFromUrl(url)
        return getRange(id, range)
    }

}