const express = require('express')
const mongoose = require('mongoose');

const app = express()
var routes = require('./routes/routes')


app.listen(9002,function check(err)
{
    if(err)
    console.log("error")
    else
    console.log("started")
});



mongoose.connect("mongodb://localhost:27017/hammerland",{useNewUrlParser: true,  useUnifiedTopology: true },
function checkDb(error)
{
    if(error)
    {
        console.log("Error Connecting to DB");
    }
    else
    {
        console.log("successfully Connected to DB");
    }
});

app.use(express.json());
app.use(routes);