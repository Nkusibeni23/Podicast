import express from "express";

import "dotenv/config";
import "./db";
import authRouter from "./routers/auth";

const app = express();

// register our middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/auth", authRouter);
app.use(express.static("src/public"));

const PORT = process.env.PORT || 8989;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// * The Plan and features
// * Upload audio files
// * Listen to single audio
// * add to favorites
// * create playlist
// * remove playlist (public-private)
// * remove audios
// * may more
