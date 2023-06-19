const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
dotenv.config({ path: "./../.env.local" });
const fs = require("fs");

//serving homepage.html
router.get(
  "/",

  async (req, res) => {
    try {
      fs.readFile("./homepage.html", "utf8", (err, data) => {
        if (err) {
          console.error(err);
          res.setHeader("Content-Type", "text/html");
          return res.status(400).json({
            msg: "some error Occurred. Kindly visit: https://github.com/Vinay-Singh-Chauhan/tif",
          });
        }
        return res.status(200).send(data);
      });
    } catch (error) {
      console.log(error.message);
      res.status(500).send(error);
    }
  }
);

module.exports = router;
