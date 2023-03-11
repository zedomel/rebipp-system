
const reportError = (data, cb) => {     
    console.log({data})
    $.post("/api/v1/reportError", data)
}