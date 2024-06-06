var userModel = require("../models/user");

var key = "123456789trytryrtyr";
var encryptor = require("simple-encryptor")(key);

const fs = require('fs').promises;

var jwt = require('./jwt');

var path = require("path")

async function createUserDB(userDetails) {
    try {
        // Check if the email is already in use
        const existingUser = await userModel.findOne({ email_usuario: userDetails.email_usuario });
        if (existingUser) {
            return { status: false, msg: "Email already in use" };
        } else {
            // Create a new user model instance
        const userModelData = new userModel({
            nombre_usuario: userDetails.nombre_usuario,
            apellido_usuario: userDetails.apellido_usuario,
            email_usuario: userDetails.email_usuario,
            direccion_usuario: userDetails.direccion_usuario,
            nickname_usuario: userDetails.nickname_usuario,
            edad_usuario: userDetails.edad_usuario,
            password_usuario: encryptor.encrypt(userDetails.password_usuario), // Encrypt the password
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

async function loginUserDB(userDetails) {
  try {
    console.log(userDetails)
    const result = await userModel.findOne({
      email_usuario: userDetails.email_usuario,
    });
    console.log(result)
    if (result !== undefined && result !== null) {
      const decrypted = encryptor.decrypt(result.password_usuario);
      if (decrypted === userDetails.password_usuario) {
         const token = jwt.createToken(result); 
        return { status: true, msg: "User Validated Successfully",token:token};
      } else {
        throw { status: false, msg: "User Validation Failed" };
      }
    } else {
      throw { status: false, msg: "User Error Details" };
    }
  } catch (error) {
    console.log(error);
    /* throw { status: false, msg: "Invalid Data" }; */
  }
}

async function updateUserBD(userDetails, tokenPayload) {
  try {
    // Check if the user's email from the token matches the email being updated
    console.log(userDetails)
    console.log(tokenPayload)
    if (userDetails.email_usuario !== tokenPayload.email) {
      return { status: false, msg: "User email does not match token data" };
    } else {
    let result = await userModel.updateOne(
      { email_usuario: userDetails.email_usuario },
      {
        nombre_usuario: userDetails.nombre_usuario,
        apellido_usuario: userDetails.apellido_usuario,
        nickname_usuario: userDetails.nickname_usuario,
        email_usuario: userDetails.email_usuario,
      }
    );

    return { status: true, msg: "User updated successfully" };
    }

    
  } catch (err) {
    console.log(err);
    throw { status: false, msg: "User update failed" };
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
