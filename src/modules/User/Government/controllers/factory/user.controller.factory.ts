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
import {
  completeUserRegistrationValidator,
  createUserValidator,
  deleteUserValidator,
  fetchAllUsersValidator,
  fetchUserByIdValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  signInValidator,
  signUpValidator,
  updateProfilerValidator,
  updateUserValidator,
} from "../schema";

export class UserControllersFactory {
  static makeFetchSystemModules(): Controller {
    return new FetchSystemModulesController(new UserRepository());
  }
  static makeCreateUser(): Controller {
    return new CreateUserController(
      UserUseCasesFactory.makeCreateUser(),
      createUserValidator
    );
  }

  static makeDeleteUser(): Controller {
    return new DeleteUserController(
      UserUseCasesFactory.makeDeleteUser(),
      deleteUserValidator
    );
  }

  static makeGetUsers(): Controller {
    return new FetchAllUsersController(
      UserUseCasesFactory.makeGetUsers(),
      fetchAllUsersValidator
    );
  }

  static makeForgotPassword(): Controller {
    return new ForgotPasswordController(
      UserUseCasesFactory.makeForgotPasswordUser(),
      forgotPasswordValidator
    );
  }

  static makeFetchUserById(): Controller {
    return new FetchUserByIdController(
      UserUseCasesFactory.makeFetchUserByIdModules(),
      fetchUserByIdValidator
    );
  }

  static makeResetUser(): Controller {
    return new ResetPasswordController(
      UserUseCasesFactory.makeResetUserPassword(),
      resetPasswordValidator
    );
  }

  static makeSignIn(): Controller {
    return new SignInController(
      UserUseCasesFactory.makeUserSignIn(),
      signInValidator
    );
  }

  static makeSignUp(): Controller {
    return new SignUpController(
      UserUseCasesFactory.makeUserSignUp(),
      signUpValidator
    );
  }

  static makeUpdateUser(): Controller {
    return new UpdateUserController(
      UserUseCasesFactory.makeUpdateUser(),
      updateUserValidator
    );
  }
  static makeUpdateUserProfile(): Controller {
    return new UpdateUserProfileController(
      UserUseCasesFactory.makeUpdateUserProfile(),
      updateProfilerValidator
    );
  }
  static makeCompleteUserRegister(): Controller {
    return new CompleteUserRegisterController(
      UserUseCasesFactory.makeCompleteUserRegister(),
      completeUserRegistrationValidator
    );
  }
}
