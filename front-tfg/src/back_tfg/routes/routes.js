var express = require('express')

var userController = require('../controllers/userController')
var messageController = require("../controllers/messageController")
var matchController = require("../controllers/matchController")
var publicationController = require("../controllers/publicationController")
const router = express.Router()

var md_auth = require('../middlewares/authenticator');

var multipart = require('connect-multiparty');
var md_upload_users = multipart({uploadDir: './uploads/users'});
var md_upload_publications = multipart({uploadDir: './uploads/publications'})


router.route('/user/login').post(userController.loginUser)//funcionando
router.route('/user/register').post(userController.createUser)//funcionando
router.route('/user/deleteUser').delete(userController.deleteUser)//funcionando
router.route('/user/updateUser/:email').patch(userController.updateUser)//funcionando
router.route('/userDetails/:correo').get(userController.getUser);//funcionando
router.route('/userDetails/:email').get(userController.getUser);//funcionando
router.route('/userDetails/:email').get(userController.getUser);//funcionando
router.route('/uploadImageUser/:email').post(md_upload_users,userController.uploadImageUser)
router.route('/get-image-user').get(userController.getImageFile)

router.route('/message').post(messageController.saveMessage)//funcionando
router.route('/my-messages/:receiver').get(messageController.getMessages);//funcionando
router.route('/sentMessages/:email').get(messageController.getMySentMessages);//funcionando
router.route('/unviewed-messages').get(messageController.getUnviewedMessages)
router.route('/set-viewed-messages').get(messageController.updateMessagesToViewed)

router.route('/matches/createMatch').post(matchController.createMatch)//funcionando
router.route('/matches/deleteMatch/:id').delete(matchController.deleteMatch);//funcionando
router.route('/matches/joinMatch/:id').patch(matchController.joinMatch);
router.route('/matches/leaveMatch').patch(matchController.leaveMatch)
router.route('/matches/allMatches').get(matchController.getAllMatches)//funcionando
router.route('/matches/updateMatch/:_id').patch(matchController.updateMatch)
router.route('/matches/myMatches').get(matchController.getMyMatches)//funcionando

router.route('/publications/createPublication').post(md_upload_publications,publicationController.createPublication)
router.route('/publications/deletePublication/:_id').delete(publicationController.deletePublication)
router.route('/publications/updatePublication').patch(md_upload_publications,publicationController.updatePublication)
router.route('/publications/getAllPublications').get(publicationController.getAllPublications)
router.route('/publications/getMyPublications/:email').get(publicationController.getMyPublications)

module.exports = router;