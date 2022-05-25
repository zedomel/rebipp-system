const internationalization = {
    "mainPageTitle": {
        "pt-BR": "Consultar Dados de Interaçães",
        "en-US": "Search for Interactions Data",
        "es-ES": "Buscar Datos de Interacciones",
    },
    "copyright": {
        "pt-BR":"Copyright &copy; 2020 REBIPP - Todos os direitos reservados e outras informa&ccedil;&otilde;es",
        "en-US":"Copyright &copy; 2020 REBIPP - All rights reserved &ccedil;&otilde;es",
        "es-ES":"Copyright &copy; 2020 REBIPP - Todos los derechos reservados&ccedil;&otilde;es",
    },
    "glossary": {
        "pt-BR":"Glossário",
        "en-US":"Glossary",
        "es-ES":"Glosario",
    },
    "interactionType": {
        "pt-BR":"Tipo de interação",
        "en-US":"Interaction type",
        "es-ES":"Tipo de interacción",
    },
    "plantNameLabel": {
        "pt-BR":"Nome da planta",
        "en-US":"Plant name",
        "es-ES":"?",
    },
    "animalNameLabel": {
        "pt-BR":"Nome do animal",
        "en-US":"Animal name",
        "es-ES":"?",
    },
    "sourceLabel": {
        "pt-BR":"Fonte",
        "en-US":"Source",
        "es-ES":"?",
    },
    "download": {
        "pt-BR":"Baixar",
        "en-US":"Download",
        "es-ES":"?",
    },
}
const translatePage = () => {    
    const language = localStorage.getItem("language") || "en-US"
    $(".translate-html").each((index, element)=> {       
        $(`#${element.id}`).html(internationalization[element.id][language])
    })
    $("#downloadLanguage").html(language)
}

$(document).ready(()=> {
    translatePage()
})