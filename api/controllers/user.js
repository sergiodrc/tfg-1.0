'use strict'

var bcrypt = require('bcrypt-nodejs');

var User = require('../models/user');
var Follow = require('../models/follow');
var Publicacion = require('../models/publicacion')

var jwt = require('../services/jwt');

var mongoosePaginate = require('mongoose-pagination');

var fs = require('fs');

var path = require('path');


//Funciones de prueba
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

//funcion de registro
async function saveUser(req, res) {
    var params = req.body;
    var user = new User();

    if (params.nombre_usuario && params.apellido_usuario && params.email_usuario && params.password_usuario
        && params.nickname_usuario && params.direccion_usuario && params.edad_usuario && params.telef_usuario && params.role_usuario && params.imagen_usuario) {

        user.nombre_usuario = params.nombre_usuario;
        user.apellido_usuario = params.apellido_usuario;
        user.email_usuario = params.email_usuario;
        user.nickname_usuario = params.nickname_usuario;
        user.direccion_usuario = params.direccion_usuario;
        user.edad_usuario = params.edad_usuario;
        user.telef_usuario = params.telef_usuario;
        user.role_usuario = "ROLE_USER"; // por defecto los usuarios son simplemente USERS
        user.imagen_usuario = null;
        user.password_usuario = params.password_usuario;

        // Método para gestionar intentos de usuarios duplicados
        try {
            const users = await User.find({
                $or: [
                    { email_usuario: user.email_usuario.toLowerCase() },
                    { nickname_usuario: user.nickname_usuario.toLowerCase() }
                ]
            });

            if (users && users.length >= 1) {
                return res.status(200).send({ message: 'El usuario ya existe.' })
            } else {
                await user.save();
                console.log('Usuario guardado correctamente');
                res.status(200).send({ message: 'Usuario guardado correctamente' });
            }
        } catch (error) {
            console.error('Error:', error);
            res.status(500).send({ message: 'Error al procesar la solicitud' });
        }

    } else {
        res.status(200).send({
            message: 'Debes rellenar todos los campos'
        });
    }
}
//Funcion de Log in
async function loginUser(req, res) {
    const { email_usuario, password_usuario } = req.body;

    const user = await User.findOne({ email_usuario }).exec();

    if (!user) {
        return res.status(404).send({ message: "El usuario no existe" });
    }

    if (password_usuario!== user.password_usuario) {
        return res.status(401).send({ message: "La contraseña es incorrecta" });
    }

    return user
}
//Funcion Conseguir Datos usuario
function getUser(req, res) {
    var userId = req.params.id_usuario

    User.findById(userId, (err, user) => {
        if (err) return res.status(500).send({ message: "Error al realizar la consulta del Usuario" })
        if (!user) return res.status(404).send({ message: "No se ha encontrado un Usuario con el id " + userId })
        followThisUser(req.user.sub, userId).then((value) => {
            return res.status(200).send({
                user,
                following: value.following,
                followed: value.followed
            });
        });
    });
}

//Metodo asincrono para los seguidores y los seguidos
async function followThisUser(identity_user_id, user_id) {
    user.password_usuario = undefined
    var following = await Follow.findOne({ 'user': identity_user_id, 'seguido': user_id }).exec((err, follow) => {
        if (err) return handleError(err);
        return follow;
    })

    var followed = await Follow.findOne({ 'user': identity_user_id, 'seguido': user_id }).exec((err, follow) => {
        if (err) return handleError(err);
        return follow;
    })

    return {
        following: following,
        followed: followed
    }
}

//Funcion para devolver Usuarios Paginados
function getAllUsers(req, res) {
    var identity_user_id = req.user.sub;
    var page = 1;

    if (req.params.page) {
        page = req.params.page;
    }

    var itemsPerPage = 5;

    User.find().sort('_id').paginate(page, itemsPerPage, (err, users, total) => {
        if (err) return res.status(500).send({ message: 'Error en la petición' });

        if (!users) return res.status(404).send({ message: 'No hay usuarios disponibles' });

        followUsersIds(identity_user_id).then((value) => {


            return res.status(200).send({
                users,
                users_following: value.following,
                users_follow_me: value.followed,
                total,
                //Numero total de paginas
                pages: Math.ceil(total / itemsPerPage),

            });
        });

    });
}

async function followUsersIds(user_id) {
    var following = await Follow.find({ 'user': user_id }).select({ '_id': 0, '__v': 0, 'user': 0 }).exec((err, follows) => {
        return follows;
    });
    var followed = await Follow.find({ 'seguido': user_id }).select({ '_id': 0, '__v': 0, 'seguido': 0 }).exec((err, follows) => {

        return follows;
    });

    var following_clean = [];
    follows.forEach((follow) => {
        following_clean.push(follow.following);
    });

    var followed_clean = [];
    follows.forEach((follow) => {
        followed_clean.push(follow.user);
    });

    return {
        following: following_clean,
        followed: followed_clean
    }

}

function getCounters(req, res) {
    var userId = req.user.sub;
    if (req.params.id) {
        userId = req.params.id
    }

    getCountFollow(req.params.id).then((value) => {
        return res.status(200).send(value);
    });
}

async function getCountFollow(user_id) {
    var following = await follow.count({ 'user': user_id }).exec((err, count) => {
        if (err) return handleError(err)
        return count;
    });

    var followed = await Follow.count({ 'seguido': user_id }).exec((err, count) => {
        if (err) return handleError(err)
        return count;
    });

    var publications = await Publication.count({ 'user': user_id }).exec((err, count) => {
        if (err) return handleError(err)
        return count;

    })

    return {
        following: following,
        followed: followed,
        publications: publications,
    }
}

//Funcion para actualizar el usuario
function updateUser(req, res) {
    var userId = req.params.id;
    var update = req.body;

    //Borrar propiedad password ya que es mas seguro hacer un metodo a parte para actualizar la contraseña
    delete update.password;

    if (userId != req.user.sub) {
        return res.status(500).send({ message: 'El usuario no tiene permisos para editar este usuario' })
    } else {
        User.findByIdAndUpdate(userId, update, { new: true }, (err, userUpdated) => {
            if (err) return res.status(500).send({ message: "Error al actualizar el usuario" });

            if (!userUpdated) return res.status(404).send({ message: "No se ha podido encontrar el usuario" });

            return res.status(200).send({ user: userUpdated });


        })
    }
}

//Funcion para subir una foto de avatar a la base de datos
function uploadImage(req, res) {
    var userId = require.params.id;


    if (req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\')

        var file_name = file_split[2]
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        if (userId != req.user.sub) {
            return removeFilesOfUploads(res, file_path, 'La imagen del perfil solo puede ser cargada por el usuario corresponddiente');

        }
        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif') {
            User.findByIdAndUpdate(userId, { imagen_usuario: file_name }, { new: true }, (err, userUpdated) => {
                if (err) return res.status(500).send({ message: "Error al actualizar la imagen" });

                if (!userUpdated) return res.status(404).send({ message: "No se ha podido encontrar el usuario" });

                return res.status(200).send({ user: userUpdated });
            });
        } else {
            return removeFilesOfUploads(res, file_path, 'Extension no valida');
        }
    } else {
        res.status(200).send({ message: "No ha enviado ninguna imagen" });
    }
};

function removeFilesOfUploads(res, file_path, message) {
    fs.unlink(file_path, (err) => {
        if (err) return res.status(200).send({ message: message })
    });
};

function getImageFile(req, res) {
    var image_file = req.params.imageFile;
    var path_file = './uploads/images/' + req.params.image_file;

    fs.exists(image_file, (exist) => {
        if (exist) {
            res.sendFile(image_file);
        } else {
            return res.status(404).send({ message: "La imagen no existe" });
        }
    });
};


module.exports = {
    home,
    pruebas,
    saveUser,
    loginUser,
    getUser,
    getAllUsers,
    getCounters,
    updateUser,
    uploadImage,
    getImageFile
}
