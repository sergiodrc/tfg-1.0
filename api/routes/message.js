'use strict'

var express= require('express');
var MessageController= require('../controllers/message');

var api = express.Router();
var md_auth = require('../middlewares/autentication');

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/publicaciones'});

api.post('/message', md_auth.ensureAuth, MessageController.saveMessage)

api.get('/my-messages/:page?', md_auth.ensureAuth, MessageController.getReceivedMessages)
api.get('/messages/:page?', md_auth.ensureAuth, MessageController.getEmmitMessages)
api.get('/unviewed-messages', md_auth.ensureAuth, MessageController.getUnviewedMessages)
api.get('/set-viewed-messages', md_auth.ensureAuth, MessageController.setViewedMessages)

module.exports=api;