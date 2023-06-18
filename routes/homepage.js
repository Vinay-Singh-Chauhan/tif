const express=require('express');
const bcrypt=require('bcryptjs');
const jwt = require('jsonwebtoken');
const router=express.Router();
const Member=require('../models/member')
const Role=require('../models/role')

const Community=require('../models/community')
const dotenv = require('dotenv');
dotenv.config({ path: './../.env.local' });
const { body, validationResult } = require('express-validator');
const { Snowflake } = require('@theinternetfolks/snowflake');
const User = require('../models/user');
const fs = require('fs');

const JWT_SECRET=process.env.JWT_SECRET

//creating a community
router.get('/',
    
    async (req,res)=>{
      try
      {
        

fs.readFile('./readme.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    res.setHeader(
        'Content-Type','text/html'
    )
    return res.status(400).json({
        msg:
        "some error Occurred. Kindly visit: https://github.com/Vinay-Singh-Chauhan/tif"
    })

  }
  return res.status(200).send(data)
});

    // res.status(200).json({status:true,content:{data:new_community}})
}
    catch(error){
      console.log(error.message);
      res.status(500).send(error)
    }    
})



module.exports=router;