const express=require('express');
const bcrypt=require('bcryptjs');
const jwt = require('jsonwebtoken');
const router=express.Router();
const Role=require('../models/role')
const dotenv = require('dotenv');
dotenv.config({ path: './../.env.local' });
const { body, validationResult } = require('express-validator');
const { Snowflake } = require('@theinternetfolks/snowflake');
const JWT_SECRET=process.env.JWT_SECRET


router.post('/',
    body('name',"Name should be at least 2 characters.").isLength({ min: 2 }),
    
    async (req,res)=>{
        const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorRes=[];
      errors.array().map((e)=>{
        errorRes.push({param:e.path,message:e.msg,code:"INVALID_INPUT"})
      })
      return res.status(400).json({ status:false,errors:errorRes});
    }
    try
    {
      
    
    //create role
    let  new_role=await Role.create({
      id:Snowflake.generate(),
      name: req.body.name

    })
    let response={
        id:new_role.id,
        name:new_role.name,
        created_at:new_role.created_at,
        updated_at:new_role.updated_at,
    }


    res.json({status:true,content:{data:response}})}
    catch(error){
      console.log(error.message);
      res.status(500).send(error)
    }    
})
function paginatedResults() {
    return async (req, res, next) => {
      
      const page = parseInt(req.query.page)?parseInt(req.query.page):1;
      const limit = parseInt(req.query.limit)?parseInt(req.query.limit):10;
      const skipIndex = (page - 1) * limit;
    //   const results = [];
    let size=0;
  
      try {
        size= await Role.estimatedDocumentCount();
        results = await Role.find()
        .limit(limit)
          .skip(skipIndex)
          .exec();
          let response=[]
          results.map((e)=>{
            response.push({
                id:e.id,
                name:e.name,
                created_at:e.created_at,
                updated_at:e.updated_at,
            })
          })
        
            
          res.response = response;
          res.page = page;
          res.size = size;
        next();
      } catch (e) {
        res.status(500).json({ message: e });
      }
    };
  }
router.get('/',paginatedResults(),
    async (req,res)=>{
        return res.status(200).json({status:true,content:{data:res.response,meta: {
            total: res.size,
            pages: res.size%10==0?(res.size/10):Math.floor(res.size/10)+1,
            page: res.page
          }}})
     
})



module.exports=router;