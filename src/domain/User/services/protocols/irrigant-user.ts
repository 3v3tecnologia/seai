import { Either } from "../../../../shared/Either";
import { CreateIrrigationAccountDTO } from "../dto/user-account";


export interface IIrrigationUserService {
  create(
    dto: CreateIrrigationAccountDTO.Input
  ): Promise<CreateIrrigationAccountDTO.Output>;
  completeRegister(code: string): Promise<Either<Error, void>>;
  resetPassword(params: {
    code: string;
    password: string;
    confirmPassword: string;
  }): Promise<Either<Error, void>>
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
  getProfile(id: number): Promise<
    Either<
      Error,
      {
        createdAt: string;
        email: string;
        login: string;
        name: string;
        type: string;
        updatedAt: string;
      }
    >
  >;
}
