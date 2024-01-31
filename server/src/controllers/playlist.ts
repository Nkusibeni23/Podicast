import { CreatePlayListRequest, updatePlaylistRequest } from "#/@types/audio";
import Audio from "#/models/audio";
import Playlist from "#/models/playlist";
import { RequestHandler } from "express";

export const createPlaylist: RequestHandler = async (
  req: CreatePlayListRequest,
  res
) => {
  const { title, resId, visibility } = req.body;
  const ownerId = req.user.id;

  // while creating playlist there can be request
  // or user just wants to create empty playlist.
  // with new playlist name and the audio that user wants to store inside the playlist

  if (resId) {
    const audio = await Audio.findById(resId);
    if (!audio)
      return res.status(404).json({
        error: "Could not found the audio!",
      });
  }
  const newPlaylist = new Playlist({
    title,
    owner: ownerId,
    visibility,
  });

  if (resId) newPlaylist.items = [resId as any];
  await newPlaylist.save();

  res.status(201).json({
    playlist: {
      id: newPlaylist._id,
      title: newPlaylist.title,
      visibility: newPlaylist.visibility,
    },
  });
};

export const updatePlaylist: RequestHandler = async (
  req: updatePlaylistRequest,
  res
) => {};
