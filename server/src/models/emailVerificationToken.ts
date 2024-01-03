// interface (typescript)

import { Model, ObjectId, Schema, model } from "mongoose";
import { create } from "../controllers/user";

interface EmailVerificationTokenDocument {
  owner: ObjectId;
  token: string;
  createAt: Date;
}
//  expire them after 1 hrs

const emailVerificationTokenSchema = new Schema<EmailVerificationTokenDocument>(
  {
    owner: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    token: {
      type: String,
      required: true,
    },
    createAt: {
      type: Date,
      default: Date.now(),
      expires: 3600, //60 min * 60 sec = 3600sec
    },
  }
);

export default model(
  "EmailVerificationToken",
  emailVerificationTokenSchema
) as Model<EmailVerificationTokenDocument>;
