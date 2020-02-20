
const getInteractions = (cb) => {    
    const language = localStorage.getItem("language") || "pt-BR"
    $.ajax({type: "GET", url: "/api/v1/interactions/"+language, contentType: 'application/json' })
        .then((response)=>{
            cb(response)            
        })
}