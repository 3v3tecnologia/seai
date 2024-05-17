import { Either } from "../../../../shared/Either";

export interface ResetPasswordProtocol {
  execute(
    params: {
      code: string,
      password: string,
      confirmPassword: string
    }
  ): Promise<Either<Error, null>>;
}
