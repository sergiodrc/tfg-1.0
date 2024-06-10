'use strict'

var mongoose = require('mongoose');
var Schema =mongoose.Schema;

//Modelo de la tabla mensajes
var MessageSchema = Schema({

    texto_mensaje: String,
    fecha_creacion_mensaje: String,
    viewed: String,
    
    //emisor
    emitter: String,
    //receptor
    receiver: String,

});

module.exports=mongoose.model('messages', MessageSchema)