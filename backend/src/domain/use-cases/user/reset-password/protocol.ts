import { Either } from "../../../../shared/Either";

export interface ResetPasswordProtocol {
  execute(access_token: string, password: string): Promise<Either<Error, null>>;
}
