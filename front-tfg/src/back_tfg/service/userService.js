const User = require("../models/user");
const key = "123456789trytryrtyr";
const encryptor = require("simple-encryptor")(key);
const fs = require('fs').promises;
const jwt = require('./jwt');
const path = require("path");

async function createUserDB(userDetails) {
    console.log(userDetails);
    try {
        const resultUser = await User.findOne({ email_usuario: userDetails.correo });
        const resultNickName = await User.findOne({ nickname_usuario: userDetails.nickname });
        if (resultUser) {
            return { status: false, msg: "Email already in use" };
        } else if (resultNickName) {
            return { status: false, msg: "Nickname already in use" };
        } else {
            const userModelData = new User({
                nombre_usuario: userDetails.nombre,
                apellido_usuario: userDetails.apellido,
                email_usuario: userDetails.correo,
                direccion_usuario: 'zaragoza',
                nickname_usuario: userDetails.nickname,
                edad_usuario: '18',
                password_usuario: encryptor.encrypt(userDetails.password),
                img_usuario: "r3KEsoR8M3RTGKpEXktdp5ZD.jpg"
            });
            const result = await userModelData.save();
            return { status: true, msg: "User registered successfully", result: result };
        }
    } catch (error) {
        return { status: false, msg: "Registration failed", error: error.message };
    }
}

async function loginUserDB(userDetails) {
    try {
        let result = await User.findOne({ email_usuario: userDetails.correo });
        if (result) {
            const decryptedPassword = encryptor.decrypt(result.password_usuario);
            if (decryptedPassword === userDetails.password) {
                const token = jwt.createToken(result, 'root');
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

async function updateUserBD(userEmail, userDetails) {
    try {
        let user = await User.findOne({ email_usuario: userEmail });
        if (!user) {
            return { status: false, msg: "No se encontró ningún usuario con el correo electrónico especificado" };
        }
        user.nombre_usuario = userDetails.nombre_usuario || user.nombre_usuario;
        user.apellido_usuario = userDetails.apellido_usuario || user.apellido_usuario;
        user.nickname_usuario = userDetails.nickname_usuario || user.nickname_usuario;
        user.tlf_usuario = userDetails.tlf_usuario || user.tlf_usuario;
        await user.save();
        return { status: true, msg: "Usuario actualizado exitosamente" };
    } catch (err) {
        console.log(err);
        return { status: false, msg: "Error al actualizar el usuario" };
    }
}

async function getUserBD(userEmail) {
    try {
        let result = await User.findOne({ email_usuario: userEmail });
        if (result) {
            return { status: true, msg: "User found successfully", user: result };
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
        let result = await User.deleteOne({ email_usuario: userDetails.correo });
        if (result.deletedCount > 0) {
            return { status: true, msg: "User delete successfully" };
        } else {
            return { status: false, msg: "Problems deleting user" };
        }
    } catch (err) {
        console.log(err);
        return { status: false, msg: "Problems with user delete" };
    }
}

async function uploadImageUserBD(userDetails) {
    try {
        const file_path = userDetails.files.img_usuario.path;
        const file_name = path.basename(file_path);
        const file_ext = path.extname(file_name).slice(1);
        console.log('a -> ',file_path)
        console.log('b -> ',file_name)
        console.log('c -> ',file_ext)
        if (!['png', 'jpg', 'jpeg', 'gif'].includes(file_ext.toLowerCase())) {
          await removeFilesOfUploads(file_path);
          return { status: false, message: 'Extensión no válida' };
      }
      console.log(userDetails.body.email_usuario)
      var userUpdated = await User.updateOne(
          { email_usuario: userDetails.body.email_usuario },
          { img_usuario: file_name },
          { new: true }
        
      );
      console.log(userUpdated)

      if (!userUpdated) {
          return { status: false, message: "No se ha podido encontrar el usuario" };
      }

      return { status: true, user: userUpdated };
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
      const imagePath = path.join('../','../','assets','img','users', imageFileName);

      const exists = await fs.access(imagePath)
          .then(() => true)
          .catch((err) => console.log('este es el error ->    ', err));

      if (exists) {
          return { status: true, filePath: imagePath };
      } else {
          return { status: false, message: "La imagen no existe", filePath: imagePath };
      }
  } catch (err) {
      console.error(err);
      return { status: false, message: "Error al obtener la imagen" };
  }
}

module.exports = { createUserDB, loginUserDB, deleteUserBD, updateUserBD, getUserBD, uploadImageUserBD, getImageFileBD };