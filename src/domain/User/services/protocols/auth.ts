import { Either } from "../../../../shared/Either";
import { UserStatus } from "../../core/model/status";

export type AccountData = {
  id: number;
  name: string;
  code: string;
  status: UserStatus;
  password: string;
  type?: string
};

export type AuthServiceInput = {
  login: string;
  password: string;
  type?: string
}

export type AuthServiceOutput = Either<
  Error,
  {
    accessToken: string;
  }
>

export interface IAuthService {
  auth(user: AuthServiceInput): Promise<AuthServiceOutput>
}
