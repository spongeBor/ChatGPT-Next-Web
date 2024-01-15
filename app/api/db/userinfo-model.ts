import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const model = mongoose.model("userinfo", userSchema, "userinfo");
export default model;
