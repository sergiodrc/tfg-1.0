var express = require('express')

var userController = require('../controllers/userController')
const router = express.Router()

router.route('/user/login').post(userController.longinUserFunction)
router.route('/user/register').post(userController.createUserFunction)

module.exports = router;