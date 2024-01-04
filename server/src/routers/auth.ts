import {
  create,
  generateForgetPasswordLink,
  isValidPassResetToken,
  sendReVerificationToken,
  verifyEmail,
} from "#/controllers/user";
import { validate } from "#/middleware/validate";

import {
  CreateUserSchema,
  //   EmailVerificationBody,
  TokenAndIdValidation,
} from "#/utils/validationSchema";
import { Router } from "express";

const router = Router();

router.post("/create", validate(CreateUserSchema), create);

router.post("/verify-email", validate(TokenAndIdValidation), verifyEmail);
router.post("/re-verify-email", sendReVerificationToken);
router.post("/forget-password", generateForgetPasswordLink);
router.post(
  "/verify-pass-reset-token",
  validate(TokenAndIdValidation),
  isValidPassResetToken
);

export default router;
