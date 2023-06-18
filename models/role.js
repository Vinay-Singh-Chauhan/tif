const mongoose = require("mongoose");
const { Schema } = mongoose;

const roleSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, maxLength: 64,unique:true, required: true },
    scopes: [{ type: String }],
    created_at: { type: Date, default: Date.now() },
    updated_at: { type: Date, default: Date.now() },
  }
);

mongoose.models = {};
module.exports = mongoose.model("Role", roleSchema);
