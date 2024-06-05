const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/routes');
const cors = require('cors');
const app = express();
app.use(cors());

// Conexión a la base de datos
async function connect() {
  try {
    await mongoose.connect("mongodb://localhost:27017/hammerland", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}
// Llamada a la función de conexión
connect();

// Configuración de Express
app.use(express.json());
app.use('/api', routes); // Usando las rutas de usuario bajo el prefijo '/api/user'

// Iniciar el servidor
app.listen(9002, function(err) {
  if (err) {
    console.error('Error starting server:', err);
  } else {
    console.log('Server started on port 9002');
  }
});
