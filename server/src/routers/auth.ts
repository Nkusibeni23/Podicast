import { CreateUser } from "#/@types/user";
import { validate } from "#/middleware/validate";
import User from "#/models/user";
import { CreateUserSchema } from "#/utils/validationSchema";
import { Router } from "express";

const router = Router();

router.post(
  "/create",
  validate(CreateUserSchema),
  async (req: CreateUser, res) => {
    const { email, password, name } = req.body;
    CreateUserSchema.validate({ email, password, name }).catch((error) => {
      return res.status(400).json({ message: error.message });
    });
    //   const user = new User({ email, password, name });
    //   newUser.save()

    const user = await User.create({ name, email, password });
    res.json({ user });
  }
);

export default router;
