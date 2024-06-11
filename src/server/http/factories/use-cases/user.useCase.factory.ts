import {
  CreateUser,
  DeleteUser,
  FetchUserById,
  ForgotPassword,
  FetchUsersUseCase,
  ResetPassword,
  ScheduleUserAccountNotification,
  SignIn,
  SignUp,
  UpdateUser,
  UserAuthentication,
  UpdateUserProfile,
  CompleteUserRegister,
  IrrigantSignUp,
} from "../../../../domain/use-cases/user";
import { BcryptAdapter } from "../../../../infra/cryptography/bcrypt-adapter";
import { JwtAdapter } from "../../../../infra/cryptography/jwt-adapter";
import { DbAccountRepository } from "../../../../infra/database/postgres/repositories/users-repository";
import { DateProvider } from "../../../../infra/dateprovider/date";
import env from "../../env";
import { JobsUseCasesFactory } from "./jobs.useCase.factory";

export class UserUseCasesFactory {
  private static repository = new DbAccountRepository();
  private static tokenProvider = new JwtAdapter(env.jwtSecret);
  private static encoder = new BcryptAdapter(env.hashSalt);
  private static dateProvider = new DateProvider();

  static makeUserAuthentication(): UserAuthentication {
    const jwtAdapter = new JwtAdapter(env.jwtSecret);
    return new UserAuthentication(this.repository, this.encoder, jwtAdapter);
  }

  static makeCreateUser(): CreateUser {
    return new CreateUser(
      this.repository,
      this.makeSendNotificationToUser(),
      this.encoder
    );
  }

  static makeDeleteUser(): DeleteUser {
    return new DeleteUser(this.repository);
  }

  static makeForgotPasswordUser(): ForgotPassword {
    return new ForgotPassword(
      this.repository,
      this.makeSendNotificationToUser(),
    );
  }

  static makeGetUsers(): FetchUsersUseCase {
    return new FetchUsersUseCase(this.repository);
  }

  static makeFetchUserByIdModules(): FetchUserById {
    return new FetchUserById(this.repository);
  }

  static makeResetUserPassword(): ResetPassword {
    return new ResetPassword(this.repository, this.encoder);
  }

  static makeSendNotificationToUser(): ScheduleUserAccountNotification {
    return new ScheduleUserAccountNotification(
      JobsUseCasesFactory.makeCreateJob()
    );
  }

  static makeUserSignIn(): SignIn {
    return new SignIn(this.makeUserAuthentication());
  }

  static makeUserSignUp(): SignUp {
    return new SignUp(
      this.repository,
      this.makeUserAuthentication(),
      this.encoder
    );
  }

  static makeIrrigantSignUp(): IrrigantSignUp {
    return new IrrigantSignUp(
      this.repository,
      this.makeUserAuthentication(),
      this.encoder
    );
  }

  static makeUpdateUser(): UpdateUser {
    return new UpdateUser(this.repository, this.encoder);
  }
  static makeUpdateUserProfile(): UpdateUserProfile {
    return new UpdateUserProfile(this.repository);
  }
  static makeCompleteUserRegister(): CompleteUserRegister {
    return new CompleteUserRegister(this.repository, this.encoder);
  }
}
