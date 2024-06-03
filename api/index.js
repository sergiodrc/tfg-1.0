//para utilizar nuevas caracteristicas de js
'use strict'

//importar mongoose
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 9000;

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/hammerland', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Conectado a la base de datos HAMMERLAND');

  // Iniciar el servidor solo después de que la base de datos se haya conectado
  app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:9000`);
  });
})
.catch((error) => {
  console.error('Error al conectar a la base de datos:', error);
});
