'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commnetsSchema = Schema({
    comment_text: String,
    publication: {
        type:Schema.ObjectId, ref:'publications'
    },
    //receptor
    user: String,
    fecha_comentario: String
})

module.exports=mongoose.model('comments',commnetsSchema)
