'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'root';

exports.ensureAuth = function(req,res,next) {
    if(!req.headers.authorization) {
        return res.status(403).send({message: "Requiere token"});
    }

    var token = req.headers.authorization.replace(/[\"\']+/g,'') //quitar comillas dobles y simples de las cabeceras http

    try {
        var payload = jwt.decode(token, secret);
        // Verificar si el token ha expirado
        if(payload.exp <= moment().unix()) {
            return  res.status(401).send({ message: 'Token ha expirado' });
        }
    } catch(ex) {
        return res.status(404).send({
            message: 'el token no es valido'
        });
    }

    req.user = payload

    next();
    

}