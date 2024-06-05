var express = require('express')

var userController = require('../controllers/userController')
var publicationController = require('../controllers/publicationController')
const router = express.Router()

var md_auth = require('../middlewares/authenticator');

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/users'});


//rutas user
router.post('/user/login', userController.loginUser); // No es necesario el prefijo '/user' aquí
router.post('/user/register', userController.createUser); 
router.delete('/user/deleteUser', userController.deleteUser); // No es necesario el prefijo '/user' aquí
router.patch('/user/updateUser', userController.updateUser); // No es necesario el prefijo '/user' aquí
router.get('/user/userDetails', userController.getUser);
 

//rutas publicaciones

router.post('/user/createPublicacion', publicationController.createPublicacion);// crear una nueva publicación
router.get('/user/getPublicacion/:publicacionId', publicationController.getPublicacion);//obtener detalles de una publicación
router.patch('/user/updatePublicacion/:publicacionId', publicationController.updatePublicacion);//actualizar una publicación
router.delete('/user/deletePublicacion/:publicacionId', publicationController.deletePublicacion);//eliminar una publicación



module.exports = router;



