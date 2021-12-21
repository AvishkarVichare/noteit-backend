const express = require("express")
const connetToMongo =require('./db')
const authRoute = require('./routes/auth');
const notesRoute = require('./routes/notes');
connetToMongo();
const app = express();

app.use(express.json())

app.use('/api/auth',authRoute)
app.use('/api/notes',notesRoute)

app.listen(80,()=>{
    console.log("conneted")
})