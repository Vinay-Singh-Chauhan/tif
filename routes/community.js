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

const JWT_SECRET=process.env.JWT_SECRET

//creating a community
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
      const token=req.headers.authorization
        if(!token){
          return res.status(400).json({
            status: false,
            errors: [
              {
                message: "You need to sign in to proceed.",
                code: "NOT_SIGNEDIN"
              }
            ]
          })
        }
      try
      {
        let authdata=jwt.verify(token,JWT_SECRET);
       let  id=authdata.user.id;
        let user=await User.findOne({id})
      if(!user){

        return res.status(400).json({
            status: false,
            errors: [
              {
                message: "You need to sign in to proceed.",
                code: "NOT_SIGNEDIN"
              }
            ]
          })
      }
      //checking unique name condition
      let community=await Community.findOne({email:req.body.name})
    if(community){
      return res.status(400).json({
        status:false,
        errors:[{
        param: "email",
        message: "A community with this Name already exists.",
        code: "RESOURCE_EXISTS"
      }]})
    }
    let new_community=await Community.create({
      id:Snowflake.generate(),
      name: req.body.name,
      slug:req.body.name.toLowerCase().replaceAll(' ','-')+'-'+Snowflake.generate(),
      owner:user.id
    })
    let idCommunityAdmin=await Role.findOne({name:'Community Admin'})
    
    let ownership=await Member.create(
      {
        id:Snowflake.generate(),
        community:new_community.id,
        role:idCommunityAdmin.id,
        user:user.id
      }
    )
    res.status(200).json({status:true,content:{data:new_community}})}
    catch(error){
      console.log(error.message);
      res.status(500).send(error)
    }    
})


// all communities
function paginatedResults() {
  return async (req, res, next) => {
    
    const page = parseInt(req.query.page)?parseInt(req.query.page):1;
    const limit = parseInt(req.query.limit)?parseInt(req.query.limit):10;
    const skipIndex = (page - 1) * limit;
  //   const results = [];
  let size=0;

    try {
      size= await Community.estimatedDocumentCount();
      results = await Community.find()
      .limit(limit)
        .skip(skipIndex)
        .exec();
        let response=[]
        for(let i=0;i<results.length;i++){
          let owner= await User.findOne({id:results[i].owner})
          response.push({
              id:results[i].id,
              name:results[i].name,
              slug:results[i].slug,
              owner:{
                id:owner.id,
                name:owner.name
              },
              created_at:results[i].created_at,
              updated_at:results[i].updated_at,
        })
      }
       
      
          
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

// all community members

function paginatedMembers() {
  return async (req, res, next) => {
    
    const page = parseInt(req.query.page)?parseInt(req.query.page):1;
    const limit = parseInt(req.query.limit)?parseInt(req.query.limit):10;
    const skipIndex = (page - 1) * limit;
    let results = [];
  let size=0;

    try {
      // console.log(req.params.id)
      size= await Member.countDocuments({community:req.params.id});
      results = await Member.find({community:req.params.id})
      .limit(limit)
        .skip(skipIndex)
        .exec();
        // console.log(results)
        let response=[]
        for(let i=0;i<results.length;i++){
          let user= await User.findOne({id:results[i].user})
          let role= await Role.findOne({id:results[i].role})
          response.push({
              id:results[i].id,
              community:results[i].community,
              user:{
                id:user.id,
                name:user.name
              },
              role:{
                id:role.id,
                name:role.name
              },
              created_at:results[i].created_at
        })
      }
       
      // console.log(response)
          
        res.response = response;
        res.page = page;
        res.size = size;
      next();
    } catch (e) {
      res.status(500).json({ message: e });
    }
  };
}

router.get('/:id/members',paginatedMembers(),

async (req,res)=>{
  return res.status(200).json({status:true,content:{data:res.response,meta: {
      total: res.size,
      pages: res.size%10==0?(res.size/10):Math.floor(res.size/10)+1,
      page: res.page
    }}})

}

)







function paginatedOwnedCommunity() {
  return async (req, res, next) => {
    
    const page = parseInt(req.query.page)?parseInt(req.query.page):1;
    const limit = parseInt(req.query.limit)?parseInt(req.query.limit):10;
    const skipIndex = (page - 1) * limit;
    let results = [];
  let size=0;

    try {
      const token=req.headers.authorization
      if(!token){
        return res.status(400).json({
          status: false,
          errors: [
            {
              message: "You need to sign in to proceed.",
              code: "NOT_SIGNEDIN"
            }
          ]
        })
      }
    
      let authdata=jwt.verify(token,JWT_SECRET);
     let  id=authdata.user.id;
      let currUser=await User.findOne({id})
    if(!currUser){

      return res.status(400).json({
          status: false,
          errors: [
            {
              message: "You need to sign in to proceed.",
              code: "NOT_SIGNEDIN"
            }
          ]
        })
    }
    
      size= await Community.countDocuments({owner:currUser.id});
      results = await Community.find({owner:currUser.id})
      .limit(limit)
        .skip(skipIndex)
        .exec();
        // console.log(results)
        // let response=results
      //   for(let i=0;i<results.length;i++){
      //     let community= await Community.findOne({id:results[i].community})
          
      //     response.push(community)
      // }
       
      // console.log(response)
          
        res.response = results;
        res.page = page;
        res.size = size;
      next();
    } catch (e) {
      res.status(500).json({ message: e });
    }
  };
}

router.get('/me/owner',paginatedOwnedCommunity(),

async (req,res)=>{
  return res.status(200).json({status:true,content:{data:res.response,meta: {
      total: res.size,
      pages: res.size%10==0?(res.size/10):Math.floor(res.size/10)+1,
      page: res.page
    }}})

}

)






function paginatedJoinedCommunity() {
  return async (req, res, next) => {
    
    const page = parseInt(req.query.page)?parseInt(req.query.page):1;
    const limit = parseInt(req.query.limit)?parseInt(req.query.limit):10;
    const skipIndex = (page - 1) * limit;
    let results = [];
  let size=0;

    try {
      const token=req.headers.authorization
      if(!token){
        return res.status(400).json({
          status: false,
          errors: [
            {
              message: "You need to sign in to proceed.",
              code: "NOT_SIGNEDIN"
            }
          ]
        })
      }
    
      let authdata=jwt.verify(token,JWT_SECRET);
     let  id=authdata.user.id;
      let currUser=await User.findOne({id})
    if(!currUser){

      return res.status(400).json({
          status: false,
          errors: [
            {
              message: "You need to sign in to proceed.",
              code: "NOT_SIGNEDIN"
            }
          ]
        })
    }
    let idCommunityAdmin=await Role.findOne({name:'Community Admin'})
    // console.log(currUser.id)
    size= await Member.countDocuments({user:currUser.id,role:{$ne:idCommunityAdmin.id }});
    results = await Member.find({user:currUser.id})
    .limit(limit)
    .skip(skipIndex)
    .exec();
    results=results.filter((e)=>{
      // console.log(e.role)
      return e.role!=idCommunityAdmin.id
    })
        // console.log(results)
        let response=[]
        for(let i=0;i<results.length;i++){
          let community= await Community.findOne({id:results[i].community})
          let owner=await User.findOne({id:community.owner})
          community.owner={id:owner.id,
          name:owner.name}
          response.push(community)

      }
       
      // console.log(response)
          
        res.response = response;
        res.page = page;
        res.size = size;
      next();
    } catch (e) {
      res.status(500).json({ message: e });
    }
  };
}

router.get('/me/member',paginatedJoinedCommunity(),

async (req,res)=>{
  return res.status(200).json({status:true,content:{data:res.response,meta: {
      total: res.size,
      pages: res.size%10==0?(res.size/10):Math.floor(res.size/10)+1,
      page: res.page
    }}})

}

)



module.exports=router;