
const getInteractionTypes = async () => {
    const language = localStorage.getItem("language") || "en-US"
    const interactionTypes = await $.ajax({type: "GET", url: `/api/v1/terms/${language}/interactionType`, contentType: 'application/json' })
    return interactionTypes
}
const getInteractions = async (page, selectedInteractionType) => {
    let filterPlantName = $("#filterPlantName").val()
    let filterInteractionType = selectedInteractionType
    let filterAnimalName = $("#filterAnimalName").val()
    let filterSource = $("#filterSource").val()
    if(filterPlantName.length > 0) {
        filterPlantName = `&filterPlantName=${filterPlantName}`
    }
    if(filterInteractionType.length > 0) {
        filterInteractionType = `&filterInteractionType=${selectedInteractionType}`
    }
    if(filterAnimalName.length > 0) {
        filterAnimalName = `&filterAnimalName=${filterAnimalName}`
    }
    if(filterSource.length > 0) {
        filterSource = `&filterSource=${filterSource}`
    }
    const language = localStorage.getItem("language") || "en-US"
    let interactions
    if(page === null) {
        interactions = $.ajax({type: "GET", url: `/api/v1/interactions/${language}?limit=10000${filterPlantName}${filterInteractionType}${filterAnimalName}${filterSource}`, contentType: 'application/json' })
    } else {
        interactions = $.ajax({type: "GET", url: `/api/v1/interactions/${language}?page=${page}${filterPlantName}${filterInteractionType}${filterAnimalName}${filterSource}`, contentType: 'application/json' })
    }
    return interactions
}
const getDownloadMetadata = async (selectedInteractionType) => {
    let filterPlantName = $("#filterPlantName").val()
    let filterInteractionType = selectedInteractionType
    let filterAnimalName = $("#filterAnimalName").val()
    let filterSource = $("#filterSource").val()
    if(filterPlantName.length > 0) {
        filterPlantName = `&filterPlantName=${filterPlantName}`
    }
    if(filterInteractionType.length > 0) {
        filterInteractionType = `&filterInteractionType=${selectedInteractionType}`
    }
    if(filterAnimalName.length > 0) {
        filterAnimalName = `&filterAnimalName=${filterAnimalName}`
    }
    if(filterSource.length > 0) {
        filterSource = `&filterSource=${filterSource}`
    }
    const language = localStorage.getItem("language") || "en-US"
    const metadata = $.ajax({type: "GET", url: `/api/v1/interactions/${language}/metadata?page=0${filterPlantName}${filterInteractionType}${filterAnimalName}${filterSource}`, contentType: 'application/json' })
    return metadata
}

const downloadJsonInteractions = async (selectedInteractionType) => {
    let filterPlantName = $("#filterPlantName").val()
    let filterInteractionType = selectedInteractionType
    let filterAnimalName = $("#filterAnimalName").val()
    let filterSource = $("#filterSource").val()
    if(filterPlantName.length > 0) {
        filterPlantName = `&filterPlantName=${filterPlantName}`
    }
    if(filterInteractionType.length > 0) {
        filterInteractionType = `&filterInteractionType=${selectedInteractionType}`
    }
    if(filterAnimalName.length > 0) {
        filterAnimalName = `&filterAnimalName=${filterAnimalName}`
    }
    if(filterSource.length > 0) {
        filterSource = `&filterSource=${filterSource}`
    }
    const language = localStorage.getItem("language") || "en-US"
    
    return window.open(`/api/v1/interactions/${language}/download/json?${filterPlantName}${filterInteractionType}${filterAnimalName}${filterSource}`, '_blank')
}

const downloadCsvInteractions = async (selectedInteractionType) => {
    let filterPlantName = $("#filterPlantName").val()
    let filterInteractionType = selectedInteractionType
    let filterAnimalName = $("#filterAnimalName").val()
    let filterSource = $("#filterSource").val()
    if(filterPlantName.length > 0) {
        filterPlantName = `&filterPlantName=${filterPlantName}`
    }
    if(filterInteractionType.length > 0) {
        filterInteractionType = `&filterInteractionType=${selectedInteractionType}`
    }
    if(filterAnimalName.length > 0) {
        filterAnimalName = `&filterAnimalName=${filterAnimalName}`
    }
    if(filterSource.length > 0) {
        filterSource = `&filterSource=${filterSource}`
    }
    const language = localStorage.getItem("language") || "en-US"
    
    return window.open(`/api/v1/interactions/${language}/download/csv?${filterPlantName}${filterInteractionType}${filterAnimalName}${filterSource}`, '_blank')
}

const downloadDwcInteractions = async (selectedInteractionType) => {
    let filterPlantName = $("#filterPlantName").val()
    let filterInteractionType = selectedInteractionType
    let filterAnimalName = $("#filterAnimalName").val()
    let filterSource = $("#filterSource").val()
    if(filterPlantName.length > 0) {
        filterPlantName = `&filterPlantName=${filterPlantName}`
    }
    if(filterInteractionType.length > 0) {
        filterInteractionType = `&filterInteractionType=${selectedInteractionType}`
    }
    if(filterAnimalName.length > 0) {
        filterAnimalName = `&filterAnimalName=${filterAnimalName}`
    }
    if(filterSource.length > 0) {
        filterSource = `&filterSource=${filterSource}`
    }
    const language = localStorage.getItem("language") || "en-US"
    
    return window.open(`/api/v1/interactions/${language}/download/dwca?${filterPlantName}${filterInteractionType}${filterAnimalName}${filterSource}`, '_blank')
}
