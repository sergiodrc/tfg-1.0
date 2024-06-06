var userModel = require("../models/user");

var key = "123456789trytryrtyr";
var encryptor = require("simple-encryptor")(key);

const fs = require('fs').promises;

var jwt = require('./jwt');

var path = require("path")


  //este metodo inserta ya
async function createUserDB(userDetails) {

    try {
      // console.log("etalles usaasd", userDetails);
        // Check if the email is already in use
        const existingUser = await userModel.findOne({ email_usuario: userDetails.email_usuario });
        if (existingUser) {
            return { status: false, msg: "Email already in use" };
        } else {
            // Create a new user model instance
        const userModelData = new userModel({
            nombre_usuario: userDetails.nombre,
            apellido_usuario: userDetails.apellido,
            email_usuario: userDetails.correo,
            direccion_usuario: 'zaragoza',
            nickname_usuario: userDetails.nickname,
           edad_usuario:'18',
             password_usuario:encryptor.encrypt(userDetails.password),
             // Encrypt the password
        });
        // Save the new user to the database
        const result = await userModelData.save();
        return { status: true, msg: "User registered successfully", result: result };
        }

        
    } catch (error) {
        // Handle any errors that occur during the process
        return { status: false, msg: "Registration failed", error: error.message };
    }

}
// para esto no deberia comparar usuario y contraseña???

//desde front medio ok hay que cambiar el then
async function loginUserDB(userDetails) {
  try {
    console.log("User details received: ", userDetails);
    const result = await userModel.findOne({
      email_usuario: userDetails.correo
    });

    console.log("Database query result: ", result);

    if (result) {
      const decryptedPassword = encryptor.decrypt(result.password_usuario);
      if (decryptedPassword === userDetails.password) {
        const token = jwt.createToken( result , 'root'); // Asegúrate de usar una clave secreta segura
        return { status: true, msg: "Usuario logeado correctamente", token: token };
      } else {
        return { status: false, msg: "Contraseña incorrecta" };
      }
    } else {
      return { status: false, msg: "Usuario no encontrado" };
    }
  } catch (error) {
    console.error("Error during login: ", error);
    return { status: false, msg: "Error en el servidor" };
  }
}


// async function loginUserDB(userDetails) {
//   try {
//     console.log(userDetails)
//     const result = await userModel.findOne({
//       email_usuario: userDetails.correo,
//       password_usuario: userDetails.password
//     });
//     console.log("result-> ",result)
//     console.log("a");
//     if (result !== undefined && result !== null) {
//       const decrypted = result.password;
//       if (decrypted === userDetails.password) {
//          const token = jwt.createToken(result); 
//         return { status: true, msg: "Usuario logeado correctamente",token:token};
//       } else {
//         throw { status: false, msg: "Login fallido" };
//       }
//     } else {
//       throw { status: false, msg: "User Error Details" };
//     }
//   } catch (error) {
//     console.log(error);
//     /* throw { status: false, msg: "Invalid Data" }; */
//   }
// }

async function updateUserBD(userEmail, userDetails, tokenPayload) {
  try {
    // Check if the user's email from the token matches the email being updated
    console.log(userDetails);
    console.log(tokenPayload);
    
    if (userEmail !== tokenPayload.email) {
      return { status: false, msg: "El correo electrónico del usuario no coincide con los datos del token" };
    } else {
      let result = await userModel.updateOne(
        { email_usuario: userEmail }, // Buscar el usuario por su correo electrónico
        {
          nombre_usuario: userDetails.nombre_usuario,
          apellido_usuario: userDetails.apellido_usuario,
          nickname_usuario: userDetails.nickname_usuario,
          email_usuario: userDetails.email_usuario,
        }
      );

      return { status: true, msg: "Usuario actualizado exitosamente" };
    }
  } catch (err) {
    console.log(err);
    throw { status: false, msg: "Error al actualizar el usuario" };
  }
}



async function getUserBD(userDetails) {
    try {
      // Find the user by nickname_usuario
      let result = await userModel.findOne({
        nickname_usuario: userDetails.nickname_usuario,
      });
      // Check if the user was found
      if (result) {
        return { status: true, msg: "User found successfully"};
      } else {
        return { status: false, msg: "User not found" };
      }
    } catch (err) {
      console.log(err);
      throw { status: false, msg: "User Error Details", error: err };
    }
  }

async function deleteUserBD(userDetails, tokenPayload) {
  try {
    if (userDetails.email_usuario !== tokenPayload.email) {
      return { status: false, msg: "User email does not match token data" };
    } else {
      let result = await userModel.deleteOne({
        email_usuario: userDetails.email_usuario
      })
      if(result) {
        return { status: true, msg: "User delete successfully" };
      } else {
        return { status: false, msg: "Problems with user delete" };
      }
    }
  } catch(err) {
    return { status: false, msg: "Problems with user delete" };
  }
}

async function uploadImageUserBD(userDetails) {
  try {
      const file_path = userDetails.files.img_usuario.path;
      const file_name = path.basename(file_path);
      const file_ext = path.extname(file_name).slice(1);

      if (!['png', 'jpg', 'jpeg', 'gif'].includes(file_ext.toLowerCase())) {
          await removeFilesOfUploads(file_path);
          return {status: false, message: 'Extensión no válida' };
      }
      const userUpdated = await userModel.updateOne(
          userDetails.email_usuario,
          { img_usuario: file_name },
          { new: true }
      );

      if (!userUpdated) {
          return { status: false, message: "No se ha podido encontrar el usuario" };
      }

      return {status: true, user: userUpdated };
  } catch (err) {
      console.error(err);
      return { status: false, message: "Error al actualizar la imagen" };
  }
}

async function removeFilesOfUploads(file_path) {
  try {
      await fs.unlink(file_path);
  } catch (err) {
      console.error("Error al eliminar el archivo:", err);
  }
}

async function getImageFileBD(userDetails) {
  try {
    const imageFileName = userDetails.img_usuario;
    const imagePath = path.join(__dirname, '..', '..', 'uploads', 'users', imageFileName);

    const exists = await fs.access(imagePath)
        .then(() => true)
        .catch(() => false);

    if (exists) {
        return { status: true, filePath: imagePath };
    } else {
        return { status: false, message: "La imagen no existe" };
    }
} catch (err) {
    console.error(err);
    return { status: false, message: "Error al obtener la imagen" };
}
}

module.exports = { createUserDB, loginUserDB, deleteUserBD, updateUserBD, getUserBD, uploadImageUserBD,getImageFileBD };
