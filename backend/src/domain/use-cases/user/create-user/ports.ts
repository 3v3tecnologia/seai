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
      id?: number;
      read: boolean;
      write: boolean;
    };
    registers: {
      id?: number;
      read: boolean;
      write: boolean;
    };
    users_manager: {
      id?: number;
      read: boolean;
      write: boolean;
    };
  };

  export type Params = {
    email: string;
    type: "admin" | "standard";
    modules: system_modules_permissions;
  };

  export type Result = string;
}
