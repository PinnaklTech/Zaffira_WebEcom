const mongoose = require("mongoose");

const connectDB = async () =>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected");
    }
    catch (err){
        console.log("MongoDB Not Connected", err);
        process.exit(1);
    }
};


module.exports = connectDB

