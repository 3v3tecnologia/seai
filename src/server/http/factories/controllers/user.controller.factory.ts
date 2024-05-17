import { Controller } from "../../../../presentation/controllers/ports/controllers";

import { makeLogControllerDecorator } from "../decorators";
import { SystemLogsUseCaseFactory, UserUseCasesFactory } from "../use-cases";
import {
  CompleteUserRegisterController,
  CreateUserController,
  DeleteUserController,
  FetchAllUsersController,
  FetchUserByIdController,
  FetchUserController,
  ForgotPasswordController,
  ResetPasswordController,
  SignInController,
  SignUpController,
  UpdateUserController,
  UpdateUserProfileController,
} from "../../../../presentation/controllers/user";

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
      new FetchAllUsersController(UserUseCasesFactory.makeGetUsers())
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
  static makeUpdateUserProfile(): Controller {
    return makeLogControllerDecorator(
      new UpdateUserProfileController(
        UserUseCasesFactory.makeUpdateUserProfile(),
        SystemLogsUseCaseFactory.makeRegisterUserLogs()
      )
    );
  }
  static makeCompleteUserRegister(): Controller {
    return makeLogControllerDecorator(
      new CompleteUserRegisterController(
        UserUseCasesFactory.makeCompleteUserRegister(),
        SystemLogsUseCaseFactory.makeRegisterUserLogs()
      )
    );
  }
}
