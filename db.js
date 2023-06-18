const mongoose=require('mongoose')
const dotenv = require('dotenv');
dotenv.config({ path: './.env.local' });
const mongoURI=process.env.MONGO_URI;
console.log(mongoURI)
const connectToMongo=()=>{
    mongoose.connect(mongoURI).then(()=>{
        console.log("done")
    });

}
module.exports=connectToMongo;