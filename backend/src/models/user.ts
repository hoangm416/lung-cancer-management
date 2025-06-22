import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, require: true },
  name: { type: String },
  phone: { type: String },
  idcard: { type: String },
  job: { type: String },
  role: { type: String, default: "user" } 
});

const User = mongoose.model("User", userSchema);
export default User;