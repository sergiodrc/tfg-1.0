'use strict'

var express= require('express');
var bodyParser= require('body-parser');

var app = express();

//cargar rutas
var user_routes=require('./routes/user');
var follow_routes = require('./routes/follow');
var publicacion_routes = require('./routes/publicacion');

//middleware
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


//cors 

//rutas
app.use('/api', user_routes);
app.use('/api', follow_routes);
app.use('/api', publicacion_routes);

//exportar
module.exports=app;