import passwordResetToken from "#/models/passwordResetToken";
import { RequestHandler } from "express";
import { JwtPayload, verify } from "jsonwebtoken";
import User from "#/models/user";

const jwtSecret = "baiduuuu";

export const isValidPassResetToken: RequestHandler = async (req, res, next) => {
  const { token, userId } = req.body;

  const resetToken = await passwordResetToken.findOne({
    owner: userId,
  });
  if (!resetToken)
    return res
      .status(403)
      .json({ error: "Unauthorized access, Invalid token" });

  const matched = await resetToken.compareToken(token);
  if (!matched)
    return res
      .status(403)
      .json({ error: "Unauthorized access, Invalid token" });

  next();
};

export const mustAuth: RequestHandler = async (req, res, next) => {
  const { authorization } = req.headers;
  const token = authorization?.split("Bearer")[1];
  if (!token) return res.status(403).json({ error: "Unauthorized request!" });

  const payload = verify(token, jwtSecret) as JwtPayload;
  const id = payload.UserId;

  const user = await User.findOne({ _id: id, tokens: token });
  if (!user) return res.status(403).json({ error: "Unauthorized request!" });

  req.user = {
    id: user._id,
    name: user.name,
    email: user.email,
    verified: user.verified,
    avatar: user.avatar?.url,
    followers: user.followers.length,
    followings: user.followings.length,
  };
  req.token = token;
  next();
};

export const isVerified: RequestHandler = (req, res, next) => {
  if (!req.user.verified)
    return res.status(403).json({
      error: "Your account is not yet verified!",
    });
  next();
};
