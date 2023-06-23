import { Either } from "../../../../../shared/Either";

export namespace SignUpDTO {
  export type params = {
    email: string;
    name: string;
    login: string;
    password: string;
  };
  export type result = {};
}

export interface SignInUpUseCase {
  create(user: any): Promise<Either<Error, string>>;
}
