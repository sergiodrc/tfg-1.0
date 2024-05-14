'use strict'

var express= require('express');
var UserController= require('../controllers/user');

var api = express.Router();
var md_auth = require('../middlewares/autentication');

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/users'});

//Rutas GET
api.get('/home',UserController.home);
api.get('/pruebas',md_auth.ensureAuth,UserController.pruebas);
api.get('/user/:id',md_auth.ensureAuth,UserController.getUser);
api.get('/all-users/:page?',md_auth.ensureAuth,UserController.getAllUsers);
api.get('/get-image-user/:imageFile',UserController.getImageFile);
api.get('/counters/:id?',UserController.getCounters);

//Rutas POST
api.post('/register',UserController.saveUser);
api.post('/login',UserController.loginUser);
api.post('/upload-image-user/:id',[md_auth.ensureAuth, md_upload],UserController.uploadImage);

//Rutas PUT
api.put('/update-user/:id',md_auth.ensureAuth,UserController.updateUser);

module.exports=api;