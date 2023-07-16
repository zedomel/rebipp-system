var google = require('googleapis');
import { googleKey } from "../config"
export default class Table {
    static async getSheets(id) {
        const key = JSON.parse(googleKey)
        return new Promise((resolve, reject) => {                
            var SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];        
            var jwtClient = new google.auth.JWT(key.client_email, null, key.private_key, [SCOPES], null)
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
                    return resolve(spreadsheet.sheets)
                    });
            })
        })            
    }
    static async getTermLanguages(url, range) {
        
        const getIdFromUrl = (url) => {
            return url.split("/")[5]
        }
        const findTermLanguages = (sheets) => {
            let languages = []
            sheets.forEach(sheet => {
                if(sheet.properties.title.split(".")[0].trim().toLowerCase() === "glossary") {
                    languages.push(sheet.properties.title.split(".")[1].trim())
                }
            })
            return languages
        }
        const getSheets = async (id) => {
            const key = JSON.parse(googleKey)
            return new Promise((resolve, reject) => {                
                var SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];        
                var jwtClient = new google.auth.JWT(key.client_email, null, key.private_key, [SCOPES], null)
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
                        return resolve(spreadsheet.sheets)
                        });
                })
            })            
        }
        const id = getIdFromUrl(url)
        const sheets = await getSheets(id)
        return findTermLanguages(sheets)
    }
    
    static async getTablesAvailable(url, range) {
        
        const getIdFromUrl = (url) => {
            return url.split("/")[5]
        }
        const findOriginalLanguage = (sheets) => {
            let originalLanguage  
            let i = 0
            while(!originalLanguage) {
                if(sheets[i].properties.title.split(".")[0].trim().toLowerCase() === "interaction") {
                    originalLanguage = sheets[i].properties.title.split(".")[1].trim()
                }
                i++
            }
            return originalLanguage
        }
        const getSheets = async (id) => {
            const key = JSON.parse(googleKey)
            return new Promise((resolve, reject) => {                
                var SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];        
                var jwtClient = new google.auth.JWT(key.client_email, null, key.private_key, [SCOPES], null)
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
                        return resolve(spreadsheet.sheets)
                        })
                })
            })            
        }
        const id = getIdFromUrl(url)
        return await getSheets(id)
    }
    static async getOriginalLanguage(url, range) {
        
        const getIdFromUrl = (url) => {
            return url.split("/")[5]
        }
        const findOriginalLanguage = (sheets) => {
            let originalLanguage  
            let i = 0
            while(!originalLanguage) {
                if(sheets[i].properties.title.split(".")[0].trim().toLowerCase() === "interaction") {
                    originalLanguage = sheets[i].properties.title.split(".")[1].trim()
                }
                i++
            }
            return originalLanguage
        }
        const getSheets = async (id) => {
            const key = JSON.parse(googleKey)
            return new Promise((resolve, reject) => {                
                var SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];        
                var jwtClient = new google.auth.JWT(key.client_email, null, key.private_key, [SCOPES], null)
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
                        return resolve(spreadsheet.sheets)
                        })
                })
            })            
        }
        const id = getIdFromUrl(url)
        const sheets = await getSheets(id)
        return findOriginalLanguage(sheets)
    }
    static readSpreadsheetRange(url, range) {
        console.log({url, range})
        const getIdFromUrl = (url) => {
            return url.split("/")[5]
        }        
        const getRange = (id, range) => {
            return new Promise((resolve, reject) => {
                const key = JSON.parse(googleKey)                
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
                    var service = google.sheets('v4')
                    service.spreadsheets.values.get({
                        auth: jwtClient,
                        spreadsheetId: id,
                        range: range,
                        valueRenderOption: "FORMULA",
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

    static writeSpreadsheetRange(id, range, value) {
        const getRange = (id, range) => {
            return new Promise((resolve, reject) => {
                const key = JSON.parse(googleKey)                
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
                    var service = google.sheets('v4')
                    service.spreadsheets.values.update({
                        auth: jwtClient,
                        spreadsheetId: id,
                        range: range,
                        valueInputOption: 'USER_ENTERED',
                        resource: {
                            range: range,
                            majorDimension: 'ROWS',
                            values: [[value]]
                        }
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
        return getRange(id, range)
    }
    static async getSheetId(spreadsheetId) {
        const sheets = await Table.getSheets(spreadsheetId)
        return sheets[1]["properties"]["sheetId"]
    }
    
    static async addCommentAndColorToSpreadsheetColumn(url, columnIndex, notes, colors) {
        console.log({notes:notes.length, colors:colors.length, columnIndex})
        const formattedColors = colors.map(color => {
            return { values: 
                [ 
                    {
                        userEnteredFormat: {
                            backgroundColor: {
                                red: color.red,
                                green: color.green,
                                blue: color.blue
                            }
                        }
                    }
                ]
            }
        })
        
        notes = notes.map(item => {
            return { values: [{note: item}] }
        })
        const getIdFromUrl = (url) => {
            return url.split("/")[5]
        }
        
        const spreadsheetId = getIdFromUrl(url)
        const key = JSON.parse(googleKey)
        const sheetId = await Table.getSheetId(spreadsheetId)
        try {
            // JWT client for authentication
            const jwtClient = new google.auth.JWT(
                key.client_email,
                null,
                key.private_key,
                ['https://www.googleapis.com/auth/spreadsheets'],
                null
            );
    
            // Authenticate the client
            await jwtClient.authorize();
    
            // Google Sheets API client
            const sheets = google.sheets({version: 'v4', auth: jwtClient});

    
            // Add the note to the specified cell
            const response = await sheets.spreadsheets.batchUpdate({
                spreadsheetId: spreadsheetId,
                resource: {
                    requests: [{
                        updateCells: {
                            rows: notes,
                            range: {
                                sheetId: sheetId,
                                startRowIndex: 6,
                                endRowIndex: notes.length + 6,
                                startColumnIndex: columnIndex,
                                endColumnIndex: columnIndex + 1
                            },
                            fields: 'note'
                        }
                    }, 
                    {
                        updateCells: {
                            rows: formattedColors,
                            range: {
                                sheetId: sheetId,
                                startRowIndex: 6,
                                endRowIndex: colors.length + 6,
                                startColumnIndex: columnIndex,
                                endColumnIndex: columnIndex + 1
                            },
                            fields: 'userEnteredFormat.backgroundColor'
                        }
                    }
                ]
                }
            });
    
            console.log('Note added to cell:', response.data);
        } catch (error) {
            console.error('Error adding note to cell:', error);
        }
    }

    
}