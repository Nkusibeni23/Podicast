import { RequestHandler } from "express";
import { isValidObjectId } from "mongoose";
import Audio from "#/models/audio";
import Favorite from "#/models/favorite";

export const toggleFavorite: RequestHandler = async (req, res) => {
  const audioId = req.query.audioId as string;
  let status: "added" | "removed";

  if (isValidObjectId(audioId))
    return res.status(422).json({ error: "Audio Id is Invalid" });

  const audio = await Audio.findById(audioId);
  if (!audio) return res.status(404).json({ error: "Resource not found!" });

  // audio is already in fav
  const alreadyExist = await Favorite.findOne({
    owner: req.user.id,
    items: audioId,
  });

  if (alreadyExist) {
    //i want to remove from old list
    await Favorite.updateOne(
      { owner: req.user.id },
      {
        $pull: { items: audioId },
      }
    );
    status = "removed";
  } else {
    const favorite = await Favorite.findOne({ owner: req.user.id });
    if (favorite) {
      // trying to create fresh fav list
      await Favorite.updateOne(
        { owner: req.user.id },
        {
          $addToSet: { items: audioId },
        }
      );
    } else {
      // trying to add new audio to the old list
      await Favorite.create({ owner: req.user.id, items: [audioId] });
    }
    status = "added";
  }
  res
    .status(201)
    .json({ message: `Audio has been ${status} to your favorites!` });
};
