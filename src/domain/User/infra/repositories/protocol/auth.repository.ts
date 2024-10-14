import { AccountData } from "../../../services/protocols/auth";

export interface IAuthRepository {
  getByEmail(
    email: string,
    type?: string
  ): Promise<AccountData | null>;
  getByLogin(
    login: string,
    type?: string
  ): Promise<AccountData | null>;
}
