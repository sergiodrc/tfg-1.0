'use strict'

var mongoose = require('mongoose');
var Schema =mongoose.Schema;

var UserSchema = Schema(
    {
        nombre_usuario:String,
        apellido_usuario:String,
        edad_usuario:Number,
        nickname_usuario:String,
        role_usuario:String,
        direccion_usuario:String,
        email_usuario:String,
        password_usuario:String,
        telef_usuario:Number,
        imagen_usuario:String
    });
    module.exports = mongoose.model('User',UserSchema);