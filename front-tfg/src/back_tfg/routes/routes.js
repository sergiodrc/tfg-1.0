var express = require('express')

var userController = require('../controllers/userController')
var messageController = require("../controllers/messageController")
var matchController = require("../controllers/matchController")
var publicationController = require("../controllers/publicationController")
const router = express.Router()

// var md_auth = require('../middlewares/authenticator');

var multipart = require('connect-multiparty');
var md_upload_users = multipart({uploadDir: './uploads/users'});


router.route('/user/login').post(userController.loginUser)
router.route('/user/register').post(userController.createUser)
router.route('/user/deleteUser').delete(userController.deleteUser)
router.route('/user/updateUser').patch(userController.updateUser)
router.route('/userDetails').get(userController.getUser)
router.route('/uploadImageUser').post(md_upload_users,userController.uploadImageUser)
router.route('/get-image-user').get(userController.getImageFile)

router.route('/message').post(messageController.saveMessage)
router.route('/my-messages').get(messageController.getMessages)
router.route('/emmitedMessages').get(messageController.getEmmitMessages)
router.route('/unviewed-messages').get(messageController.getUnviewedMessages)
router.route('/set-viewed-messages').get(messageController.updateMessagesToViewed)

router.route('/matches/createMatch').post(matchController.createMatch)
router.route('/matches/deleteMatch').delete(matchController.deleteMatch)
router.route('/matches/joinMatch').patch(matchController.joinMatch)
router.route('/matches/leaveMatch').patch(matchController.leaveMatch)
router.route('/matches/allMatches').get(matchController.getAllMatches)
router.route('/matches/updateMatch').patch(matchController.updateMatch)
router.route('/matches/myMatches').get(matchController.getMyMatches)

router.route('/publications/createPublication').post(publicationController.createPublication)

module.exports = router;