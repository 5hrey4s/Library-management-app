export interface AppEnv {
  DATABASE_URL: string;
  JWT_SECRET: string;
  REFRESH_SECRET: string;
  AUTH_GOOGLE_ID: string;
  AUTH_GOOGLE_SECRET: string;
  NEXTAUTH_URL: string;
  NEXTAUTH_URL_INTERNAL: string;
  NEXTAUTH_SECRET: string;
  AUTH_SECRET:string
}

export const Appenv = process.env as unknown as AppEnv;
