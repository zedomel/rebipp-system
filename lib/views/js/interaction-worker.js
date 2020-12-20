
const getInteractionTypes = async () => {
    const language = localStorage.getItem("language") || "en-US"
    const interactionTypes = await $.ajax({type: "GET", url: `/api/v1/terms/${language}/interactionType`, contentType: 'application/json' })
    return interactionTypes
}
const getInteractions = async (page) => {
    let filterPlantName = $("#filterPlantName").val()
    let filterInteractionType = $("#filterInteractionType").val()
    let filterAnimalName = $("#filterAnimalName").val()
    let filterSource = $("#filterSource").val()
    if(filterPlantName.length > 0) {
        filterPlantName = `&filterPlantName=${filterPlantName}`
    }
    if(filterInteractionType && filterInteractionType.length > 0) {
        filterInteractionType = `&filterInteractionType=${filterInteractionType}`
    }
    if(filterAnimalName.length > 0) {
        filterAnimalName = `&filterAnimalName=${filterAnimalName}`
    }
    if(filterSource.length > 0) {
        filterSource = `&filterSource=${filterSource}`
    }
    const language = localStorage.getItem("language") || "en-US"
    const interactions = $.ajax({type: "GET", url: `/api/v1/interactions/${language}?page=${page}${filterPlantName}${filterInteractionType}${filterAnimalName}${filterSource}`, contentType: 'application/json' })
    return interactions
}