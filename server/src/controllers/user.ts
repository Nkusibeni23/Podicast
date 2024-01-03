import { CreateUser } from "#/@types/user";
import { RequestHandler } from "express";
import path from "path";
import User from "#/models/user";
import nodemailer from "nodemailer";
import { MAILTRAP_PASS, MAILTRAP_USER } from "#/utils/variables";
import { generateToken } from "#/utils/helper";
import EmailVerificationToken from "#/models/emailVerificationToken";
import { generateTemplate } from "#/mail/template";

export const create: RequestHandler = async (req: CreateUser, res) => {
  const { email, password, name } = req.body;

  const user = await User.create({ name, email, password });

  //   send verification email
  //   const transport = nodemailer.createTransport({
  //     host: "sandbox.smtp.mailtrap.io",
  //     port: 2525,
  //     auth: {
  //       user: MAILTRAP_USER,
  //       pass: MAILTRAP_PASS,
  //     },
  //   });

  const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "3d10d743c7722a",
      pass: "a35ad182a8a5e2",
      method: "PLAIN",
    },
  });

  const token = generateToken();
  await EmailVerificationToken.create({
    owner: user._id,
    token,
  });

  const welcomeMessage = `Hi ${name}, Welcome to Podify! There are so much thing that we do for verified users. Use the given OTP to verify your email.`;

  try {
    transport.sendMail({
      to: user.email,
      from: "auth@gmail.com",
      subject: `Please verify your account`,
      html: generateTemplate({
        title: "Welcome to Podify",
        message: welcomeMessage,
        logo: "cid:logo",
        banner: "cid:Welcome",
        link: "#",
        btnTitle: token,
      }),
      attachments: [
        {
          filename: "logo.png",
          path: path.join(__dirname, "../mail/logo.png"),
          cid: "logo",
        },
        {
          filename: "welcome.png",
          path: path.join(__dirname, "../mail/welcome.png"),
          cid: "welcome",
        },
      ],
    });
    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
  }

  res.status(201).json({ user });
};
