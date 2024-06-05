var express = require('express')

var userController = require('../controllers/userController')
const router = express.Router()

var md_auth = require('../middlewares/authenticator');

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/users'});

router.route('/user/login').post(userController.loginUser)
router.route('/user/register').post(userController.createUser)

router.route('/user/deleteUser').delete(userController.deleteUser)

router.route('/user/updateUser').patch(userController.updateUser)

router.route('/userDetails').get(userController.getUser)

module.exports = router;