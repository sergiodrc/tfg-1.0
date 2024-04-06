'use strict'

var jwt = require('jwt-simple');
var moment= require('moment');
var secret ='clave_secreta_tfg'
//generacion del token
exports.createToken= function (user){
    var payload= {
        sub: user._id,
        nombre: user.nombre,
        apellido: user.apellido,
        email:user.email,
        role:user.role,
        image:user.image,
        nickname:user.nickname,
        adress:user.adress,
        telef:user.telef,
        edad:user.edad,
        iat: moment().unix(),
        exp: moment().add(30, 'days').unix
    };
    return jwt.encode(payload, secret)
};