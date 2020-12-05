
const getInteractions = async () => {
    const language = localStorage.getItem("language") || "en-US"
    const interactions = $.ajax({type: "GET", url: "/api/v1/interactions/"+language, contentType: 'application/json' })
    return interactions
        // .then((response)=>{
        //     cb(response)            
        // })
}