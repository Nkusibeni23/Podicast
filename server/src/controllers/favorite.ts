import { RequestHandler } from "express";
import { ObjectId, isValidObjectId } from "mongoose";
import Audio, { AudioDocument } from "#/models/audio";
import Favorite from "#/models/favorite";
import { error } from "console";

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

  if (status === "added") {
    await Audio.findByIdAndUpdate(audioId, {
      $addToSet: { likes: req.user.id },
    });
  }

  if (status === "removed") {
    await Audio.findByIdAndUpdate(audioId, {
      $pull: { likes: req.user.id },
    });
  }

  res
    .status(201)
    .json({ message: `Audio has been ${status} to your favorites!` });
};

export const getFavorite: RequestHandler = async (req, res) => {
  const userID = req.user.id;

  const favorite = await Favorite.findOne({ owner: userID }).populate<{
    items: AudioDocument<{ _id: ObjectId; name: string }>[];
  }>({
    path: "items",
    populate: {
      path: "owner",
    },
  });
  if (!favorite) return res.json({ audios: [] });
  const audios = favorite?.items.map((item) => {
    return {
      id: item._id,
      title: item.title,
      category: item.category,
      file: item.file.url,
      poster: item.poster?.url,
      owner: { name: item.owner.name, id: item.owner._id },
    };
  });
  res.json({ audios });
};

export const getIsFavorite: RequestHandler = async (req, res) => {
  const audioId = req.query.audioId as string;

  if (!isValidObjectId(audioId))
    return res.status(422).json({
      error: "Invalid audio id!",
    });

  const favorite = await Favorite.findOne({
    owner: req.user.id,
    items: audioId,
  });

  res.json({ result: favorite ? true : false });
};
