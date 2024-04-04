'use strict'

var mongoose = require('mongoose');
var Schema =mongoose.Schema;

var PublicacionSchema= Schema ({
    texto: String,
    archivo: String,
    fecha_creacion:String,
    user:{  type: Schema.ObjectId, ref: 'User'} //cogera todos datos del usuario 

});

module.exports = mongoose.model('Publicacion', PublicacionSchema);