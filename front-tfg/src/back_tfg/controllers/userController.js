let userService = require("../service/userService");
let User = require('../models/user'); // Importar modelo de usuario
let auth = require('../middlewares/authenticator');
var path = require('path');

// Funciones del controlador
async function createUser(req, res) {
    console.log(req.body);
    var result = await userService.createUserDB(req.body);
    console.log(result);
    if (result.status) {
        res.send({ status: true, message: result.msg });
    } else {
        res.send({ status: false, message: result.msg });
    }
}

async function loginUser(req, res) {
    try {
        var result = await userService.loginUserDB(req.body);
        if (result.status === true) {
            res.send({ status: true, message: "user logged" });
        } else {
            res.send({ status: false, message: "user does not exist" });
        }
    } catch (error) {
        console.log(error);
        res.send({ status: false, message: "bad login user" });
    }
}

async function deleteUser(req, res) {
    console.log('deleteUser endpoint reached');
    console.log('Request body:', req.body);

    try {
        const result = await userService.deleteUserBD(req.body);
        console.log('Result from deleteUserBD:', result);
        if (result.status) {
            res.send({ status: true, message: "Usuario Borrado" });
        } else {
            res.send({ status: false, message: "Problemas al borrar el usuario" });
        }
    } catch (err) {
        console.log('Error:', err);
        res.send({ status: false, message: "Error al borrar el usuario" });
    }
}

async function updateUser(req, res) {
    try {
        var userEmail = req.params.email;
        let result = await userService.updateUserBD(userEmail, req.body);
        if (result.status) {
            res.send({ status: true, message: "actualización exitosa" });
        } else {
            res.send({ status: false, message: "actualización fallida" });
        }
    } catch (err) {
        console.log(err);
        res.send({ status: false, message: "error al actualizar el usuario" });
    }
}

const getUser = async (req, res) => {
    try {
        const email = req.params.correo;
        console.log(`Received email: ${email}`);
        if (typeof email !== 'string') {
            return res.status(400).json({ message: 'Invalid email format' });
        }
        const user = await User.findOne({ email_usuario: email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

async function uploadImageUser(req, res) {
    try {
        if (req.files) {
            console.log(req.body)
            console.log('-> ',req.files)
            var file_path = req.files.img_usuario.path;
            console.log(file_path)
            console.log(file_path)
            var file_split = file_path.split('\\');
            var file_name = file_split[2];
            var ext_split = file_name.split('\.');
            var file_ext = ext_split[1];
            var result = await userService.uploadImageUserBD(req);
            if (result.status) {
                res.send({
                    status: true,
                    message: "Image retrieved successfully",
                    data: result.data,
                });
            } else {
                res.send({ status: false, message: "hola" });
            }
        }
    } catch (error) {
        console.log(error);
        res.send({
            status: false,
            message: "An error occurred while retrieving the image",
        });
    }
}

async function getImageFile(req, res) {
    let result = await userService.getImageFileBD(req.body);
    if (result.status) {
        res.send({ result: true, message: "a", filePath: result.filePath });
    } else {
        res.send({ result: false, message: "b", filePath: result.filePath });
    }
}

module.exports = { createUser, loginUser, deleteUser, updateUser, getUser, uploadImageUser, getImageFile };