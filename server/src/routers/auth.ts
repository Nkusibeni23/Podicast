import {
  create,
  generateForgetPasswordLink,
  grantValid,
  sendReVerificationToken,
  signIn,
  updatePassword,
  verifyEmail,
} from "#/controllers/user";
import { isValidPassResetToken, mustAuth } from "#/middleware/auth";
import { validate } from "#/middleware/validate";
import User from "#/models/user";

import {
  CreateUserSchema,
  SignInValidationSchema,
  //   EmailVerificationBody,
  TokenAndIdValidation,
  UpdatePasswordSchema,
} from "#/utils/validationSchema";
import { Router } from "express";
import fileParser, { RequestWithFiles } from "#/middleware/fileParser";
import { JwtPayload, verify } from "jsonwebtoken";
// const jwtSecret = "baiduuuu";

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

router.get("/is-auth", mustAuth, (req, res) => {
  res.json({
    profile: req.user,
  });
});

router.get("/public", (req, res) => {
  res.json({
    message: "You are in Public route.",
  });
});

router.get("/private", mustAuth, (req, res) => {
  res.json({
    message: "You are in Private route.",
  });
});

// router.post("/update-profile", async (req, res) => {
//   // if (!req.headers["content-type"]?.startsWith("multipart/form-data;"))
//   //   return res.status(422).json({ error: "Only accept form-data!" });
//   const dir = path.join(__dirname, "../public/profile");
//   try {
//     await fs.readdirSync(dir);
//   } catch (error) {
//     await fs.mkdirSync(dir);
//   }

//   // handle the file upload
//   const form = formidable({
//     uploadDir: dir,
//     filename(name, ext, part, form) {
//       return Date.now() + "_" + part.originalFilename;
//     },
//   });
//   form.parse(req, (err, fields, files) => {
//     res.json({
//       uploaded: true,
//     });
//   });
// });

router.post("/update-profile", fileParser, (req: RequestWithFiles, res) => {
  console.log(req.files);
  res.json({ ok: true });
});

export default router;
