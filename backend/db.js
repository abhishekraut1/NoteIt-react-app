const mongoose = require('mongoose');
const mongoURI = "mongodb://127.0.0.1:27017/noteit"
const connectToMongoose = async ()=>{ 
    try{
        mongoose.set("strictQuery",false);
        mongoose.connect(mongoURI);
        console.log("Connected to Mongo Successfully!");
    }catch(err){
        console.log(err);
    }
} 

module.exports = connectToMongoose;