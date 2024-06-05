var userModel = require("../models/user");

var key = "123456789trytryrtyr";
var encryptor = require("simple-encryptor")(key);

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
    const result = await userModel.findOne({
      email_usuario: userDetails.email_usuario,
    });

    if (result !== undefined && result !== null) {
      const decrypted = encryptor.decrypt(result.password_usuario);
      if (decrypted === userDetails.password_usuario) {
        return { status: true, msg: "User Validated Successfully" };
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

async function deleteUserBD(userDetails) {
  try {
    let result = await userModel.deleteOne({
      email_usuario: userDetails.email_usuario,
    });
  } catch (err) {
    console.log(err);
  }
}

async function updateUserBD(userDetails) {
  try {
    let result = await userModel.updateOne(
      { email_usuario: userDetails.email_usuario },
      {
        //email_usuario: userDetails.email_usuario,
        password_usuario: encryptor.encrypt(userDetails.password_usuario),
      }
    );
    return { status: true, msg: "User updated Successfully" };
  } catch (err) {
    console.log(err);
    throw { status: false, msg: "User Error Details" };
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
        return { status: true, msg: "User found successfully", data: result };
      } else {
        return { status: false, msg: "User not found" };
      }
    } catch (err) {
      console.log(err);
      throw { status: false, msg: "User Error Details", error: err };
    }
  }

module.exports = { createUserDB, loginUserDB, deleteUserBD, updateUserBD, getUserBD };
