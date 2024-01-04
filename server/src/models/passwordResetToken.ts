// interface (typescript)
import { Model, ObjectId, Schema, model } from "mongoose";
import { hash, compare } from "bcrypt";
import { create } from "../controllers/user";

interface passwordResetTokenDocument {
  owner: ObjectId;
  token: string;
  createAt: Date;
}

interface Methods {
  compareToken(token: string): Promise<boolean>;
}

//  expire them after 1 hrs

const passwordResetTokenSchema = new Schema<
  passwordResetTokenDocument,
  {},
  Methods
>({
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
});

passwordResetTokenSchema.pre("save", async function (next) {
  // hash the token
  if (this.isModified("token")) {
    this.token = await hash(this.token, 10);
  }

  next();
});

passwordResetTokenSchema.methods.compareToken = async function (token) {
  const result = await compare(token, this.token);
  return result;
};

export default model("passwordResetToken", passwordResetTokenSchema) as Model<
  passwordResetTokenDocument,
  {},
  Methods
>;
