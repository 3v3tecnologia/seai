import { Either } from "../../../../shared/Either";
import { FailToDeleteUserError } from "./errors/fail-to-delete-user-error";
import { UserNotFoundError } from "./errors/user-not-found-error";

export interface DeleteUserProtocol {
  execute(
    user_id: number
  ): Promise<Either<UserNotFoundError | FailToDeleteUserError, string>>;
}
