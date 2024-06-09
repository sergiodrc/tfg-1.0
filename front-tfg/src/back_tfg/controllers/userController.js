let userService = require("../service/userService");

let user = require('../models/user')
let auth = require('../middlewares/authenticator')

var path = require('path');


//funciona
async function createUser(req, res) {
  console.log(req.body);
  var result = await userService.createUserDB(req.body);
  console.log('a')
  console.log(result)
  if (result.status) {
    res.send({ status: true, message: result.msg });
  } else {
    res.send({ status: false, message: result.msg });
  }
}
//funciona
async function loginUser(req, res) {
  var result = null;
  try {
    result = await userService.loginUserDB(req.body);
    if (result.status === true) {
      res.send({ status: true, message: "user loged" });
    } else {
      res.send({ status: false, message: "user does not exist"});
    }
  } catch (error) {
    console.log(error);
    res.send({ status: false, message: "bad login user" });
  }
}


//funciona
async function deleteUser(req, res) {
  console.log('deleteUser endpoint reached');  // Mensaje de depuración
  console.log('Request body:', req.body);  // Verificar el cuerpo de la solicitud

  try {
    const result = await userService.deleteUserBD(req.body);
    console.log('Result from deleteUserBD:', result);  // Mensaje de depuración
    console.log(result)
    if (result.status) {
      res.send({ status: true, message: "Usuario Borrado" });
    } else {
      res.send({ status: false, message: "Problemas al borrar el usuario" });
    }
  } catch (err) {
    console.log('Error:', err);  // Mensaje de depuración
    res.send({ status: false, message: "Error al borrar el usuario" });
  }
}

//funciona
async function updateUser(req, res) {
  try {
    // Obtener el correo electrónico del usuario a actualizar de los parámetros de la URL
    var userEmail = req.params.email;

    // Llamar al servicio para actualizar el usuario en la base de datos
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




async function getUser(userEmail) {
  try {
    // Buscar y devolver los datos del usuario por su correo electrónico
    let user = await userModel.findOne({ email_usuario: userEmail });
    return user;
  } catch (err) {
    console.log(err);
    return null;
  }
}

async function uploadImageUser(req, res) {
  try {
    if(req.files) {
      var file_path = req.files.img_usuario.path;
      var file_split = file_path.split('\\')
  
      var file_name  = file_split[2]
      var ext_split = file_name.split('\.');
      var file_ext  = ext_split[1];
  
      /* if(userId != req.user.sub) {
          return removeFilesOfUploads(res, file_path, 'La imagen del perfil solo puede ser cargada por el usuario correspondiente');
          
  } */

    // Retrieve user details from the database
    var result = await userService.uploadImageUserBD(req);

    // Check if the user was successfully retrieved
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

async function getImageFile(req,res) {
    let result = null
    result = await userService.getImageFileBD(req.body)
    console.log(result)
    if(result) {
      res.send({result: true, message:"a"})
    } else {
      res.send({result: false, message:"b"})
    }
}


module.exports = { createUser, loginUser, deleteUser, updateUser, getUser, uploadImageUser,getImageFile };
