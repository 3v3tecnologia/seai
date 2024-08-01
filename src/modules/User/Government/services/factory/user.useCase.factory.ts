import {
  CompleteUserRegister,
  CreateUser,
  DeleteUser,
  FetchUserById,
  FetchUsersUseCase,
  ForgotPassword,
  ResetPassword,
  SignIn,
  SignUp,
  UpdateUser,
  UpdateUserProfile,
  UserAuthentication,
} from "../";
import { PgBossAdapter } from "../../../../../infra/queueProvider/pg-boss";
import env from "../../../../../server/http/env";
import { UserRepository } from "../../infra/database/repository/user-repository";
import { BcryptAdapter } from "./../../../../../infra/cryptography/bcrypt-adapter";
import { JwtAdapter } from "./../../../../../infra/cryptography/jwt-adapter";

export class UserUseCasesFactory {
  private static repository = new UserRepository();
  private static encoder = new BcryptAdapter(env.hashSalt);

  static makeUserAuthentication(): UserAuthentication {
    const jwtAdapter = new JwtAdapter(env.jwtSecret);
    return new UserAuthentication(this.repository, this.encoder, jwtAdapter);
  }

  static makeCreateUser(): CreateUser {
    return new CreateUser(this.repository, new PgBossAdapter(), this.encoder);
  }

  static makeDeleteUser(): DeleteUser {
    return new DeleteUser(this.repository);
  }

  static makeForgotPasswordUser(): ForgotPassword {
    return new ForgotPassword(this.repository, new PgBossAdapter());
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
  static makeUpdateUserProfile(): UpdateUserProfile {
    return new UpdateUserProfile(this.repository, this.encoder);
  }
  static makeCompleteUserRegister(): CompleteUserRegister {
    return new CompleteUserRegister(this.repository, this.encoder);
  }
}
