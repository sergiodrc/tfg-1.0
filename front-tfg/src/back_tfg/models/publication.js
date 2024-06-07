'use strict'

var mongoose = require('mongoose');
var Schema =mongoose.Schema;

//Modelo de la tabla publicaciones
var PublicationSchema= Schema ({
    texto_publicacion: String,
    archivo_publicacion: String,
    fecha_creacion_publicacion:String,
    user: String, //cogera todos datos del usuario 

});

module.exports = mongoose.model('publications', PublicationSchema);