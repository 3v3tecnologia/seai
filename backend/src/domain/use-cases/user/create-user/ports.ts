import { Either } from "../../../../shared/Either";
import {
  PermissionType,
  SystemModulesProps,
} from "../../../entities/user/user-modules-access";
import { MailServiceError } from "../../errors/mail-service-error";
import { UserAlreadyExistsError } from "./errors/user-already-exists";

export interface CreateUserProtocol {
  create(
    user: CreateUserDTO.Params
  ): Promise<Either<UserAlreadyExistsError | MailServiceError, string>>;
}
export namespace CreateUserDTO {
  type system_modules_permissions = SystemModulesProps;

  export type Params = {
    email: string;
    type: PermissionType;
    modules: system_modules_permissions;
  };

  export type Result = string;
}
