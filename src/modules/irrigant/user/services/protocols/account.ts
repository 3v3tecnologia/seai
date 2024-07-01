import { Either } from "../../../../../shared/Either";
import { CreateIrrigantAccountDTO } from "../dto/user-account";

export interface IUserIrrigantServices {
  create(
    dto: CreateIrrigantAccountDTO.Input
  ): Promise<CreateIrrigantAccountDTO.Output>;
  login(user: any): Promise<Either<Error, string>>;
  completeRegister(user: any): Promise<Either<Error, string>>;
  resetPassword(user: any): Promise<Either<Error, string>>;
}
