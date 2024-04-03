//para utilizar nuevas caracteristicas de js
'use strict'

//importar mongoose
var mongoose = require ('mongoose')

mongoose.Promise=global.Promise;
mongoose.connect('mongodb://localhost:27017/hammerland', {useMongoClient: true})
    .then(()=>{
        console.log('Conexión a la BBDD HAMMERLAND realizada correctamente')
    })
    .catch(err=>console.log(err));


