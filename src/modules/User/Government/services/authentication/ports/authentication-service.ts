import { Either } from "../../../../../../shared/Either";
import { UserNotFoundError } from "../../../model/errors/user-not-found-error";
import { WrongPasswordError } from "../../../model/errors/wrong-password";

export namespace AuthenticationDTO {
  export type params = { login?: string; email?: string; password: string };

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
    Either<UserNotFoundError | WrongPasswordError, AuthenticationDTO.result>
  >;
}
