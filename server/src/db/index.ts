import mongoose from "mongoose";
import { MONGO_URL } from "#/utils/variables";

// const URL = process.env.MONGO_URL as string;

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("db is connected");
  })
  .catch((err) => {
    console.error("failed to connect db", err);
  });
