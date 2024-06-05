const express = require('express')
const mongoose = require('mongoose');
const routes = require('./routes/routes')

const app = express()





async function connect() {
  try {
    await mongoose.connect("mongodb://localhost:27017/hammerland")
    console.log('connected')
  } catch {
    console.log('error')
  }
  
  
}
connect()
app.use(express.json());
app.use(routes);

app.listen(9002,function check(err)
{
    if(err)
    console.log("error")
    else
    console.log("started")
});