'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commnetsSchema = Schema({
    comment_text: String,
    publication: {
        type:Schema.ObjectId, ref:'publications'
    },
    //receptor
    user: {
        type:Schema.ObjectId, ref:'users'
    },
})

module.exports=mongoose.model('comments',CommentSchema)
