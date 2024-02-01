import { UserAuthentication } from "../../../../domain/use-cases/user/authentication";
import { CreateUser } from "../../../../domain/use-cases/user/create-user";
import { DeleteUser } from "../../../../domain/use-cases/user/delete-user/delete-user";
import { FetchUserById } from "../../../../domain/use-cases/user/fetch-user-by-id/fetch-user-by-id";
import { GetUsers } from "../../../../domain/use-cases/user/get-users/get-users";
import { ResetPassword } from "../../../../domain/use-cases/user/reset-password/reset-password";
import { ForgotPassword } from "../../../../domain/use-cases/user/send-forgot-password/forgot-password";
import { ScheduleUserAccountNotification } from "../../../../domain/use-cases/user/send-notification-to-user/send-notification-to-user";
import { SignIn } from "../../../../domain/use-cases/user/sign-in";
import { SignUp } from "../../../../domain/use-cases/user/sign-up";
import { UpdateUser } from "../../../../domain/use-cases/user/update-user";
import { BcryptAdapter } from "../../../../infra/cryptography/bcrypt-adapter";
import { JwtAdapter } from "../../../../infra/cryptography/jwt-adapter";
import { DbAccountRepository } from "../../../../infra/database/postgres/repositories/account-repository";
import { DateProvider } from "../../../../infra/dateprovider/date";
import env from "../../env";
import { JobsUseCasesFactory } from "./jobs.useCase.factory";

export class UserUseCasesFactory {
  private static repository = new DbAccountRepository();
  private static tokenProvider = new JwtAdapter(env.jwtSecret);
  private static encoder = new BcryptAdapter();
  private static dateProvider = new DateProvider();

  static makeUserAuthentication(): UserAuthentication {
    const jwtAdapter = new JwtAdapter(env.jwtSecret);
    return new UserAuthentication(this.repository, this.encoder, jwtAdapter);
  }

  static makeCreateUser(): CreateUser {
    return new CreateUser(
      this.repository,
      this.makeSendNotificationToUser(),
      this.dateProvider,
      this.tokenProvider
    );
  }

  static makeDeleteUser(): DeleteUser {
    return new DeleteUser(this.repository);
  }

  static makeForgotPasswordUser(): ForgotPassword {
    return new ForgotPassword(
      this.repository,
      this.makeSendNotificationToUser(),
      this.dateProvider,
      this.tokenProvider
    );
  }

  static makeGetUsers(): GetUsers {
    return new GetUsers(this.repository);
  }

  static makeFetchUserByIdModules(): FetchUserById {
    return new FetchUserById(this.repository);
  }

  static makeResetUserPassword(): ResetPassword {
    return new ResetPassword(this.repository, this.tokenProvider, this.encoder);
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

  static makeUpdateUser(): UpdateUser {
    return new UpdateUser(this.repository, this.encoder);
  }
}
