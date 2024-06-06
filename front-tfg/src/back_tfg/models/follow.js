'use strict'

//Modelo de la tabla seguidos
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FollowSchema = Schema({
    user: {
        type:Schema.ObjectId, ref:'users'
    },
    seguidor: {
        type:Schema.ObjectId, ref:'users'
    }
})

module.exports=mongoose.model('follows',FollowSchema)