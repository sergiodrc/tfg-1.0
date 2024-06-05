let userService = require("../service/userService");

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
    result = await userService.loginUserDB(req.body);
    if (result.status) {
      res.send({ status: true, message: "a" });
    } else {
      res.send({ status: false, message: result.msg });
    }
  } catch (error) {
    console.log(error);
    res.send({ status: false, message: "c" });
  }
}

async function deleteUser(req, res) {
  var result = null;
  try {
    result = await userService.deleteUserBD(req.body);
    if (result.status) {
      res.send({ status: true, message: "a" });
    } else {
      res.send({ status: false, message: "b" });
    }
  } catch (err) {
    console.log(error);
    res.send({ status: false, message: "error al borrar el usuario" });
  }
}

async function updateUser(req, res) {
  let result = null;
  try {
    result = await userService.updateUserBD(req.body);
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

module.exports = { createUser, loginUser, deleteUser, updateUser, getUser };
