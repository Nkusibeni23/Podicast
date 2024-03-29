import { CreateUser, VerifyEmailRequest } from "#/@types/user";
import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import User from "#/models/user";
import bcrypt from "bcrypt";
import { formatProfile, generateToken } from "#/utils/helper";
import {
  sendForgetPasswordLink,
  sendSuccessfulUpdateEmail,
  sendVerificationMail,
} from "#/utils/mail";
import EmailVerificationToken from "#/models/emailVerificationToken";
import { isValidObjectId } from "mongoose";
import PasswordResetToken from "#/models/passwordResetToken";
import crypto from "crypto";
import { RequestWithFiles } from "#/middleware/fileParser";
import cloudinary from "#/cloud";
import formidable from "formidable";
import { profile } from "console";

const jwtSecret = "baiduuuu";

export const create: RequestHandler = async (req: CreateUser, res) => {
  const { email, password, name } = req.body;

  const user = await User.create({ name, email, password });

  //   send verification email
  const token = generateToken();
  await EmailVerificationToken.create({
    owner: user._id,
    token,
  });

  sendVerificationMail(token, { name, email, userId: user._id.toString() });

  res.status(201).json({ user: { id: user._id, name, email } });
};

export const verifyEmail: RequestHandler = async (
  req: VerifyEmailRequest,
  res
) => {
  const { token, userId } = req.body;

  const verificationToken = await EmailVerificationToken.findOne({
    owner: userId,
  });

  if (!verificationToken)
    return res.status(403).json({ error: "Invalid token!" });

  const matched = await verificationToken?.compareToken(token);
  if (!matched) return res.status(403).json({ error: "Invalid token!" });

  await User.findByIdAndUpdate(userId, {
    verified: true,
  });
  await EmailVerificationToken.findByIdAndDelete(verificationToken._id);

  res.json({ message: "Your Email is verified." });
};

export const sendReVerificationToken: RequestHandler = async (req, res) => {
  const { userId } = req.body;

  if (!isValidObjectId(userId))
    return res.status(403).json({ error: "Invalid Request!" });

  const user = await User.findById(userId);
  if (!user) return res.status(403).json({ error: "Invalid Request!" });

  await EmailVerificationToken.findOneAndDelete({
    owner: userId,
  });
  const token = generateToken();

  await EmailVerificationToken.create({
    owner: userId,
    token,
  });

  sendVerificationMail(token, {
    name: user?.name,
    email: user?.email,
    userId: user?._id.toString(),
  });
  res.json({ message: "Please Check your email!" });
};

export const generateForgetPasswordLink: RequestHandler = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: "Account not found!!" });

  // generate the link
  // https://yourapp.com/reset-password?token=hakfaka22ldaflvah&userId=67kfkjgsnms

  await PasswordResetToken.findOneAndDelete({
    owner: user._id,
  });

  const token = crypto.randomBytes(36).toString("hex");

  await PasswordResetToken.create({
    owner: user._id,
    token,
  });
  const resetLink = `http://localhost:8989/reset-password.html?token=${token}&userId=${user._id}`;

  sendForgetPasswordLink({
    email: user.email,
    link: resetLink,
  });

  res.json({ message: "Check your registered email!" });
};

export const grantValid: RequestHandler = async (req, res) => {
  res.json({
    valid: true,
  });
};

export const updatePassword: RequestHandler = async (req, res) => {
  const { password, userId } = req.body;

  const user = await User.findById(userId);
  if (!user) return res.status(403).json({ error: "Unauthorized access!" });

  const matched = await user.comparePassword(password);
  if (matched)
    return res
      .status(422)
      .json({ error: "The New password must be different!" });

  user.password = password;
  await user.save();

  await PasswordResetToken.findOneAndDelete({ owner: user._id });
  //  send the success email
  sendSuccessfulUpdateEmail(user.name, user.email);
  res.json({ message: "Password resets successfully." });
};

export const signIn: RequestHandler = async (req, res) => {
  const { password, email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(403).json({
      error: "User not found!",
    });
  }

  // compare the password
  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    return res.status(403).json({
      error: "Incorrect password!",
    });
  }

  // generate the token for later use
  const token = jwt.sign({ userId: user._id }, jwtSecret);
  user.token.push(token);

  await user.save();

  res.json({
    profile: {
      id: user._id,
      name: user.name,
      email: user.email,
      verified: user.verified,
      avatar: user.avatar?.url,
      followers: user.followers.length,
      followings: user.followings.length,
    },
    token,
  });
};

export const updateProfile: RequestHandler = async (
  req: RequestWithFiles,
  res
) => {
  const { name } = req.body;
  const avatar = req.files?.avatar as formidable.File;

  const user = await User.findById(req.user.id);
  if (!user) throw new Error("Something went wrong, user not found");

  if (typeof name !== "string")
    return res.status(422).json({ error: "Invalid name!" });

  user.name = name;

  if (avatar) {
    // if there is already an avatar file, we want to remove that
    if (user.avatar?.publicId) {
      await cloudinary.uploader.destroy(user.avatar?.publicId);
    }
    // upload new avatar file
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      avatar.filepath,
      {
        width: 300,
        height: 300,
        crop: "thumb",
        gravity: "face",
      }
    );

    user.avatar = { url: secure_url, publicId: public_id };
  }
  await user.save();

  res.json({ profile: formatProfile(user) });
  // req.user.id;
};

export const sendProfile: RequestHandler = (req, res) => {
  res.json({ profile: req.user });
};

export const logOut: RequestHandler = async (req, res) => {
  const { fromAll } = req.query;

  const token = req.token;
  const user = await User.findById(req.user.id);
  if (!user) throw new Error("Something went, user not found!");

  // logout from all
  if (fromAll === "yes") user.tokens = [];
  else user.tokens = user.tokens.filter((t) => t !== token);

  await user.save();
  res.json({ success: true });
};
