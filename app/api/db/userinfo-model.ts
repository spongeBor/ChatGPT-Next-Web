import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});
let model: typeof mongoose.Model;
if (mongoose.models.userinfo) {
  // 如果模型已经存在，使用已有的模型
  model = mongoose.model("userinfo");
} else {
  // 如果模型不存在，创建新的模型
  model = mongoose.model("userinfo", userSchema, "userinfo");
}

export default model;
