const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    id: { type: String, required: true },
    name: { type: String, minLength: 2, maxLength: 64, required: true },
    email: { type: String, maxLength: 128, required: true,unique:true },
    password: { type: String, minLength: 6, maxLength: 64, required: true },
    created_at: { type: Date, default: Date.now() },
    updated_at: { type: Date, default: Date.now() },
  }
);
mongoose.models = {};
module.exports = mongoose.model("User", userSchema);
