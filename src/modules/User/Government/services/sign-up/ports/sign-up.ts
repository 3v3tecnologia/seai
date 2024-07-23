import { Either } from "../../../../../../shared/Either";

export namespace SignUpDTO {
  export type params = {
    accountId: number;
    name: string;
    login: string;
    password: string;
    confirmPassword: string;
  };
  export type result = {};
}

export interface SignInUpUseCase {
  create(user: any): Promise<Either<Error, string>>;
}
