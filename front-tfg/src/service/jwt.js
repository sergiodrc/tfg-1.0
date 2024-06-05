'use strict'

var jwt = require('jwt-simple')
var moment = require('moment')
var secret = 'root'

exports.createToken = function(user) {
    var payload = {
        sub: user._id,
        name: user.nombre_usuario,
        surname: user.apellido_usuario,
        nick: user.nickename_usuario,
        email: user.email_usuario,
        password_usuario: user.password_usuario,
        image: user.imagen_usuario,

    };

    return jwt.encode(payload, secret);
}