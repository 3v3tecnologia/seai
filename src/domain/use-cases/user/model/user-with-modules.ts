import { SystemModulesProps } from "../../../entities/user/user-modules-access";

export type UserAccount = {
  id?: number;
  name?: string;
  login?: string;
  email: string;
  type: string;
  password?: string;
  modules?: SystemModulesProps | null;
  updatedAt?: string;
  createdAt?: string;
};
