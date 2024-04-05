'use strict'

var User = require('../models/user');

function home(req,res){
    res.status(200).send({
        message:'Accion de prueba'
    });
}

function pruebas(req,res){
    console.log(req.body);
    res.status(200).send({
        message:'Pruebas de servidor de Node'
    });
};

function saveUser(req,res){
    var params=req.body;
    var user = new User();

    if (params.nombre_usuario && params.apellido_usuario && params.email_usuario && params.password_usuario 
        && params.nickname_usuario && params.direccion_usuario && params.edad_usuario && params.telef_usuario){

            user.nombre_usuario= params.nombre_usuario;
            user.apellido_usuario= params.apellido_usuario;
            user.email_usuario=params.email_usuario;
            user.password_usuario=params.password_usuario;
            user.nickname_usuario=params.nickname_usuario;
            user.direccion_usuario=params.direccion_usuario;
            user.edad_usuario=params.edad_usuario;
            user.telef_usuario=params.telef_usuario;
        }
        else{
            res.status(200).send({
                message:'Debes rellenar todos los campos'
            })        }
}


module.exports= {
    home,
    pruebas
}
