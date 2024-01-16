import mongoose, { connection } from "mongoose";
import { getUserinfoModel } from "./util";

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
    const count = await getUserinfoModel().countDocuments(filter).exec();
    return count;
  } catch (err) {
    console.log(err);
  }
}

export async function getDocument(filter: Record<string, any>) {
  try {
    const connection = await connect();
    if (!connection) return;
    const document = await getUserinfoModel().findOne(filter).exec();
    return document;
  } catch (err) {
    console.log(err);
  }
}
