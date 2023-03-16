const internationalization = {
    "mainPageTitle": {
        "pt-BR": "Consultar Dados de Interaçães",
        "en-US": "Search for Interactions Data",
        "es-ES": "Buscar Datos de Interacciones",
    },
    "copyright": {
        "pt-BR": "Copyright &copy; 2020 REBIPP - Todos os direitos reservados e outras informa&ccedil;&otilde;es",
        "en-US": "Copyright &copy; 2020 REBIPP - All rights reserved &ccedil;&otilde;es",
        "es-ES": "Copyright &copy; 2020 REBIPP - Todos los derechos reservados&ccedil;&otilde;es",
    },
    "glossary": {
        "pt-BR": "Glossário",
        "en-US": "Glossary",
        "es-ES": "Glosario",
    },
    "interactionType": {
        "pt-BR": "Tipo de interação",
        "en-US": "Interaction type",
        "es-ES": "Tipo de interacción",
    },
    "plantNameLabel": {
        "pt-BR": "Nome da planta",
        "en-US": "Plant name",
        "es-ES": "Nombre de la planta",
    },
    "animalNameLabel": {
        "pt-BR": "Nome do animal",
        "en-US": "Animal name",
        "es-ES": "Nombre del animal",
    },
    "sourceLabel": {
        "pt-BR": "Fonte",
        "en-US": "Source",
        "es-ES": "Fuente",
    },
    "download": {
        "pt-BR": "Baixar",
        "en-US": "Download",
        "es-ES": "Descargar",
    },
    "contributePageTitle": {
        'pt-BR': "Como Contribuir",
        "en-US": "How to Contribute",
        "es-ES": "Cómo contribuir"
    },
    "contributeText": {
        "pt-BR": "Você pode contribuir com a Rede Brasileira de Interações Planta-Polinizadores compartilhando seu conjunto de dados de interações planta-polinizador.",
        "en-US": "You can contribute to the Brazilian Network on Plant-Pollinator Interactions by sharing your plant-pollinator interactions dataset.",
        "es-ES": "Puede contribuir a la Red Brasileña de Interacciones Planta-Polinizador por compartiendo tu conjunto de datos de interacciones planta-polinizador."
    },
    "shareData": {
        "pt-BR": "Compartilhar Dados",
        "en-US": "Share Data",
        "es-ES": "Compartir Datos"
    },
    "contributeSteps": {
        "pt-BR": "Siga as etapas abaixo para preparar e compartilhar seus dados:",
        "en-US": "Follow the steps below to prepare and share your data:",
        "es-ES": "Siga los pasos a continuación para preparar y compartir sus datos:"
    },
    "contributeStp1": {
        "pt-BR": 'Obtenha uma cópia da planilha de modelo padronizado <a href="https://docs.google.com/spreadsheets/d/1z2mvs6Bm7fE5IhxPRVbh1ieEfKsVKeIiK_mitPqvPJw/copy" target="_blank">aqui</a>',
        "en-US": 'Get a copy of the standardized template worksheet <a href="https://docs.google.com/spreadsheets/d/1z2mvs6Bm7fE5IhxPRVbh1ieEfKsVKeIiK_mitPqvPJw/copy" target="_blank">here</a>',
        "es-ES": 'Obtenga una copia de la hoja de trabajo de la plantilla estandarizada <a href="https://docs.google.com/spreadsheets/d/1z2mvs6Bm7fE5IhxPRVbh1ieEfKsVKeIiK_mitPqvPJw/copia" target="_blank">aquí</a>'
    },
    "contributeStp2": {
        "pt-BR": "Preencha a planilha com seus dados seguindo as definições de coluna. <b>Não é necessário preencher em todas as colunas. Preencha apenas aqueles para os quais você tem dados.</b>",
        "en-US": "Fill the worksheet with your data following the column definitions. <b>It is not necessary to fill in all columns. Only fill in those for which you have data.</b>",
        "es-ES": "Llena la planilla con tus datos siguiendo el definiciones de columna <b>No es necesario llenar en todas las columnas. Rellena solo aquellas de las que tengas datos.</b>"
    },
    "contributeStp3": {
        "pt-BR": "Preencha os metadados na planilha.",
        "en-US": "Fill the metadata in the spreadsheet.",
        "es-ES": "Rellene los metadatos en la hoja de cálculo"
    },
    "contributeStp4": {
        "pt-BR": 'Copie o URL (link) da sua planilha e envie para <a href="mailto:rebipp2016@gmail.com">rebipp2016@gmail.com</a> para revisão',
        "en-US": 'Copy the URL (link) of your spreadsheet and submit to <a href="mailto:rebipp2016@gmail.com">rebipp2016@gmail.com</a> for review',
        "es-ES": 'Copie la URL (enlace) de su hoja de cálculo y envíela a <a href="mailto:rebipp2016@gmail.com">rebipp2016@gmail.com</a> para su revisión.'
    },
    "contributeStp5": {
        "pt-BR": "Se encontrarmos algum problema com seus dados, entraremos em contato para providenciar as correções.",
        "en-US": "If we find any problems with your data, we will contact you to arrange corrections.",
        "es-ES": "Si encontramos algún problema con sus datos, nos comunicaremos con usted para coordinar las correcciones."
    },
    "contributeStp6": {
        "pt-BR": "Quando o conjunto de dados estiver pronto, ele será publicado no portal REBIPP.",
        "en-US": "When the dataset is ready it will be published in the REBIPP portal.",
        "es-ES": "Cuando el conjunto de datos esté listo, se publicará en el portal de la REBIPP."
    },
    "contributeStp7": {
        "pt-BR": "<b>Você pode definir um embargo em seu conjunto de dados. Basta torná-lo explícito ao enviar o URL da planilha, especificando a data em que o conjunto de dados deve ser tornado público.</b>",
        "en-US": "<b>You can set an embargo on your dataset. Just make it explicit when submitting the spreadsheet URL, specifying the date the dataset should be made public.</b>",
        "es-ES": "<b>Puede establecer un embargo en su conjunto de datos. Simplemente hágalo explícito cuando envíe la URL de la hoja de cálculo, especificando la fecha en que el conjunto de datos debe hacerse público.</b>"
    }
}
const translatePage = () => {
    const language = localStorage.getItem("language") || "en-US"
    $(".translate-html").each((index, element) => {
        $(`#${element.id}`).html(internationalization[element.id][language])
    })
    $("#downloadLanguage").html(language)
}

$(document).ready(() => {
    translatePage()
})