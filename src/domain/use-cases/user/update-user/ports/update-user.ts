import { Either } from "../../../../../shared/Either";
import { UserType } from "../../../../entities/user/user";
import { SystemModulesProps } from "../../../../entities/user/user-modules-access";

export namespace UpdateUserDTO {
  type system_modules_permissions = SystemModulesProps;

  export type params = {
    id: number;
    email: string;
    type: UserType;
    name: string | null;
    login: string | null;
    password?: string | null;
    confirmPassword?: string | null;
    modules?: system_modules_permissions;
  };
  export type result = {};
}

export interface UpdateUserUseCase {
  execute(user: any): Promise<Either<Error, string>>;
}
