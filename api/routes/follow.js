'use strict'

var express = require('express');
var followController = require('../controllers/follow');
var api = express.Router();
var md_auth = require('../middlewares/autentication')

//Rutas GET
api.get('/following/:id?/:page?', md_auth.ensureAuth, followController.getFollowingUsers); 
api.get('/followed/:id?/:page?', md_auth.ensureAuth, followController.getFollowedUsers); 

//rutas POST
api.post('/follow',md_auth.ensureAuth , followController.saveFollow);

//Rutas DELETE
api.delete('/follow/:id',md_auth.ensureAuth, followController.deleteFollow);