import mongoose from "mongoose";
const schema = new mongoose.Schema({
  userId: String,
  responses: Object
});
export default mongoose.model("ScaleResponse", schema);