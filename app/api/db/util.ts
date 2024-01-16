import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

export function getModel(name: string, schema?: mongoose.Schema) {
  let model: typeof mongoose.Model;
  if (mongoose.models[name]) {
    model = mongoose.models[name];
  } else {
    model = mongoose.model(name, schema, name);
  }
  return model;
}

export function getUserinfoModel() {
  return getModel("userinfo", userSchema);
}
