const internationalization = {
    "floral-visitors": {
        "pt-BR": "Visitantes florais",
        "en-US": "Floral visitors",
        "es-ES": "Visitantes flores",
    },
    "copyright": {
        "pt-BR":"Copyright &copy; 2020 REBIPP - Todos os direitos reservados e outras informa&ccedil;&otilde;es",
        "en-US":"Copyright &copy; 2020 REBIPP - All rights reserved &ccedil;&otilde;es",
        "es-ES":"Copyright &copy; 2020 REBIPP - Todos los derechos reservados&ccedil;&otilde;es",
    },
    "glossary": {
        "pt-BR":"Glossário",
        "en-US":"Glossary",
        "es-ES":"Glossario",
    },
}
const translatePage = () => {    
    const language = localStorage.getItem("language") || "pt-BR"
    $(".translate").each((index, element)=> {        
        $(`#${element.id}`).html(internationalization[element.id][language])
    })
}

$(document).ready(()=> {
    translatePage()
})