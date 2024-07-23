import {
  CompleteUserRegisterController,
  CreateUserController,
  DeleteUserController,
  FetchAllUsersController,
  FetchSystemModulesController,
  FetchUserByIdController,
  ForgotPasswordController,
  ResetPasswordController,
  SignInController,
  SignUpController,
  UpdateUserController,
  UpdateUserProfileController,
} from "../";
import { Controller } from "../../../../../presentation/controllers/ports/controllers";
import { UserRepository } from "../../infra/database/repository/user-repository";
import { UserUseCasesFactory } from "../../services/factory/user.useCase.factory";

export class UserControllersFactory {
  static makeFetchSystemModules(): Controller {
    return new FetchSystemModulesController(new UserRepository());
  }
  static makeCreateUser(): Controller {
    return new CreateUserController(UserUseCasesFactory.makeCreateUser());
  }

  static makeDeleteUser(): Controller {
    return new DeleteUserController(UserUseCasesFactory.makeDeleteUser());
  }

  static makeGetUsers(): Controller {
    return new FetchAllUsersController(UserUseCasesFactory.makeGetUsers());
  }

  static makeForgotPassword(): Controller {
    return new ForgotPasswordController(
      UserUseCasesFactory.makeForgotPasswordUser()
    );
  }

  static makeFetchUserById(): Controller {
    return new FetchUserByIdController(
      UserUseCasesFactory.makeFetchUserByIdModules()
    );
  }

  static makeResetUser(): Controller {
    return new ResetPasswordController(
      UserUseCasesFactory.makeResetUserPassword()
    );
  }

  static makeSignIn(): Controller {
    return new SignInController(UserUseCasesFactory.makeUserSignIn());
  }

  static makeSignUp(): Controller {
    return new SignUpController(UserUseCasesFactory.makeUserSignUp());
  }

  static makeUpdateUser(): Controller {
    return new UpdateUserController(UserUseCasesFactory.makeUpdateUser());
  }
  static makeUpdateUserProfile(): Controller {
    return new UpdateUserProfileController(
      UserUseCasesFactory.makeUpdateUserProfile()
    );
  }
  static makeCompleteUserRegister(): Controller {
    return new CompleteUserRegisterController(
      UserUseCasesFactory.makeCompleteUserRegister()
    );
  }
}
