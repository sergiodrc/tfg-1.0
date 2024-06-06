var express = require('express')

var userController = require('../controllers/userController')
var messageController = require("../controllers/messageController")
const router = express.Router()

var md_auth = require('../middlewares/authenticator');

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/users'});

router.route('/user/login').post(userController.loginUser)
router.route('/user/register').post(userController.createUser)
router.route('/user/deleteUser').delete(userController.deleteUser)
router.route('/user/updateUser').patch(userController.updateUser)
router.route('/userDetails').get(userController.getUser)

router.route('/message').post(messageController.saveMessage)
router.route('/my-messages').get(messageController.getMessages)
router.route('/emmitedMessages').get(messageController.getEmmitMessages)
router.route('/unviewed-messages').get(messageController.getUnviewedMessages)
router.route('/set-viewed-messages').get(messageController.updateMessagesToViewed)

module.exports = router;