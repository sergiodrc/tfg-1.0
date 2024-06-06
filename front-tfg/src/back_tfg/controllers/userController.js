let userService = require("../service/userService");

let user = require('../models/user')
let auth = require('../middlewares/authenticator')

var path = require('path');

async function createUser(req, res) {
  console.log(req.body);
  var status = await userService.createUserDB(req.body);
  if (status) {
    res.send({ status: status.status, message: status.msg });
  } else {
    res.send({ status: status.status, message: status.msg });
  }
}

async function loginUser(req, res) {
  var result = null;
  try {
    console.log(req)
    result = await userService.loginUserDB(req.body);
    console.log(result)
    if (result) {
      res.send({ status: true, message: "a" });
    } else {
      res.send({ status: false, message: "hola"});
    }
  } catch (error) {
    console.log(error);
    res.send({ status: false, message: "c" });
  }
}

async function deleteUser(req, res) {
  var result = null;
  let decodedToken = await auth.ensureAuth(req)
  console.log(decodedToken)
  if (decodedToken === null) {
    res.send({ status: false, message: "z" });
  } else {
    try {
      result = await userService.deleteUserBD(req.body,decodedToken);
      if (result.status) {
        res.send({ status: true, message: "a" });
      } else {
        res.send({ status: false, message: "b" });
      }
    } catch (err) {
      console.log(err);
      res.send({ status: false, message: "error al borrar el usuario" });
    }
  }
}

async function updateUser(req, res) {
  let result = null;
  let decodedToken = await auth.ensureAuth(req)
  console.log(decodedToken)
  if (decodedToken === null) {
    res.send({ status: false, message: "z" });
  } else {
    try {
      result = await userService.updateUserBD(req.body,decodedToken);
      if (result.status) {
        res.send({ status: true, message: "a" });
      } else {
        res.send({ status: false, message: "b" });
      }
    } catch (err) {
      console.log(err);
      res.send({ status: false, message: "error al actualizar el usuario" });
    }
  } 
  }


async function getUser(req, res) {
  try {
    // Retrieve user details from the database
    const result = await userService.getUserBD(req.body);

    // Check if the user was successfully retrieved
    if (result.status) {
      res.send({
        status: true,
        message: "User retrieved successfully",
        data: result.data,
      });
    } else {
      res.send({ status: false, message: result.msg });
    }
  } catch (error) {
    console.log(error);
    res.send({
      status: false,
      message: "An error occurred while retrieving the user",
    });
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
    const result = await userService.uploadImageUserBD(req);

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
    console.log(req)
    result = await userService.getImageFileBD(req.body)
    console.log(result)
    if(result) {
      res.send({result: true, message:"a"})
    } else {
      res.send({result: false, message:"b"})
    }
}




/* function uploadImageUser(req,res){


if(req.files) {
  var file_path = req.files.image.path;
  var file_split = file_path.split('\\')

  var file_name  = file_split[2]
  var ext_split = file_name.split('\.');
  var file_ext  = ext_split[1];
  if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif') {
      User.findByIdAndUpdate(userId, {imagen_usuario: file_name}, {new:true}, (err, userUpdated) =>{
          if(err) return res.status(500).send({message:"Error al actualizar la imagen"});

          if (!userUpdated) return res.status(404).send({message:"No se ha podido encontrar el usuario"});
  
          return  res.status(200).send({user: userUpdated});
      }); 
  } else {
      return removeFilesOfUploads(res, file_path, 'Extension no valida');
  }
} else {
  res.status(200).send({message: "No ha enviado ninguna imagen"});
}
};

function removeFilesOfUploads(res, file_path, message) {
  fs.unlink(file_path, (err) => {
      if(err) return res.status(200).send({message: message})
   });
};

function  getImageFile(req, res) {
  var image_file = req.params.imageFile;
  var path_file = './uploads/images/' + req.params.image_file;

  fs.exists(image_file, (exist) => {
       if(exist) {
          res.sendFile(image_file);
      } else {
          return ({status: false, message: "La imagen no existe"});
      }
  });
}; */

module.exports = { createUser, loginUser, deleteUser, updateUser, getUser, uploadImageUser,getImageFile };
