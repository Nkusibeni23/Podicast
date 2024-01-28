import * as yup from "yup";
import { isValidObjectId } from "mongoose";
import EmailVerificationToken from "#/models/emailVerificationToken";
import { categories } from "./audio_category";

export const CreateUserSchema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .required("Name is missing")
    .min(3, "Name is too short!")
    .max(30, "Name is too long!"),
  email: yup.string().required("Email is missing").email("Invalid Email id!"),
  password: yup
    .string()
    .trim()
    .required("Password is missing!")
    .min(8, "Password is too short!")
    .matches(
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#\$%\^&\*]).{8,}$/,
      "Password must contain the following: a letter, a number and a special character"
    ),
});

export const TokenAndIdValidation = yup.object().shape({
  token: yup.string().trim().required("Invalid Token!"),
  userId: yup
    .string()
    .transform(function (value) {
      if (this.isType(value) && isValidObjectId(value)) {
        return value;
      }
      return "";
    })
    .required("Invalid UserId"),
});

export const UpdatePasswordSchema = yup.object().shape({
  token: yup.string().trim().required("Invalid Token!"),
  userId: yup
    .string()
    .transform(function (value) {
      if (this.isType(value) && isValidObjectId(value)) {
        return value;
      }
      return "";
    })
    .required("Invalid UserId"),
  password: yup
    .string()
    .trim()
    .required("Password is missing!")
    .min(8, "Password is too short!")
    .matches(
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#\$%\^&\*]).{8,}$/,
      "Password must contain the following: a letter, a number and a special character"
    ),
});

export const SignInValidationSchema = yup.object().shape({
  email: yup.string().required("Email is missing!").email("Invalid email id"),
  password: yup.string().trim().required("Password is missing!"),
});

export const AudioValidationSchema = yup.object().shape({
  title: yup.string().required("Title is missing!"),
  about: yup.string().required("About is missing!"),
  password: yup
    .string()
    .trim()
    .oneOf(categories, "Invalid category!")
    .required("Category is missing!"),
});
