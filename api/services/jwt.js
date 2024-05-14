'use strict'

var jwt = require('jwt-simple')
var moment = require('moment')
var secret = 'root'

//Clase necesaria para la creacion de los tokens de validacion
exports.createToken = function(user) {
    var payload = {
        sub: user._id,
        name: user.nombre_usuario,
        surname: user.apellido_usuario,
        nick: user.nickename_usuario,
        email: user.email_usuario,
        role: user.role_usuario,
        image: user.imagen_usuario,
        iat: moment().unix(),
        exp: moment().add(30, 'days').unix // 30 días de validez para el token

    };

    return jwt.encode(payload, secret);
}