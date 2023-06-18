const mongoose = require("mongoose");
const { Schema } = mongoose;

const memberSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    community: { type: String, required: true },
    user: { type: String, required: true },
    role: { type: String, required: true },
    created_at: { type: Date, default: Date.now() },
  }
);
mongoose.models = {};
module.exports = mongoose.model("Member", memberSchema);
