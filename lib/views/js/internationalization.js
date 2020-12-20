const internationalization = {
    "floral-visitors": {
        "pt-BR": "Interações",
        "en-US": "Interactions",
        "es-ES": "Interacciones",
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
    "plantName": {
        "pt-BR":"Nome da planta",
        "en-US":"Plant name",
        "es-ES":"",
    },
    "animalName": {
        "pt-BR":"Nome do animal",
        "en-US":"Animal name",
        "es-ES":"",
    },
    "source": {
        "pt-BR":"Fonte",
        "en-US":"Source",
        "es-ES":"",
    },
}
const translatePage = () => {    
    const language = localStorage.getItem("language") || "en-US"
    $(".translate").each((index, element)=> {        
        $(`#${element.id}`).html(internationalization[element.id][language])
    })
}

$(document).ready(()=> {
    translatePage()
})