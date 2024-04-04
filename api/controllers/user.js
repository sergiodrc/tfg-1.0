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

    if (params.nombre && params.apellido && params.email && params.password 
        && params.nickname && params.adress && params.edad && params.telef){

            user.nombre= params.nombre;
            user.apellido= params.apellido;
            user.email=params.email;
            user.password=params.password;
            user.nickname=params.nickname;
            user.adress=params.adress;
            user.edad=params.edad;
            user.telef=params.telef;
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
