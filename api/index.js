//para utilizar nuevas caracteristicas de js
'use strict'

//importar mongoose
var mongoose = require('mongoose');
var app = require('./app');
var port= 3800;



// Conexión a la base de datos
mongoose.connect('mongodb://localhost:27017/hammerland')
  .then(() => {
    console.log('Conectado a la base de datos HAMMERLAND');

    //crear el servidor
    app.listen(port, ()=>{
        console.log("Servidor corriendo en http://localhost:3800");
    })
  })
  .catch((error) => {
    console.error('Error al conectar a la base de datos:', error);
  });
