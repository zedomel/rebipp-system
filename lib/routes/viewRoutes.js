import express from 'express'
import _ from 'lodash'
import fs from 'fs'

function render(view, ctx = {}) {
    return _.template(fs.readFileSync(__dirname + `/../views/${view}.html`))(ctx)
}

var viewRouter = function (app) {
    const router = express.Router();   

    router.get('/login', function(request, response) {
        console.log(`login`)     
        response.send(render("login", { message:"" }))
    });

    router.get('/', function(request, response) {
        response.send(render("home", {}))        
    });

    router.get('/profile/:userId', function(request, response) {        
        const userId = request.params.userId                
        response.send(render("profile", {userId}))        
    });

    router.get('/personal-data', function(request, response) {
        const userId = request.session.loggedin
        response.send(render("personal-data", {userId}))        
    });
    
    app.use('/', router);
}
module.exports = viewRouter;