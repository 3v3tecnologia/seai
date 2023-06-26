import { Either } from "../../../../shared/Either";
import { MailServiceError } from "../../errors/mail-service-error";
import { UserAlreadyExistsError } from "./errors/user-already-exists";

export interface CreateUserProtocol {
  create(
    user: CreateUserDTO.Params
  ): Promise<Either<UserAlreadyExistsError | MailServiceError, string>>;
}

export namespace CreateUserDTO {
  type system_modules_permissions = {
    news_manager: {
      read: boolean;
      write: boolean;
    };
    registers: {
      read: boolean;
      write: boolean;
    };
    users_manager: {
      read: boolean;
      write: boolean;
    };
  };

  export type Params = {
    email: string;
    type: "admin" | "basic";
    modules: system_modules_permissions;
  };

  export type Result = string;
}
