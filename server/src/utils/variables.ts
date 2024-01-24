const { env } = process as { env: { [key: string]: string } };

export const {
  MONGO_URL,
  MAILTRAP_PASS,
  MAILTRAP_USER,
  VERIFICATION_EMAIL,
  PASSWORD_RESET_LINK,
  JWT_SECRET,
  CLOUD_NAME,
  CLOUD_KEY,
  CLOUD_SECRET,
} = env;
