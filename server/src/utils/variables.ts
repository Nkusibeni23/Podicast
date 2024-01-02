const { env } = process as { env: { [key: string]: string } };

export const MONGO_URL = env.MONGO_URL as string;
