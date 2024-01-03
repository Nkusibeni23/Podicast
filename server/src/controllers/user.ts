import { CreateUser } from "#/@types/user";
import { RequestHandler } from "express";
import User from "#/models/user";
import nodemailer from "nodemailer";
import { MAILTRAP_PASS, MAILTRAP_USER } from "#/utils/variables";

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

  try {
    transport.sendMail({
      to: user.email,
      from: "auth@gmail.com",
      html: "<h1>Hello World!!</h1>",
    });
    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
  }

  res.status(201).json({ user });
};
