'use strict'

//Modelo de la tabla seguidos
var mongoose = require('mongoose');
var Schema =mongoose.Schema;

var FollowSchema = Schema({
    user: {
        type:Schema.ObjectId, ref:'User'
    },
    seguido: {
        type:Schema.ObjectId, ref:'User'
    }
})

module.exports=mongoose.model('Follow',FollowSchema)