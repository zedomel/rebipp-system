import Interaction from '../models/Interaction.js'
import Table from '../models/Table.js'
import InteractionService from './InteractionService.js'
import TermService from './TermService.js'

const axios = require('axios');
export default class DataQualityService {
    static async isValidScientificNameAssessment(scientificName) {
        try {
            const response = await axios.get('https://api.gbif.org/v1/species/match', {
                params: {
                    name: scientificName?.trim(),
                    verbose: false
                }
            });
            return { assessment: response.data.matchType, scientificName }
        } catch (error) {
            console.error(`Error fetching data from GBIF API: ${error}`)
            return false
        }
    }
    static isExactScientificNameCriterion(value) {
        if (value.assessment === 'EXACT') {
            return { criterion: true, ...value }
        } else {
            return { criterion: false, ...value }
        }
    }
    static async recommendScientificNameCorrection(value) {
        if (value.criterion) {
            return null
        }

        try {
            const response = await axios.get(
                `http://api.gbif.org/v1/species/suggest?q=${value.scientificName}`
            );

            if (response.data && response.data.length > 0) {
                const similarNames = response.data.map((item) => item.scientificName);
                return {
                    recommendation: `[RECOMMENDATION] Did you mean one of these: ${similarNames.join(", ")}`,
                    color: {
                        red: 1,
                        green: 0.6,
                        blue: 0.3
                    }
                };
            } else {
                return {
                    recommendation: "[CRITICAL]: Scientific name not found in GBIF database",
                    color: {
                        red: 1,
                        green: 0.2,
                        blue: 0.2,
                    },
                };
            }
        } catch (error) {
            console.error(error);
            return {
                recommendation: "[CRITICAL]: Scientific name not found in GBIF database",
                color: {
                    red: 1,
                    green: 0.2,
                    blue: 0.2,
                },
            };
        }

    }
    static basicCompletenessAssessment(value) {
        return String(value)?.trim()?.length
    }
    static basicCompletenessCriterion(value) {
        return value > 0
    }
    static recommendCompletetionNotCritical(value) {
        if (value) {
            return null
        }
        return {
            recommendation: null,
            color: {
                red: 1,
                green: 1,
                blue: 0.8
            }
        }
    }
    static recommendCompletetionCritical(value) {
        if (value) {
            return null
        }
        return {
            recommendation: "[CRITICAL]: Required information with empty value",
            color: {
                red: 0.95,
                green: 0.1,
                blue: 0.1
            }
        }
    }
    static async getPolicy() {
        return {
            "plant:dwc:Occurrence:catalogNumber": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "plant:dwc:Occurrence:recordNumber": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionCritical,
                }
            },
            "plant:dwc:Occurrence:recordedBy": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "plant:dwc:Occurrence:sex": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "plant:dwc:Occurrence:lifeStage": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "plant:dwc:Occurrence:reproductiveCondition": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "plant:dwc:Occurrence:establishmentMeans": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "plant:dwc:Occurrence:occurrenceStatus": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "plant:dwc:Occurrence:preparations": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "plant:dwc:Occurrence:disposition": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "plant:dwc:Occurrence:associatedMedia": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "plant:dwc:Occurrence:associatedReferences": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "plant:dwc:Occurrence:occurrenceRemarks": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "plant:dwc:Taxon:scientificName": {
                //TODO: if is missing try fill with genus + epithet, family, order, and so on...
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }, "accuracy": {
                    "assessment": DataQualityService.isValidScientificNameAssessment,
                    "criterion": DataQualityService.isExactScientificNameCriterion,
                    "enhancement": DataQualityService.recommendScientificNameCorrection
                }
            },
            "plant:dwc:Taxon:acceptedNameUsage": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "plant:dwc:Taxon:parentNameUsage": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "plant:dwc:Taxon:originalNameUsage": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "plant:dwc:Taxon:nameAccordingTo": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "plant:dwc:Taxon:higherClassification": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "plant:dwc:Taxon:kingdom": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "plant:dwc:Taxon:phylum": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "plant:dwc:Taxon:class": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "plant:dwc:Taxon:order": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "plant:dwc:Taxon:family": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "plant:dwc:Taxon:genus": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "plant:dwc:Taxon:subgenus": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "plant:dwc:Taxon:specificEpithet": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "plant:dwc:Taxon:infraspecificEpithet": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "plant:dwc:Taxon:taxonRank": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "plant:dwc:Taxon:verbatimTaxonRank": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "plant:dwc:Taxon:scientificNameAuthorship": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "plant:dwc:Taxon:vernacularName": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "plant:dwc:Taxon:nomenclaturalCode": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "plant:dwc:Taxon:taxonomicStatus": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "plant:dwc:Taxon:nomenclaturalStatus": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "plant:dwc:Taxon:taxonRemarks": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "plant:dwc:Identification:identificationQualifier": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "plant:dwc:Identification:typeStatus": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "plant:dwc:Identification:identifiedBy": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "plant:dwc:Identification:dateIdentified": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "plant:dwc:Identification:identificationReferences": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "plant:dwc:Identification:identificationVerificationStatus": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "plant:dwc:Identification:identificationRemarks": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "plant:rebipp:Plant:antherDehiscenceType": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "plant:rebipp:Plant:apomiticSystemEmbryoOrigin": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "plant:rebipp:Plant:apomiticSystemFertilization": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "plant:rebipp:Plant:apomiticSystemReproduction": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "plant:rebipp:Plant:floralAbundance": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "plant:rebipp:Flower:floralAttractants": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "plant:rebipp:Plant:floralSymmetry": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "plant:rebipp:Plant:floralSystem": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "plant:rebipp:Flower:flowerShape": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "plant:rebipp:Flower:flowerOrientation": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "plant:rebipp:Flower:flowerLongevity": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "plant:rebipp:Flower:flowerOpeningPeriod": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "plant:rebipp:Flower:flowerOpeningType": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "plant:rebipp:Flower:functionalFlowerLifespanInHours": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "plant:rebipp:Plant:plantHabit": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "plant:rebipp:Plant:humanUse": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "plant:rebipp:Plant:matingSystem": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "plant:rebipp:Flower:ovuleQuantity": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "plant:rebipp:Plant:selfIncompatibilityType": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "plant:rebipp:Plant:sexualSystem": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "plant:rebipp:Flower:antherPollenGrainsQuantity": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "plant:rebipp:Flower:stigmaticAreaInSquareMilimiters": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "plant:rebipp:Flower:styleLengthInMilimiters": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "plant:rebipp:Flower:coloredFlowerStructure": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "plant:rebipp:Flower:flowerColor": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "plant:rebipp:ReproductiveSuccess:numberOfRemovedPollenGrains": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "plant:rebipp:ReproductiveSuccess:numberOfConspecificPollenGrains": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "plant:rebipp:ReproductiveSuccess:numberOfHeterospecificPollenGrains": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "plant:rebipp:ReproductiveSuccess:numberOfFertilizedOvules": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },

            "plant:rebipp:ReproductiveSuccess:numberOfPollenTubes": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "plant:rebipp:ReproductiveSuccess:seedMassInMiligrams": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "plant:rebipp:ReproductiveSuccess:seedSet": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "plant:rebipp:ReproductiveSuccess:fruitMassInGrams": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "plant:rebipp:ReproductiveSuccess:fruitSet": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "plant:rebipp:ReproductiveSuccess:numberOfExposedFlowers": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "plant:rebipp:NectarDynamics:accumlatedNectarVolumeInMicroliters": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "plant:rebipp:NectarDynamics:accumulatedNectarConcentration": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "plant:rebipp:NectarDynamics:accumulatedNectarHours": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "plant:rebipp:NectarDynamics:accumulatedNectarFlowers": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            // Interaction
            "interaction:dwc:RecordLevel:license": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "interaction:dwc:RecordLevel:rightsHolder": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "interaction:dwc:RecordLevel:accessRights": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "interaction:dwc:RecordLevel:bibliographicCitation": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "interaction:dwc:RecordLevel:references": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "interaction:dwc:RecordLevel:institutionID": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "interaction:dwc:RecordLevel:collectionID": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "interaction:dwc:RecordLevel:institutionCode": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "interaction:dwc:RecordLevel:collectionCode": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "interaction:dwc:RecordLevel:ownerInstitutionCode": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "interaction:dwc:RecordLevel:basisOfRecord": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "interaction:dwc:Location:higherGeography": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "interaction:dwc:Location:continent": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "interaction:dwc:Location:waterBody": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "interaction:dwc:Location:islandGroup": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "interaction:dwc:Location:island": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "interaction:dwc:Location:country": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "interaction:dwc:Location:countryCode": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "interaction:dwc:Location:stateProvince": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "interaction:dwc:Location:county": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "interaction:dwc:Location:municipality": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "interaction:dwc:Location:verbatimLocality": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "interaction:dwc:Location:minimumElevationInMeters": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "interaction:dwc:Location:maximumElevationInMeters": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "interaction:dwc:Location:verbatimElevation": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "interaction:dwc:Location:locationAccordingTo": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "interaction:dwc:Location:locationRemarks": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "interaction:dwc:Location:decimalLatitude": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "interaction:dwc:Location:decimalLongitude": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "interaction:dwc:Location:geodeticDatum": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "interaction:dwc:Location:coordinateUncertaintyInMeters": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "interaction:dwc:Location:coordinatePrecision": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "interaction:dwc:Location:pointRadiusSpatialFit": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "interaction:dwc:Location:verbatimCoordinates": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "interaction:dwc:Location:verbatimLatitude": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "interaction:dwc:Location:verbatimLongitude": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "interaction:dwc:Location:verbatimCoordinateSystem": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "interaction:dwc:Location:verbatimSRS": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "interaction:dwc:Location:georeferencedBy": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "interaction:dwc:Location:georeferencedDate": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "interaction:dwc:Location:georeferenceProtocol": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "interaction:dwc:Location:georeferenceSources": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "interaction:dwc:Location:georeferenceVerificationStatus": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "interaction:dwc:Location:georeferenceRemarks": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "interaction:dwc:Event:fieldNumber": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "interaction:dwc:Event:eventDate": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "interaction:dwc:Event:eventTime": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "interaction:dwc:Event:startDayOfYear": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "interaction:dwc:Event:endDayOfYear": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "interaction:dwc:Event:year": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "interaction:dwc:Event:month": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "interaction:dwc:Event:day": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "interaction:dwc:Event:verbatimEventDate": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "interaction:dwc:Event:habitat": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "interaction:dwc:Event:samplingProtocol": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "interaction:dwc:Event:sampleSizeValue": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "interaction:dwc:Event:sampleSizeUnit": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "interaction:dwc:Event:samplingEffort": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "interaction:dwc:Event:fieldNotes": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "interaction:dwc:Event:eventRemarks": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "interaction:rebipp:Interaction:visitedFlowerSex": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "interaction:rebipp:Interaction:animalPlaceOfContact": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "interaction:rebipp:Interaction:nectarCollectingBodyPart": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "interaction:rebipp:Interaction:nectarCollectingBodyPartLengthInMilimiters": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "interaction:rebipp:Interaction:flowersVisitedQuantity": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "interaction:rebipp:Interaction:flowerPlaceOfContact": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "interaction:rebipp:Interaction:resourceCollected": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "interaction:rebipp:Interaction:interactionType": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionCritical,
                }
            },
            "animal:dwc:Occurrence:catalogNumber": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "animal:dwc:Occurrence:recordNumber": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionCritical,
                }
            },
            "animal:dwc:Occurrence:recordedBy": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "animal:dwc:Occurrence:sex": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "animal:dwc:Occurrence:lifeStage": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "animal:dwc:Occurrence:behavior": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "animal:dwc:Occurrence:establishmentMeans": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "animal:dwc:Occurrence:occurrenceStatus": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "animal:dwc:Occurrence:preparations": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "animal:dwc:Occurrence:disposition": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "animal:dwc:Occurrence:associatedMedia": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "animal:dwc:Occurrence:associatedReferences": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "animal:dwc:Occurrence:occurrenceRemarks": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "animal:dwc:Taxon:scientificName": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                },
                "accuracy": {
                    "assessment": DataQualityService.isValidScientificNameAssessment,
                    "criterion": DataQualityService.isExactScientificNameCriterion,
                    "enhancement": DataQualityService.recommendScientificNameCorrection
                }
            },
            "animal:dwc:Taxon:acceptedNameUsage": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "animal:dwc:Taxon:parentNameUsage": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "animal:dwc:Taxon:originalNameUsage": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "animal:dwc:Taxon:nameAccordingTo": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "animal:dwc:Taxon:higherClassification": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "animal:dwc:Taxon:kingdom": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "animal:dwc:Taxon:phylum": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "animal:dwc:Taxon:class": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "animal:dwc:Taxon:order": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "animal:dwc:Taxon:family": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "animal:dwc:Taxon:genus": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "animal:dwc:Taxon:subgenus": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "animal:dwc:Taxon:specificEpithet": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "animal:dwc:Taxon:infraspecificEpithet": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "animal:dwc:Taxon:taxonRank": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "animal:dwc:Taxon:verbatimTaxonRank": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "animal:dwc:Taxon:scientificNameAuthorship": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "animal:dwc:Taxon:vernacularName": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "animal:dwc:Taxon:nomenclaturalCode": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "animal:dwc:Taxon:taxonomicStatus": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "animal:dwc:Taxon:nomenclaturalStatus": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "animal:dwc:Taxon:taxonRemarks": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "animal:dwc:Identification:identificationQualifier": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "animal:dwc:Identification:typeStatus": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "animal:dwc:Identification:identifiedBy": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "animal:dwc:Identification:dateIdentified": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "animal:dwc:Identification:identificationReferences": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "animal:dwc:Identification:identificationVerificationStatus": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "animal:dwc:Identification:identificationRemarks": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            },
            "animal:rebipp:AnimalTrait:caste": {
                "completeness": {
                    "assessment": DataQualityService.basicCompletenessAssessment,
                    "criterion": DataQualityService.basicCompletenessCriterion,
                    "enhancement": DataQualityService.recommendCompletetionNotCritical,
                }
            }
        }
    }
}