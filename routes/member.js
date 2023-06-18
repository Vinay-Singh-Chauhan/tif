const express=require('express');
const bcrypt=require('bcryptjs');
const jwt = require('jsonwebtoken');
const router=express.Router();
const User=require('../models/user')
const Member=require('../models/member')
const Role=require('../models/role')
const Community=require('../models/community')
const dotenv = require('dotenv');
dotenv.config({ path: './../.env.local' });
const { body, validationResult } = require('express-validator');
const { Snowflake } = require('@theinternetfolks/snowflake');
// const User = require('../models/user');
const JWT_SECRET=process.env.JWT_SECRET

//add member
router.post('/',
    
    async (req,res)=>{
      try
    {
        const token=req.headers.authorization
        // console.log(token)
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
      let userToAdd=await User.findOne({id:req.body.user});
      let role=await Role.findOne({id:req.body.role});;
      if(!userToAdd){
        return res.status(400).json(
        {
  status: false,
  errors: [
    {
      param: "user",
      message: "User not found.",
      code: "RESOURCE_NOT_FOUND"
    }
  ]
})
      }
      if(!role){
        return res.status(400).json(
        {
  status: false,
  errors: [
    {
      param: "role",
      message: "Role not found.",
      code: "RESOURCE_NOT_FOUND"
    }
  ]
})
      }

      let community=await Community.findOne({id:req.body.community});;
      if(!community){
        return res.status(400).json(
        {
  status: false,
  errors: [
    {
      param: "community",
      message: "Community not found.",
      code: "RESOURCE_NOT_FOUND"
    }
  ]
})
      }

      let authdata=jwt.verify(token,JWT_SECRET);
     let  id=authdata.user.id;
      let owner=await User.findOne({id:id})
      // console.log(id)
      // console.log(req.body.community)
      if(!owner){
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
      let membership=await Member.findOne({user:owner.id, community:community.id});
      // console.log(membership.role)
      // console.log(idCommunityAdmin.id)
    if(membership.role!=idCommunityAdmin.id){
        return res.status(400).json({
            status: false,
            errors: [
              {
                message: "You are not authorized to perform this action.",
                code: "NOT_ALLOWED_ACCESS"
              }
            ]
          })
    }
let membership_of_user=await Member.findOne({user:req.body.user,community:community.id})
if(membership_of_user){
    return res.status(400).json(
        {
  status: false,
  errors: [
    {
      param: "community",
      message: "User is already added in the community.",
      code: "RESOURCE_EXISTS"
    }
  ]
})
}



    
    
      let new_member=await Member.create({
        id:Snowflake.generate(),
        community:req.body.community,
        role:req.body.role,
        user:req.body.user
      })
    res.json({status:true,content:{data:new_member}})
}
    catch(error){
      console.log(error.message);
      res.status(500).send(error)
    }    
})









router.delete('/:id',
    
    async (req,res)=>{
      try
    {
        const token=req.headers.authorization
        // console.log(token)
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
      let owner=await User.findOne({id:id})
      // console.log(id)
      // console.log(req.body.community)
      if(!owner){
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
      let idCommunityModerator=await Role.findOne({name:'Community Moderator'})

    
    
    let member=await Member.findOne({id:req.params.id});
    if(!member){
      return res.status(400).json({
        status: false,
        errors: [
          {
            message: "Member not found.",
            code: "RESOURCE_NOT_FOUND"
          }
        ]
      })
      
    }
    console.log(member)
    let ownership= await Member.find({$or :[{community:member.community,user:owner.id,role:idCommunityAdmin.id}, {community:member.community,user:owner.id,role:idCommunityModerator.id}]})
    // console.log(ownership)
    if(ownership.length==0){
      return res.status(400).json({
        status: false,
        errors: [
          {
            message: "You are not authorized to perform this action.",
            code: "NOT_ALLOWED_ACCESS"
          }
        ]
      })
    }
      await Member.deleteOne({
        id:req.params.id
      })
    res.json({status:true})
}
    catch(error){
      console.log(error.message);
      res.status(500).send(error)
    }    
})



module.exports=router;