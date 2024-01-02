import express from "express";

const app = express();

const PORT = 8000;
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
