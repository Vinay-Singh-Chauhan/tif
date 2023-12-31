const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/user");
const dotenv = require("dotenv");
dotenv.config({ path: "./../.env.local" });
const { body, validationResult } = require("express-validator");
const { Snowflake } = require("@theinternetfolks/snowflake");
const JWT_SECRET = process.env.JWT_SECRET;

//creating a user
router.post(
  "/signup",
  // check whether inputs are correct
  body("name", "Name should be at least 2 characters.").isLength({ min: 2 }),
  body("email", "Please provide a valid email address.").isEmail(),
  body("password", "Password should be at least 2 characters.").isLength({
    min: 6,
  }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorRes = [];
      errors.array().map((e) => {
        errorRes.push({ param: e.path, message: e.msg, code: "INVALID_INPUT" });
      });
      return res.status(400).json({ status: false, errors: errorRes });
    }
    try {
      //checking unique email condition
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({
          status: false,
          errors: [
            {
              param: "email",
              message: "User with this email address already exists.",
              code: "RESOURCE_EXISTS",
            },
          ],
        });
      }
      //salt and hashing to secure password
      let salt = await bcrypt.genSalt(10);

      let secPass = await bcrypt.hash(req.body.password, salt);
      //create user
      user = await User.create({
        id: Snowflake.generate(),
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);

      res.json({
        status: true,
        content: { data: user },
        meta: { access_token: authToken },
      });
    } catch (error) {
      console.log(error.message);
      res.status(500).send(error);
    }
  }
);

//logging in a user
router.post(
  "/signin",
  // check whether inputs are correct
  body("email", "Please provide a valid email address.").isEmail(),
  body("password", "Enter Password").exists(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorRes = [];
      errors.array().map((e) => {
        errorRes.push({ param: e.path, message: e.msg, code: "INVALID_INPUT" });
      });
      return res.status(400).json({ status: false, errors: errorRes });
    }
    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({
          status: false,
          errors: [
            {
              param: "password",
              message: "The credentials you provided are invalid.",
              code: "INVALID_CREDENTIALS",
            },
          ],
        });
      }
      // compare passwords
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res.status(400).json({
          status: false,
          errors: [
            {
              param: "password",
              message: "The credentials you provided are invalid.",
              code: "INVALID_CREDENTIALS",
            },
          ],
        });
      }
      //  data to store in JWT
      const data = {
        user: {
          id: user.id,
        },
      };
      // sign in JWT
      const authToken = jwt.sign(data, JWT_SECRET);

      const response = {
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at,
      };
      return res.json({
        status: true,
        content: { data: response },
        meta: { access_token: authToken },
      });
    } catch (error) {
      console.log(error.message);
      res.status(500).send("internal error");
    }
  }
);

// get me
router.get(
  "/me",

  async (req, res) => {
    jwttoken=req.headers.authorization;
    if (!jwttoken) {
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
    TokenArray = jwttoken.split(" ");
    const token = TokenArray[1]
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
    try {
      // getting user from token
      let authdata = jwt.verify(token, JWT_SECRET);
      let id = authdata.user.id;

      let user = await User.findOne({ id });
      if (!user) {
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

      const response = {
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at,
      };
      return res
        .status(200)
        .json({ status: true, content: { data: response } });
    } catch (error) {
      console.log(error.message);
      return res.status(500).send("internal error");
    }
  }
);
module.exports = router;
