'use strict'

var mongoose = require('mongoose');
var Schema =mongoose.Schema;

var MessageSchema = Schema({
    //emisor
    emmiter: {
        type:Schema.ObjectId, ref:'User'
    },
    //receptor
    receiver: {
        type:Schema.ObjectId, ref:'User'
    },
    text:String,
    fecha_creacion:String,
});

module.exports=mongoose.model('Message', MessageSchema)