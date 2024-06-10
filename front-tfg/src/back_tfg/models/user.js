var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Modelo de la tabla usuarios
var UserSchema = new Schema({
    nombre_usuario: String,
    apellido_usuario: String,
    nickname_usuario: String,
    role_usuario: String,
    direccion_usuario: String,
    email_usuario: String,
    password_usuario: String,
    tlf_usuario: Number,
    img_usuario: String  
});

<<<<<<< HEAD
module.exports = mongoose.model('users', UserSchema);
=======
module.exports = mongoose.model('users', UserSchema);
>>>>>>> d6fcb3c2ff1dad213d4da7c1603f10371a844b0b
