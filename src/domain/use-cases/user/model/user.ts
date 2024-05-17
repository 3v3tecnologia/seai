import { SystemModulesProps } from "../../../entities/user/user-modules-access";

export type User = {
  id: number;
  name: string;
  code: string;
  status: 'pending' | 'registered';
  login: string;
  email: string;
  type: string;
  createdAt?: string;
  password?: string;
  updatedAt?: string;
  modules?: SystemModulesProps | null
};
