const mongoose = require('mongoose');
const mongoUri = 'mongodb://localhost:27017/noteit?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false';

const connetToMongo = async()=>{
    await mongoose.connect(mongoUri,()=>{
        console.log("connected to database successfully");
    })
}

module.exports= connetToMongo;
