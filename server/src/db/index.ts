import mongoose from "mongoose";

const URL = process.env.MONGO_URL as string;

mongoose
  .connect(URL)
  .then(() => {
    console.log("db is connected");
  })
  .catch((err) => {
    console.error("failed to connect db", err);
  });
