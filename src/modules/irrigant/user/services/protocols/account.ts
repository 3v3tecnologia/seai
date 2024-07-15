import { Either } from "../../../../../shared/Either";
import { CreateIrrigantAccountDTO } from "../dto/user-account";

export interface IUserIrrigantServices {
  create(
    dto: CreateIrrigantAccountDTO.Input
  ): Promise<CreateIrrigantAccountDTO.Output>;
  login(user: { login?: string; email?: string; password: string }): Promise<
    Either<
      Error,
      {
        accessToken: string;
        // accountId: number;
      }
    >
  >;
  completeRegister(code: string): Promise<Either<Error, void>>;
  resetPassword(params: {
    code: string;
    password: string;
    confirmPassword: string;
  }): Promise<Either<Error, null>>;
  forgotPassword(email: string): Promise<Either<Error, string>>;
  updateProfile(request: {
    id: number;
    email?: string;
    login: string;
    name: string;
    password?: string;
    confirmPassword?: string;
  }): Promise<Either<Error, string>>;
  deleteAccount(id: number): Promise<Either<Error, void>>;
}
