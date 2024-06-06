const express = require('express')
const mongoose = require('mongoose');
const routes = require('./routes/routes')
const cors = require('cors');

const app = express();

// Configura CORS para permitir solicitudes desde tu cliente
app.use(cors());

async function connect() {
  try {
    await mongoose.connect("mongodb://localhost:27017/hammerland")
    console.log('Conectado a la base de datos')
  } catch {
    console.log('Error al conentar a la base de datos')
  }
  
}
connect()
app.use(express.json());
app.use(routes);

app.listen(9002,function check(err)
{
    if(err)
    console.log("error con express")
    else
    console.log("Express esta en funcionamiento ")
});