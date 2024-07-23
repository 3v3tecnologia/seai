import { SystemModulesProps } from "../../model/user-modules-access";

export type UserData = {
  id: number;
  name: string;
  code: string;
  status: "pending" | "registered";
  login: string;
  email: string;
  type: string;
  createdAt?: string;
  password?: string;
  updatedAt?: string;
  modules?: SystemModulesProps | null;
};
