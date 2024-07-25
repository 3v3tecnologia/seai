import { SystemModulesProps } from "./user-modules-access";

export type UserAccount = {
  id: number;
  name: string;
  code: string;
  status: "pending" | "registered";
  login: string;
  email: string;
  type: string;
  password?: string;
  modules?: SystemModulesProps | null;
  updatedAt?: string;
  createdAt?: string;
};
