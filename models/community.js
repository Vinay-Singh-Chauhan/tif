const mongoose = require("mongoose");
// import { Snowflake } from "@theinternetfolks/snowflake";

// console.log(Snowflake.generate({ timestamp: 1649157035498, shard_id: 4 }));
const { Schema } = mongoose;

const communitySchema = new Schema(
  {
    id: { type: String, required: true },
    name: { type: String, maxLength: 128, required: true },
    slug: { type: String, maxLength: 255, unique: true, required: true },
    owner: { type: String, required: true },
    created_at: { type: Date, default: Date.now() },
    updated_at: { type: Date, default: Date.now() },
  },
  
);
mongoose.models = {};
module.exports = mongoose.model("Community", communitySchema);
