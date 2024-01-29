import { AudioDocument } from "#/models/audio";
import { Model, ObjectId, Schema, model, models } from "mongoose";

interface FavoriteDocument {
  owner: ObjectId;
  items: ObjectId[];
}

const favoriteSchema = new Schema<FavoriteDocument>(
  {
    owner: {
      types: Schema.Types.ObjectId,
      ref: "User",
    },
    items: [{ types: Schema.Types.ObjectId, ref: "Audio" }],
  },
  { timestamps: true }
);

const Favorite = models.Favorite || model("Favorite", favoriteSchema);

export default Favorite as Model<FavoriteDocument>;
