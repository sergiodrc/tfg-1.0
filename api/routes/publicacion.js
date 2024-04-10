'use strict'

var express= require('express');
var PublicacionController= require('../controllers/publicacion');

var api = express.Router();
var md_auth = require('../middlewares/autentication');

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/publicaciones'});

api.get('/publicaciones/:page?', md_auth.ensureAuth, PublicacionController.getPublicaciones);
api.get('/publicacion/:id', md_auth.ensureAuth, PublicacionController.getPublicaciones);
api.get('/get-image-pub/:imageFile',PublicacionController.getImageFile);

api.post('/publicacion', md_auth.ensureAuth, PublicacionController.savePublicacion);
api.post('/upload-image-pub/:id', [md_auth.ensureAuth, md_upload], PublicacionController.uploadImage)

api.delete('/publicacion/:id', md_auth.ensureAuth, PublicacionController.deletePublicacion);
