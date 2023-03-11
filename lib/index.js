
import express from 'express'
import session from 'express-session'
import bodyParser from 'body-parser'
import './mongoConnections'
import { port } from './config.js'

import apiRoutes from './routes/apiRoutes.js'
import viewRoutes from './routes/viewRoutes.js'


var app = express(); 

app.use(session({	secret: 'rebipp',	resave: true,	saveUninitialized: true }));

app.use(bodyParser.urlencoded({extended : true}))
app.use(bodyParser.json())


app.use("/bower_components",express.static(__dirname + '/views/bower_components'));
app.use("/components",express.static(__dirname + '/views/components'));
app.use("/images",express.static(__dirname + '/views/images'));
app.use("/css",express.static(__dirname + '/views/css'));
app.use("/js",express.static(__dirname + '/views/js'));

app.use(function(request, response, next) {
    console.log(`Request received`, request.method,  new Date(), request.originalUrl)
    // if (request.session && request.session.loggedIn || request.originalUrl === `/login` || request.originalUrl === `/api/v1/auth`) {        
        return next()
    // }    
    // return response.redirect('/login');    
})

apiRoutes(app)
viewRoutes(app)
console.log(`[${new Date().toISOString()}] Listening at port`,port || 3000)
app.listen(port);