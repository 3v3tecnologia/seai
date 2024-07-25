import { MailServiceError } from "../../../../../domain/use-cases/errors/mail-service-error";
import { Either } from "../../../../../shared/Either";
import { UserType } from "../../model/user";
import { SystemModulesProps } from "../../model/user-modules-access";
import { UserAlreadyExistsError } from "../../model/errors/user-already-exists";

export interface CreateUserProtocol {
  create(
    user: CreateUserDTO.Params
  ): Promise<Either<UserAlreadyExistsError | MailServiceError, string>>;
}
export namespace CreateUserDTO {
  type system_modules_permissions = SystemModulesProps;

  export type Params = {
    email: string;
    type: UserType;
    modules: system_modules_permissions;
  };

  export type Result = string;
}
