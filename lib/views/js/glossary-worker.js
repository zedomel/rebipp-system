// if (typeof(Storage) !== "undefined") {
//     let language = localStorage.getItem("language") || 'pt-BR'
// } else {
//     let language = 'pt-BR'
// }
const getGlossary = (cb) => {     
    const language = localStorage.getItem("language") || 'pt-BR'
    $.ajax({type: "GET", url: "/api/v1/glossary/"+language, contentType: 'application/json' })
        .then((response)=>{
            cb(response)            
        })
}