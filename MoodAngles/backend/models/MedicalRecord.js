import mongoose from "mongoose";
const schema = new mongoose.Schema({
  userId: String,
  narrative: String,
  date: { type: Date, default: Date.now }
});
export default mongoose.model("MedicalRecord", schema);