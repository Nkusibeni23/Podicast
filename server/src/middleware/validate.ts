import { RequestHandler } from "express";
import * as yup from "yup";

export const validate = (schema: any): RequestHandler => {
  return async (req, res, next) => {
    if (!req.body)
      return res.status(422).json({ error: "Empty body is not excepted!" });
    const schemaToValidate = yup.object({
      body: schema,
    });
    try {
      await schemaToValidate.validate(
        {
          body: req.body,
        },
        {
          abortEarly: true, // This will ensure that all validation errors are returned at once instead of stopping on the first one encountered.
        }
      );
      next();
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        return res.status(422).json({ error: error.message });
      }
    }
  };
};
