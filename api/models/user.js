'use strict'

var mongoose = require('mongoose');
var Schema =mongoose.Schema;

var UserSchema = Schema(
    {
        nombre:String,
        apellido:String,
        edad:Number,
        nickname:String,
        role:String,
        adress:String,
        email:String,
        password:String,
        telef:Number,
        image:String
    });
    module.exports=mongoose.model('User',UserSchema);