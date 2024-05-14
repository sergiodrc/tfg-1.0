'use strict'

var mongoose = require('mongoose');
var Schema =mongoose.Schema;

//Modelo de la tabla mensajes
var MessageSchema = Schema({

    text_mensaje: String,
    fecha_creacion_mensaje: String,
    viewed: String,
    
    //emisor
    emitter: {
        type:Schema.ObjectId, ref:'User'
    },
    //receptor
    receiver: {
        type:Schema.ObjectId, ref:'User'
    },

});

module.exports=mongoose.model('Message', MessageSchema)