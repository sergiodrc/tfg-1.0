'use strict'

var express= require('express');
var bodyParser= require('body-parser');

var app = express();

//cargar rutas

//middleware
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


//cors 

//rutas
app.get('/pruebas', (req,res)=>{
    res.status(200).send({
        message:'Acción de pruebas'
    })
})

//exportar
module.exports=app;