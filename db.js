const mongoose=require('mongoose')
const dotenv = require('dotenv');
dotenv.config({ path: './.env.local' });
const mongoURI=process.env.MONGO_URI;
// database active at
// console.log(mongoURI)
const connectToMongo=()=>{
    try{
        mongoose.connect(mongoURI).then(()=>{
            console.log("Database connected")
        });
    }catch(error){
        console.log("Problem detected in connecting to Database");
        console.log(error);
    }

}
module.exports=connectToMongo;