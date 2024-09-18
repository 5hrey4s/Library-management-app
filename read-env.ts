export interface AppEnv {
  DATABASE_URL: string;
  JWT_SECRET: string;
  REFRESH_SECRET: string;
  AUTH_GOOGLE_ID: string;
  AUTH_GOOGLE_SECRET: string;
  NEXTAUTH_URL: string;
  NEXTAUTH_URL_INTERNAL: string;
  NEXTAUTH_SECRET: string;
  AUTH_SECRET: string;
  POSTGRES_URL: string;
  POSTGRES_PRISMA_URL: string;
  POSTGRES_URL_NO_SSL: string;
  POSTGRES_URL_NON_POOLING: string;
  POSTGRES_USER: string;
  POSTGRES_HOST: string;
  POSTGRES_PASSWORD: string;
  POSTGRES_DATABASE: string;
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;
  CLOUDINARY_URL: string;
}

export const Appenv = process.env as unknown as AppEnv;
