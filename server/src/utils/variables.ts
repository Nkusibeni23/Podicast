const { env } = process as { env: { [key: string]: string } };

export const { MONGO_URL, MAILTRAP_PASS, MAILTRAP_USER, VERIFICATION_EMAIL } =
  env;
