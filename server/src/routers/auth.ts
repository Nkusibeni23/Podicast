import {
  create,
  generateForgetPasswordLink,
  grantValid,
  sendReVerificationToken,
  signIn,
  updatePassword,
  verifyEmail,
} from "#/controllers/user";
import { isValidPassResetToken } from "#/middleware/auth";
import { validate } from "#/middleware/validate";
import User from "#/models/user";

import {
  CreateUserSchema,
  SignInValidationSchema,
  //   EmailVerificationBody,
  TokenAndIdValidation,
  UpdatePasswordSchema,
} from "#/utils/validationSchema";
import { JWT_SECRET } from "#/utils/variables";
import { Router } from "express";
import { JwtPayload, verify } from "jsonwebtoken";

const jwtSecret = "baiduuuu";

const router = Router();

router.post("/create", validate(CreateUserSchema), create);

router.post("/verify-email", validate(TokenAndIdValidation), verifyEmail);
router.post("/re-verify-email", sendReVerificationToken);
router.post("/forget-password", generateForgetPasswordLink);
router.post(
  "/verify-pass-reset-token",
  validate(TokenAndIdValidation),
  isValidPassResetToken,
  grantValid
);
router.post(
  "/update-password",
  validate(UpdatePasswordSchema),
  isValidPassResetToken,
  updatePassword
);

router.post("/sign-in", validate(SignInValidationSchema), signIn);

router.get("/is-auth", async (req, res) => {
  const { authorization } = req.headers;
  const token = authorization?.split("Bearer")[1];
  if (!token) return res.status(403).json({ error: "Unauthorized request!" });

  const payload = verify(token, jwtSecret) as JwtPayload;
  const id = payload.UserId;

  const user = await User.findById(id);
  if (!user) return res.status(403).json({ error: "Unauthorized request!" });

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
  });
});

export default router;
