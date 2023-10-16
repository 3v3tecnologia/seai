import { Either } from "../../../../../shared/Either";
import { UserTypes } from "../../../../entities/user/user";
import { SystemModulesProps } from "../../../../entities/user/user-modules-access";

export namespace UpdateUserDTO {
  type system_modules_permissions = SystemModulesProps;

  export type params = {
    id: number;
    email: string;
    type: UserTypes;
    name: string;
    login: string;
    password: string;
    confirmPassword: string;
    modules: system_modules_permissions;
  };
  export type result = {};
}

export interface UpdateUserUseCase {
  execute(user: any): Promise<Either<Error, string>>;
}
