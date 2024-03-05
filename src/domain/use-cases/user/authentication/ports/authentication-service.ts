import { Either } from "../../../../../shared/Either";
import { AccountNotFoundError, WrongPasswordError } from "../errors";

export namespace AuthenticationDTO {
  export type params = { login: string; password: string };

  export type result = {
    accessToken: string;
    // accountId: number;
  };
}

export interface AuthenticationService {
  auth(
    params: AuthenticationDTO.params,
    test?: string
  ): Promise<
    Either<AccountNotFoundError | WrongPasswordError, AuthenticationDTO.result>
  >;
}
