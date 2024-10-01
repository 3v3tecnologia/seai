import { UserStatus } from "../../../core/model/status";

export type RegisteredUser = {
  id: number;
  name: string;
  code: string;
  status: UserStatus;
  password: string;
};

export interface IGetRegisteredUserRepository {
  getRegisteredUserByEmail(
    email: string,
  ): Promise<RegisteredUser | null>;
  getRegisteredUserByLogin(
    login: string,
  ): Promise<RegisteredUser | null>;
}
