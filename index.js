const express = require("express")
const connetToMongo =require('./db')
const authRoute = require('./routes/auth');
connetToMongo();
const app = express();

app.use(express.json())

app.use('/api/auth',authRoute)

app.listen(80,()=>{
    console.log("conneted")
})