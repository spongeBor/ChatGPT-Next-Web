import mongoose from "mongoose";
import model from "./userinfo-model";

const options: mongoose.ConnectOptions = {
  dbName: "common",
  user: "spongeBor",
  pass: "123456",
  minPoolSize: 10,
};

const dbUrl = "mongodb://localhost:27017";

// 创建模型

async function connect() {
  try {
    const connection = await mongoose.connect(dbUrl, options);
    console.log("success connect db");
    return connection;
  } catch (err) {
    console.log(err);
  }
}

export async function getDocumentCount(filter: Record<string, any>) {
  try {
    const connection = await connect();
    if (!connection) return;
    const count = await model.countDocuments(filter).exec();
    return count;
  } catch (err) {
    console.log(err);
  }
}
