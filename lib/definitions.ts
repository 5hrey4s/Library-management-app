import { User } from "next-auth";

export type TUser = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export interface IUser extends User {
  role: "admin" | "user";
}
