'use strict'
var bcrypt = require('bcrypt-nodejs')

var User = require('../models/user');
var jwt = require('../services/jwt');

function home(req, res) {
    res.status(200).send({
        message: 'Accion de prueba'
    });
}

function pruebas(req, res) {
    console.log(req.body);
    res.status(200).send({
        message: 'Pruebas de servidor de Node'
    });
};

function saveUser(req, res) {
    var params = req.body;//esto recoge todo lo que llegue de los campos del form
    var user = new User();

    if (params.nombre && params.apellido && params.email && params.password
        && params.nickname && params.adress && params.edad && params.telef) {

        user.nombre = params.nombre;
        user.apellido = params.apellido;
        user.email = params.email;
        user.password = params.password;
        user.nickname = params.nickname;
        user.adress = params.adress;
        user.edad = params.edad;
        user.telef = params.telef;
        user.role = 'ROLE_USER';
        user.image = null;

        /*para buscar si hay algun email o nickname duplicado, .find busca todos registros y 
        a traves del $or usamos el operador or para buscar en varios campos a la vez*/
        User.find({
            $or: [
                { email: user.email.toLowerCase() },
                { nickname: user.nickname.toLowerCase() },
            ]
        }).exec((err, users) => {
            if (err) return res.status(500).send({ message: 'Error en la petición de usuarios' });
            if (users && users.length >= 1) {
                return rest.status(200).send({ message: 'El usuario ya existe' })
            } else {
                //encriptar la contraseña
                bcrypt.hash(params.password, null, null, (err, hash) => {
                    user.password = hash;

                    //guardar el usuario
                    user.save((err, usuarioGuardado) => {
                        if (err) return res.status(500).send({ message: 'Error al registrar el usuario' });
                        if (usuarioGuardado) {
                            res.status(200).send({ user: usuarioGuardado });
                        } else {
                            res.status(404).send({ message: 'No se ha registrado el usuario' })
                        }
                    })
                })
            }
        })

    }
    else {
        res.status(200).send({
            message: 'Debes rellenar todos los campos'
        })
    }
}


function loginUser(req,res){
    var params= req.body;
    var email=params.email;
    var password=params.password;

    User.findOne({email:email}, (err, user)=>{
        if(err) return res.status(500).send({message:'Error en la petición'});

        if (user){
            bcrypt.compare(password,user.password, (err, check)=>{
                if(check){//si el check es true devuelve un token con la informacion codificada, sino devuelve el objeto user
                    if(params.gettoken){
                        return res.status(200).send({
                            token: jwt.createToken(user)
                        })
                    }else{
                        user.password=undefined;//para no devolver la contraseña
                        return res.status(200).send({user})
                    }
                 
                }else{
                    return res.status(404).send({
                        message:'El usuario no se ha podido logear'
                    });
                }
            });
        }else{
            return res.status(404).send({
                message:'El usuario no se ha podido identificar'
            })
        }
    })
}


module.exports = {
    home,
    pruebas,
    saveUser,
    loginUser
}
