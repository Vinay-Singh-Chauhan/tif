const connectToMongo=require('./db');
const dotenv = require('dotenv');
dotenv.config({ path: './.env.local' });
const express = require('express')
// var express = require('express')
var cors = require('cors')
const app = express()
const port = process.env.PORT

app.use(cors())
// connect to database
connectToMongo();
app.use(express.json())
// route for homepage
app.use('/',require('./routes/homepage'));
// route for auth
app.use('/v1/auth',require('./routes/user'));
// route for role
app.use('/v1/role',require('./routes/role'));
// route for community
app.use('/v1/community',require('./routes/community'));
// route for member
app.use('/v1/member',require('./routes/member'));


app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})