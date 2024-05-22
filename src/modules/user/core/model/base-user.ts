import { SystemModulesProps } from "./user-modules-access";

export type BaseUserModel = {
  id?: number;
  name?: string;
  login?: string;
  code?: string;
  email?: string;
  status?: 'pending' | 'registered';
  type: string;
  password?: string;
  updatedAt?: string;
  createdAt?: string;
  modules?: SystemModulesProps | null
};
