import path from "path";
import User from "#/models/user";
import nodemailer from "nodemailer";
import {
  MAILTRAP_PASS,
  MAILTRAP_USER,
  VERIFICATION_EMAIL,
} from "#/utils/variables";
import { generateToken } from "#/utils/helper";
import EmailVerificationToken from "#/models/emailVerificationToken";
import { generateTemplate } from "#/mail/template";

const generateMailTransporter = () => {
  const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "3d10d743c7722a",
      pass: "a35ad182a8a5e2",
      method: "PLAIN",
    },
  });
  return transport;
};

interface Profile {
  name: string;
  email: string;
  userId: string;
}

export const sendVerificationMail = async (token: string, profile: Profile) => {
  const transport = generateMailTransporter();
  const { name, email, userId } = profile;

  //   const token = generateToken();

  const welcomeMessage = `Hi ${name}, Welcome to Podify! There are so much thing that we do for verified users. Use the given OTP to verify your email.`;

  try {
    transport.sendMail({
      to: email,
      from: "myapp@gmail.com",
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
};

interface Options {
  email: string;
  link: string;
}

export const sendForgetPasswordLink = async (options: Options) => {
  const transport = generateMailTransporter();
  const { email, link } = options;

  //   const token = generateToken();

  const message =
    " We just received a request that you forgot your password.No problem you can use the link below and create brand new password.";

  try {
    transport.sendMail({
      to: email,
      from: "myapp@gmail.com",
      subject: "Reset Password Link",
      html: generateTemplate({
        title: "Forget Password",
        message,
        logo: "cid:logo",
        banner: "cid:forget_password",
        link,
        btnTitle: "Reset Password",
      }),
      attachments: [
        {
          filename: "logo.png",
          path: path.join(__dirname, "../mail/logo.png"),
          cid: "logo",
        },
        {
          filename: "password_reset.png",
          path: path.join(__dirname, "../mail/password_reset.png"),
          cid: "forget_password",
        },
      ],
    });
    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export const sendSuccessfulUpdateEmail = async (
  name: string,
  email: string
) => {
  const transport = generateMailTransporter();

  //   const token = generateToken();

  const message = `Dear ${name} we just updated your new password. you can now sign in with your new password.`;

  try {
    transport.sendMail({
      to: email,
      from: "myapp@gmail.com",
      subject: "Password Reset Successfully",
      html: generateTemplate({
        title: "Password Reset Successfully",
        message,
        logo: "cid:logo",
        banner: "cid:forget_password",
        link: "https://yourapp.com/sign-in",
        btnTitle: "Log in",
      }),
      attachments: [
        {
          filename: "logo.png",
          path: path.join(__dirname, "../mail/logo.png"),
          cid: "logo",
        },
        {
          filename: "password_reset.png",
          path: path.join(__dirname, "../mail/password_reset.png"),
          cid: "forget_password",
        },
      ],
    });
    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
