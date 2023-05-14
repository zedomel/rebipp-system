import express from 'express'
import InteractionService from '../services/InteractionService'
import TermService from '../services/TermService'
import Term from '../models/Term'
import Interacion from '../models/Interaction'
import TableService from '../services/TableService'
import DataQualityService from '../services/DataQualityService'
import {
    Parser
} from 'json2csv'
import Zip from 'node-zip'
import fs from 'fs'
import nodemailer from 'nodemailer'
import async from 'async'

var apiRouter = function (app) {
    const router = express.Router();
    router.route("/reportError").post((request, response) => {
        console.log("body", request.body)
        const errorType = request.body.errorType
        const errorDescription = request.body.errorDescription
        const email = request.body.email

        console.log({
            errorDescription,
            errorType,
            email
        })

        const subject = `REBIPP error report`
        const text = `
${email} has reported a problem.

Category: ${errorType}
Email: ${email}

Error description: 

${errorDescription}
`
        console.log(`[${new Date().toISOString()}] Email: `, process.env.EMAIL_PASS);
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SUPORTE_MAIL_FROM || 'allan.kv@gmail.com',
                pass: process.env.EMAIL_PASS
            }
        });

        var mailOptions = {
            from: email,
            to: process.env.SUPORTE_MAIL_TO || 'allan.kv@gmail.com',
            subject,
            text
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });




    })

    router.route("/table/publish").get((request, response) => {
        const {
            url,
            adminTableId
        } = request.query
        console.log(`[${new Date().toISOString()}] PUBLISH `, url)
        if (!url) {
            throw new Error("URL was not supplied")
        }
        return TableService.importTable(url)
            .then(async ({
                experimentId,
                originalLanguage,
                records
            }) => {
                records = await TableService.includeDatasetMetadata(url, records)
                records = await InteractionService.translate(experimentId, originalLanguage, records)
                TableService.updateDatabaseTablePublish(url, adminTableId, "PUBLISHED")
                return response.send({
                    experimentId,
                    records
                })
            }).catch(error => {
                TableService.updateDatabaseTablePublish(url, adminTableId, `ERROR ON PUBLISH: ${error.message}`)
                console.log(`[${new Date().toISOString()}] ERROR ON PUBLISH`, error)
            })
    })

    router.route("/table/data-quality").get((request, response) => {
        
        const {
            url,
            adminTableId
        } = request.query
        console.log(`[${new Date().toISOString()}] PUBLISH `, url)
        if (!url) {
            throw new Error("URL was not supplied")
        }
        return TableService.dataAssessment(url)
            .then(async ({
                experimentId,
                originalLanguage,
                records
            }) => {
                async function retryWithExponentialBackoff(fn, retries = 5, delay = 1000) {
                    try {
                        return await fn();
                    } catch (error) {
                        if (retries === 0 || error.code !== 429) {
                            throw error;
                        }

                        await new Promise((resolve) => setTimeout(resolve, delay));
                        return retryWithExponentialBackoff(fn, retries - 1, delay * 2);
                    }
                }
                async function processKeys(records, policy, url, response, experimentId) {
                    const prepareColumn = {};
                    let columnIndex = 0;

                    for (const key of records.schemaLayout) {
                        prepareColumn[key] = prepareColumn[key] || {
                            notes: [],
                            colors: []
                        };
                        prepareColumn[key]["index"] = columnIndex;

                        for (const row of records.interactionTable) {
                            let note = null;
                            let color = null;

                            let completenessCriterion

                            if (policy[key]?.completeness) {
                                const completenessAssessment = policy[key].completeness.assessment(
                                    row[prepareColumn[key]["index"]]
                                );
                                completenessCriterion = policy[key].completeness.criterion(
                                    completenessAssessment
                                );

                                if (!completenessCriterion) {
                                    const completenessEnhancement = policy[key].completeness.enhancement(
                                        completenessCriterion
                                    );
                                    note = completenessEnhancement["recommendation"];
                                    color = completenessEnhancement["color"];
                                }
                            }

                            if (policy[key]?.accuracy && completenessCriterion) {
                                const accuracyAssessment = await policy[key].accuracy.assessment(
                                    row[prepareColumn[key]["index"]]
                                );

                                const accuracyCriterion = policy[key].accuracy.criterion(
                                    accuracyAssessment
                                );
                                if (!accuracyCriterion.criterion) {
                                    const accuracyEnhancement = await policy[key].accuracy.enhancement(
                                        accuracyCriterion
                                    );
                                    note = accuracyEnhancement["recommendation"];
                                    color = accuracyEnhancement["color"];
                                }
                            }

                            if (note || color) {
                                prepareColumn[key]["notes"].push(note);
                                prepareColumn[key]["colors"].push(color);
                            } else {
                                prepareColumn[key]["notes"].push(null);
                                prepareColumn[key]["colors"].push({
                                    red: 1,
                                    green: 1,
                                    blue: 1
                                });
                            }
                        }
                        columnIndex++;
                    }

                    for (const column of Object.keys(prepareColumn)) {
                        await new Promise((resolve) => {
                            setTimeout(async () => {
                                retryWithExponentialBackoff(async () => {
                                    await TableService.addCommentsAndColorByColumn(
                                        url,
                                        prepareColumn[column]["index"],
                                        prepareColumn[column].notes,
                                        prepareColumn[column].colors
                                    );
                                    resolve();
                                })
                                
                            }, 100);
                        });
                    }

                    return response.send({
                        experimentId,
                        records,
                    });
                }

                // Example usage:
                const policy = await DataQualityService.getPolicy();
                processKeys(records, policy, url, response, experimentId);
            }).catch(error => {
                console.log(`[${new Date().toISOString()}] ERROR ON PUBLISH`, error)
            })
    })

    router.route("/table/delete").get((request, response) => {
        const {
            url,
            adminTableId
        } = request.query
        console.log(`[${new Date().toISOString()}] DELETING `, url)
        if (!url) {
            throw new Error("URL was not supplied")
        }
        return TableService.deleteTable(url)
            .then(result => {
                console.log(`[${new Date().toISOString()}] DELETED`, {
                    url
                })
                TableService.updateDatabaseTableDelete(url, adminTableId, "DELETED")
                return response.send({
                    SUCCESS: true
                })
            }).catch(error => {
                TableService.updateDatabaseTableDelete(url, adminTableId, `ERROR ON DELETE: ${error.message}`)
                console.log(`[${new Date().toISOString()}] ERROR`, error)
            })
    })
    router.route("/table/update-terms").get((request, response) => {
        const {
            url,
            adminTableId
        } = request.query
        console.log(`[${new Date().toISOString()}] PUBLISH `, url, adminTableId)
        if (!url) {
            throw new Error("URL was not supplied")
        }
        return TableService.updateTerms(url)
            .then(result => {
                console.log(`[${new Date().toISOString()}] RESULT`, result)
                TableService.updateTermsTable(url, adminTableId, "PUBLISHED")
                return response.send(result)
            }).catch(error => {
                TableService.updateTermsTable(url, adminTableId, `ERROR ON PUBLISH: ${error.message}`)
                console.log(`[${new Date().toISOString()}] ERROR`, error)
            })
    })

    router.route("/terms/:language/interactionType").get(async (request, response) => {
        const language = request.params.language
        const result = await Term.find({
            term: "interactionType",
            language,
            state: {
                $exists: true
            }
        }).lean().then(records => {
            return records.map(record => record["vocabulary"])
        })
        return response.send(result)
    })
    router.route("/interactions/:language").get((request, response) => {
        const language = request.params.language
        let {
            page,
            filterPlantName,
            filterInteractionType,
            filterAnimalName,
            filterSource,
            limit
        } = request.query
        page = page || 1
        limit = limit || 10
        const skip = (page - 1) * limit
        let query = {
            language
        }
        if (filterPlantName) {
            query["plant:dwc:Taxon:scientificName.originalValue"] = {
                $regex: filterPlantName,
                $options: 'i'
            }
        }
        if (filterInteractionType) {
            query["interaction:rebipp:Interaction:interactionType.vocabulary"] = {
                $regex: filterInteractionType,
                $options: 'i'
            }
        }
        if (filterAnimalName) {
            query["animal:dwc:Taxon:scientificName.originalValue"] = {
                $regex: filterAnimalName,
                $options: 'i'
            }
        }
        if (filterSource) {
            query["$or"] = [{
                    "datasetMetadata.eml:dataset:title:en": {
                        $regex: filterSource,
                        $options: 'i'
                    }
                },
                {
                    "datasetMetadata.eml:dataset:creator:individualName": {
                        $regex: filterSource,
                        $options: 'i'
                    }
                },
                {
                    "datasetMetadata.eml:dataset:creator:organizationName": {
                        $regex: filterSource,
                        $options: 'i'
                    }
                },
                {
                    "datasetMetadata.eml:dataset:creator:organizationName": {
                        $regex: filterSource,
                        $options: 'i'
                    }
                },
                {
                    "experimentId": filterSource
                },
            ]
        }
        return Interacion.find(query).skip(skip).limit(limit).lean().then(result => {
            response.send(result)
        })
    })
    router.route("/interactions/:language/metadata").get((request, response) => {
        const language = request.params.language
        let {
            filterPlantName,
            filterInteractionType,
            filterAnimalName,
            filterSource
        } = request.query
        let query = {
            language
        }
        if (filterPlantName) {
            query["plant:dwc:Taxon:scientificName.originalValue"] = {
                $regex: filterPlantName,
                $options: 'i'
            }
        }
        if (filterInteractionType) {
            query["interaction:rebipp:Interaction:interactionType.vocabulary"] = {
                $regex: filterInteractionType,
                $options: 'i'
            }
        }
        if (filterAnimalName) {
            query["animal:dwc:Taxon:scientificName.originalValue"] = {
                $regex: filterAnimalName,
                $options: 'i'
            }
        }
        if (filterSource) {
            query["$or"] = [{
                    "datasetMetadata.eml:dataset:title:en": {
                        $regex: filterSource,
                        $options: 'i'
                    }
                },
                {
                    "datasetMetadata.eml:dataset:creator:individualName": {
                        $regex: filterSource,
                        $options: 'i'
                    }
                },
                {
                    "datasetMetadata.eml:dataset:creator:organizationName": {
                        $regex: filterSource,
                        $options: 'i'
                    }
                },
                {
                    "datasetMetadata.eml:dataset:creator:organizationName": {
                        $regex: filterSource,
                        $options: 'i'
                    }
                },
                {
                    "experimentId": filterSource
                },
            ]
        }
        return Interacion.find(query).lean().then(async result => {
            let countSources = {}
            let countPlantSpecies = {}
            let countAnimalSpecies = {}
            result.forEach(item => {
                countSources[item.experimentId] = 1
                countPlantSpecies[item["plant:dwc:Taxon:scientificName"].originalValue] = 1
                countAnimalSpecies[item["animal:dwc:Taxon:scientificName"].originalValue] = 1
            })

            let metadata = {
                countRecords: result.length,
                countSources: Object.keys(countSources).length,
                countPlantSpecies: Object.keys(countPlantSpecies).length,
                countAnimalSpecies: Object.keys(countAnimalSpecies).length,
            }
            return response.send(metadata)
        })
    })
    router.route("/interactions/:language/download/json").get((request, response) => {
        const language = request.params.language
        let {
            filterPlantName,
            filterInteractionType,
            filterAnimalName,
            filterSource
        } = request.query
        let query = {
            language
        }
        if (filterPlantName) {
            query["plant:dwc:Taxon:scientificName.originalValue"] = {
                $regex: filterPlantName,
                $options: 'i'
            }
        }
        if (filterInteractionType) {
            query["interaction:rebipp:Interaction:interactionType.vocabulary"] = {
                $regex: filterInteractionType,
                $options: 'i'
            }
        }
        if (filterAnimalName) {
            query["animal:dwc:Taxon:scientificName.originalValue"] = {
                $regex: filterAnimalName,
                $options: 'i'
            }
        }
        if (filterSource) {
            query["$or"] = [{
                    "datasetMetadata.eml:dataset:title:en": {
                        $regex: filterSource,
                        $options: 'i'
                    }
                },
                {
                    "datasetMetadata.eml:dataset:creator:individualName": {
                        $regex: filterSource,
                        $options: 'i'
                    }
                },
                {
                    "datasetMetadata.eml:dataset:creator:organizationName": {
                        $regex: filterSource,
                        $options: 'i'
                    }
                },
                {
                    "datasetMetadata.eml:dataset:creator:organizationName": {
                        $regex: filterSource,
                        $options: 'i'
                    }
                },
                {
                    "experimentId": filterSource
                },
            ]
        }
        return Interacion.find(query).lean().then(async result => {
            response.setHeader('Content-disposition', 'attachment; filename=rebipp.json');
            response.setHeader('Content-type', 'application/json');
            await response.write(JSON.stringify(result))
            return response.end();
        })
    })

    router.route("/interactions/:language/download/csv").get((request, response) => {
        const language = request.params.language
        let {
            filterPlantName,
            filterInteractionType,
            filterAnimalName,
            filterSource
        } = request.query
        let query = {
            language
        }
        if (filterPlantName) {
            query["plant:dwc:Taxon:scientificName.originalValue"] = {
                $regex: filterPlantName,
                $options: 'i'
            }
        }
        if (filterInteractionType) {
            query["interaction:rebipp:Interaction:interactionType.vocabulary"] = {
                $regex: filterInteractionType,
                $options: 'i'
            }
        }
        if (filterAnimalName) {
            query["animal:dwc:Taxon:scientificName.originalValue"] = {
                $regex: filterAnimalName,
                $options: 'i'
            }
        }
        if (filterSource) {
            query["$or"] = [{
                    "datasetMetadata.eml:dataset:title:en": {
                        $regex: filterSource,
                        $options: 'i'
                    }
                },
                {
                    "datasetMetadata.eml:dataset:creator:individualName": {
                        $regex: filterSource,
                        $options: 'i'
                    }
                },
                {
                    "datasetMetadata.eml:dataset:creator:organizationName": {
                        $regex: filterSource,
                        $options: 'i'
                    }
                },
                {
                    "datasetMetadata.eml:dataset:creator:organizationName": {
                        $regex: filterSource,
                        $options: 'i'
                    }
                },
                {
                    "experimentId": filterSource
                },
            ]
        }
        return Interacion.find(query).lean().then(async result => {
            response.setHeader('Content-disposition', 'attachment; filename=rebipp.csv');
            response.setHeader('Content-type', 'text/csv');

            result = result.map(record => {
                let transformedRecord = {}
                Object.keys(record).forEach(key => {
                    if (typeof record[key] === "object") {
                        Object.keys(record[key]).forEach(subkey => {
                            transformedRecord[`${key}.${subkey}`] = record[key][subkey]
                        })
                    } else {
                        transformedRecord[key] = record[key]
                    }
                })
                return transformedRecord
            })

            const fields = Object.keys(result[0])
            const opts = {
                fields
            };

            const parser = new Parser(opts);
            const csv = parser.parse(result);



            await response.write(csv)
            return response.end();
        })
    })

    router.route("/interactions/:language/download/dwca").get((request, response) => {
        const language = request.params.language
        let {
            filterPlantName,
            filterInteractionType,
            filterAnimalName,
            filterSource
        } = request.query
        let query = {
            language
        }
        if (filterPlantName) {
            query["plant:dwc:Taxon:scientificName.originalValue"] = {
                $regex: filterPlantName,
                $options: 'i'
            }
        }
        if (filterInteractionType) {
            query["interaction:rebipp:Interaction:interactionType.vocabulary"] = {
                $regex: filterInteractionType,
                $options: 'i'
            }
        }
        if (filterAnimalName) {
            query["animal:dwc:Taxon:scientificName.originalValue"] = {
                $regex: filterAnimalName,
                $options: 'i'
            }
        }
        if (filterSource) {
            query["$or"] = [{
                    "datasetMetadata.eml:dataset:title:en": {
                        $regex: filterSource,
                        $options: 'i'
                    }
                },
                {
                    "datasetMetadata.eml:dataset:creator:individualName": {
                        $regex: filterSource,
                        $options: 'i'
                    }
                },
                {
                    "datasetMetadata.eml:dataset:creator:organizationName": {
                        $regex: filterSource,
                        $options: 'i'
                    }
                },
                {
                    "datasetMetadata.eml:dataset:creator:organizationName": {
                        $regex: filterSource,
                        $options: 'i'
                    }
                },
                {
                    "experimentId": filterSource
                },
            ]
        }
        return Interacion.find(query).lean().then(async result => {
            var zip = new Zip;

            // response.setHeader('Content-disposition', 'attachment; filename=rebipp.csv');
            // response.setHeader('Content-type', 'text/csv');

            let coreData
            let metafile = `
<archive xmlns="http://rs.tdwg.org/dwc/text/" metadata="metadata.xml">
    <core encoding="UTF-8" fieldsTerminatedBy="," linesTerminatedBy="\n" fieldsEnclosedBy="" ignoreHeaderLines="1" rowType="http://rs.tdwg.org/dwc/terms/Event">
        <files>
            <location>interactions.csv</location>
        </files>
        <id index="0" />
`
            let resourceMetadata
            var options = {
                base64: false,
                compression: 'DEFLATE'
            };
            let isFirstRecord = true
            const csvResult = result.map(record => {
                let transformedRecord = {}
                let i = 0
                Object.keys(record).forEach(key => {
                    if (typeof record[key] === "object") {
                        return Object.keys(record[key]).forEach(subkey => {
                            transformedRecord[`${key}.${subkey}`] = record[key][subkey]
                            console.log(`[${new Date().toISOString()}] `, key, subkey)
                            if (key.search(":dwc:") !== -1 && isFirstRecord) {
                                const splittedKey = key.split(":")
                                metafile += `       <field index="${i}" term="http://rs.tdwg.org/dwc/terms/${splittedKey[splittedKey.length-1]}"/>\n`
                            }
                            if (key.search(":rebipp:") !== -1 && isFirstRecord) {
                                const splittedKey = key.split(":")
                                metafile += `       <field index="${i}" term="http://rs.rebipp.org.br/ppi/terms/${splittedKey[splittedKey.length-1]}"/>\n`
                            }
                            if (subkey.search("eml:") !== -1 && isFirstRecord) {
                                const splittedKey = subkey.split(":")
                                let term = ""
                                term += splittedKey.filter(item => item !== "eml" && item !== "en").join("/")
                                metafile += `       <field index="${i}" term="eml://ecoinformatics.org/eml-2.1.1/${term}"/>\n`
                            }
                            i++
                        })
                    }
                    if (key === "_id" && isFirstRecord) {
                        metafile += `       <field index="${i}" term="http://rs.rebipp.org/terms/1.0/rebippID"/>\n`
                        i++
                        return transformedRecord["rebippID"] = record[key]
                    }
                    if (key === "_v") {
                        return
                    }
                    if (key === "language" && isFirstRecord) {
                        metafile += `       <field index="${i}" term="eml://ecoinformatics.org/eml-2.1.1/dataset/${key}"/>\n`
                        i++
                        return transformedRecord[key] = record[key]
                    }
                    if (key === "experimentId" && isFirstRecord) {
                        metafile += `       <field index="${i}" term="eml://ecoinformatics.org/eml-2.1.1/dataset/id"/>\n`
                        i++
                        return transformedRecord[key] = record[key]
                    }

                    if (key === "originalLanguage") {
                        return
                    }
                    transformedRecord[key] = record[key]
                    i++
                })
                isFirstRecord = false
                return transformedRecord
            })
            metafile += `</core>
</archive>`
            zip.file('metafile.xml', metafile);
            const fields = Object.keys(csvResult[0])
            const opts = {
                fields
            };

            const parser = new Parser(opts);
            coreData = parser.parse(csvResult)
            zip.file('interactions.csv', coreData);

            // await response.write(coreData)
            // return response.end();
            return fs.writeFile('rebipp-dwca.zip', zip.generate(options), 'binary', function (error) {
                response.download('rebipp-dwca.zip');
            });


        })
    })

    app.use('/api/v1', router)
}
module.exports = apiRouter;