import { UserUseCasesFactory } from "../use-cases/user/index";
import { Controller } from "../../../../presentation/controllers/ports/controllers";
import { CreateUserController } from "../../../../presentation/controllers/user-controller/create-user.controller";
import { DeleteUserController } from "../../../../presentation/controllers/user-controller/delete-user.controller";
import { FetchUserByIdController } from "../../../../presentation/controllers/user-controller/fetch-user-by-id";
import { FetchUserController } from "../../../../presentation/controllers/user-controller/fetch-user.controller";
import { ForgotPasswordController } from "../../../../presentation/controllers/user-controller/forgot-password.controller";
import { ResetPasswordController } from "../../../../presentation/controllers/user-controller/reset-password.controller";
import { SignInController } from "../../../../presentation/controllers/user-controller/sign-in.controller";
import { SignUpController } from "../../../../presentation/controllers/user-controller/sign-up.controller";
import { UpdateUserController } from "../../../../presentation/controllers/user-controller/update-user.controller";
import { makeLogControllerDecorator } from "../decorators";
import { SystemLogsUseCaseFactory } from "../use-cases";

export class UserControllersFactory {
  static makeCreateUser(): Controller {
    return makeLogControllerDecorator(
      new CreateUserController(
        UserUseCasesFactory.makeCreateUser(),
        SystemLogsUseCaseFactory.makeRegisterUserLogs()
      )
    );
  }

  static makeDeleteUser(): Controller {
    return makeLogControllerDecorator(
      new DeleteUserController(
        UserUseCasesFactory.makeDeleteUser(),
        SystemLogsUseCaseFactory.makeRegisterUserLogs()
      )
    );
  }

  static makeGetUsers(): Controller {
    return makeLogControllerDecorator(
      new FetchUserController(UserUseCasesFactory.makeGetUsers())
    );
  }

  static makeForgotPassword(): Controller {
    return makeLogControllerDecorator(
      new ForgotPasswordController(UserUseCasesFactory.makeForgotPasswordUser())
    );
  }

  static makeFetchUserById(): Controller {
    return makeLogControllerDecorator(
      new FetchUserByIdController(
        UserUseCasesFactory.makeFetchUserByIdModules()
      )
    );
  }

  static makeResetUser(): Controller {
    return makeLogControllerDecorator(
      new ResetPasswordController(
        UserUseCasesFactory.makeResetUserPassword(),
        SystemLogsUseCaseFactory.makeRegisterUserLogs()
      )
    );
  }

  static makeSignIn(): Controller {
    return makeLogControllerDecorator(
      new SignInController(UserUseCasesFactory.makeUserSignIn())
    );
  }

  static makeSignUp(): Controller {
    return makeLogControllerDecorator(
      new SignUpController(
        UserUseCasesFactory.makeUserSignUp(),
        SystemLogsUseCaseFactory.makeRegisterUserLogs()
      )
    );
  }

  static makeUpdateUser(): Controller {
    return makeLogControllerDecorator(
      new UpdateUserController(
        UserUseCasesFactory.makeUpdateUser(),
        SystemLogsUseCaseFactory.makeRegisterUserLogs()
      )
    );
  }
}
