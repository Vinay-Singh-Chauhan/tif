const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/user");
const Member = require("../models/member");
const Role = require("../models/role");
const Community = require("../models/community");
const dotenv = require("dotenv");
dotenv.config({ path: "./../.env.local" });
const { Snowflake } = require("@theinternetfolks/snowflake");
const JWT_SECRET = process.env.JWT_SECRET;

//adding a member
router.post(
  "/",

  async (req, res) => {
    try {
      jwttoken=req.headers.authorization;
    TokenArray = jwttoken.split(" ");
    const token = TokenArray[1]
      // if token was recieved or not
      if (!token || TokenArray[0]!='Bearer') {
        return res.status(400).json({
          status: false,
          errors: [
            {
              message: "You need to sign in to proceed.",
              code: "NOT_SIGNEDIN",
            },
          ],
        });
      }
      // fetch use to be added
      let userToAdd = await User.findOne({ id: req.body.user });
      // fetch role to be added
      let role = await Role.findOne({ id: req.body.role });
      // if user does not exist
      if (!userToAdd) {
        return res.status(400).json({
          status: false,
          errors: [
            {
              param: "user",
              message: "User not found.",
              code: "RESOURCE_NOT_FOUND",
            },
          ],
        });
      }
      // if role does not exist
      if (!role) {
        return res.status(400).json({
          status: false,
          errors: [
            {
              param: "role",
              message: "Role not found.",
              code: "RESOURCE_NOT_FOUND",
            },
          ],
        });
      }
      // fetch community to which user is to be added
      let community = await Community.findOne({ id: req.body.community });
      // if community does not exist
      if (!community) {
        return res.status(400).json({
          status: false,
          errors: [
            {
              param: "community",
              message: "Community not found.",
              code: "RESOURCE_NOT_FOUND",
            },
          ],
        });
      }
      // check role of user adding other user 
      let authdata = jwt.verify(token, JWT_SECRET);
      let id = authdata.user.id;
      let owner = await User.findOne({ id: id });
      if (!owner) {
        return res.status(400).json({
          status: false,
          errors: [
            {
              message: "You need to sign in to proceed.",
              code: "NOT_SIGNEDIN",
            },
          ],
        });
      }
      // fetch Community Admin role
      let idCommunityAdmin = await Role.findOne({ name: "Community Admin" });
      let membership = await Member.findOne({
        user: owner.id,
        community: community.id,
      });

      // if current user is not community admin
      if (membership.role != idCommunityAdmin.id) {
        return res.status(400).json({
          status: false,
          errors: [
            {
              message: "You are not authorized to perform this action.",
              code: "NOT_ALLOWED_ACCESS",
            },
          ],
        });
      }
      // find whether member already exists
      let membership_of_user = await Member.findOne({
        user: req.body.user,
        community: community.id,
      });
      if (membership_of_user) {
        return res.status(400).json({
          status: false,
          errors: [
            {
              param: "community",
              message: "User is already added in the community.",
              code: "RESOURCE_EXISTS",
            },
          ],
        });
      }
      // create member
      let new_member = await Member.create({
        id: Snowflake.generate(),
        community: req.body.community,
        role: req.body.role,
        user: req.body.user,
      });
      res.json({ status: true, content: { data: new_member } });
    } catch (error) {
      console.log(error.message);
      res.status(500).send(error);
    }
  }
);

// removing a member
router.delete(
  "/:id",

  async (req, res) => {
    try {
      jwttoken=req.headers.authorization;
    TokenArray = jwttoken.split(" ");
    const token = TokenArray[1]
      // if token was recieved or not
      if (!token || TokenArray[0]!='Bearer') {
        return res.status(400).json({
          status: false,
          errors: [
            {
              message: "You need to sign in to proceed.",
              code: "NOT_SIGNEDIN",
            },
          ],
        });
      }

      let authdata = jwt.verify(token, JWT_SECRET);
      let id = authdata.user.id;
      let owner = await User.findOne({ id: id });
      // verify token
      if (!owner) {
        return res.status(400).json({
          status: false,
          errors: [
            {
              message: "You need to sign in to proceed.",
              code: "NOT_SIGNEDIN",
            },
          ],
        });
      }
      // fetch Community Admin role
      let idCommunityAdmin = await Role.findOne({ name: "Community Admin" });
      // fetch Community Moderator role
      let idCommunityModerator = await Role.findOne({
        name: "Community Moderator",
      });
      // check if user to be deleted exists
      let member = await Member.findOne({ id: req.params.id });
      if (!member) {
        return res.status(400).json({
          status: false,
          errors: [
            {
              message: "Member not found.",
              code: "RESOURCE_NOT_FOUND",
            },
          ],
        });
      }
      
      // check if current user ha Community Admin or Community Moderator role
      let ownership = await Member.find({
        $or: [
          {
            community: member.community,
            user: owner.id,
            role: idCommunityAdmin.id,
          },
          {
            community: member.community,
            user: owner.id,
            role: idCommunityModerator.id,
          },
        ],
      });
     
      if (ownership.length == 0) {
        return res.status(400).json({
          status: false,
          errors: [
            {
              message: "You are not authorized to perform this action.",
              code: "NOT_ALLOWED_ACCESS",
            },
          ],
        });
      }
      // delete member
      await Member.deleteOne({
        id: req.params.id,
      });
      res.json({ status: true });
    } catch (error) {
      console.log(error.message);
      res.status(500).send(error);
    }
  }
);

module.exports = router;
