import { Encoder } from "../../../../../domain/use-cases/_ports/cryptography/encoder";
import { Either, left, right } from "../../../../../shared/Either";
import { base64Decode } from "../../../../../shared/utils/base64Encoder";
import { UserRepositoryProtocol } from "../../infra/database/repository/protocol/user-repository";
import { UserTypes } from "../../../core/model/user";
import { UserPassword } from "../../../core/model/userPassword";
import { ResetPasswordProtocol } from "./protocol";
import { UserNotFoundError } from "../../../core/errors/user-not-found-error";

export class ResetPassword implements ResetPasswordProtocol {
  private readonly accountRepository: UserRepositoryProtocol;
  private readonly encoder: Encoder;

  // sendEmailToUser: SendEmailToUser,
  constructor(accountRepository: UserRepositoryProtocol, encoder: Encoder) {
    this.accountRepository = accountRepository;
    this.encoder = encoder;
  }
  async execute(params: {
    code: string;
    password: string;
    confirmPassword: string;
  }): Promise<Either<Error, null>> {
    const { code, confirmPassword, password } = params;

    if (!code) {
      return left(new Error("Código não informado"));
    }

    const userEmailToString = base64Decode(code);

    const account = await this.accountRepository.getByEmail(userEmailToString, [
      UserTypes.ADMIN,
      UserTypes.STANDARD,
    ]);

    if (account === null) {
      return left(new UserNotFoundError());
    }

    const passwordOrError = UserPassword.create({
      value: password,
      confirm: confirmPassword,
      isHashed: false,
    });

    if (passwordOrError.isLeft()) {
      return left(passwordOrError.value);
    }

    const newPassword = await this.encoder.hash(password);

    account.password = newPassword;

    await this.accountRepository.updateUserPassword(
      account.id as number,
      account.password
    );

    return right(null);
  }
}
