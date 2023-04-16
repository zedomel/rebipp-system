import express from 'express'
import _ from 'lodash'
import fs from 'fs'

function render(view, ctx = {}) {
    return _.template(fs.readFileSync(__dirname + `/../views/${view}.html`), { 'interpolate': /<%=([\s\S]+?)%>/g })(ctx)
}

var viewRouter = function (app) {
    const router = express.Router();

    // router.get('/login', function(request, response) {
    //     console.log(`login`)
    //     response.send(render("login", { message:"" }))
    // });

    router.get('/', function (request, response) {
        response.send(render("home", {}))
    });

    router.get('/publish', function (request, response) {
        response.send(render("publish", {}))
    });
    router.get('/sankey-analysis', function (request, response) {
        response.send(render("sankey-analysis", {}))
    });
    router.get('/map-analysis', function (request, response) {
        response.send(render("map-analysis", {}))
    });
    router.get('/glossary', function (request, response) {
        response.send(render("glossary", {}))
    });
    router.get('/how-to-contribute', function (request, response) {
        response.send(render('how-to-contribute', {}));
    })


    // router.get('/profile/:userId', function(request, response) {
    //     const userId = request.params.userId
    //     response.send(render("profile", {userId}))
    // });

    // router.get('/personal-data', function(request, response) {
    //     const userId = request.session.loggedin
    //     response.send(render("personal-data", {userId}))
    // });

    app.use('/', router);
}
module.exports = viewRouter;