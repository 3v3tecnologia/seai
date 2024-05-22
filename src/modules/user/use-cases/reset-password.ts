import { Either, left, right } from "../../../shared/Either";
import { base64Decode } from "../../../shared/core/base64Encoder";
import { UserPassword } from "../core/model/userPassword";
import { Command } from "../../../shared/core/command";
import { Encoder } from "../../../shared/external/cryptography/protocols/encoder";
import { AccountRepositoryProtocol } from "../../../domain/use-cases/_ports/repositories/account-repository";

import { AccountNotFoundError } from "../core/errors/user-account-not-found";

export class ResetPassword extends Command implements ResetPasswordProtocol {
  private readonly accountRepository: AccountRepositoryProtocol;
  private readonly encoder: Encoder;

  // sendEmailToUser: SendEmailToUser,
  constructor(
    accountRepository: AccountRepositoryProtocol,
    encoder: Encoder
  ) {
    super();
    this.accountRepository = accountRepository;
    this.encoder = encoder;
  }
  async execute(
    params: {
      code: string,
      password: string,
      confirmPassword: string
    }
  ): Promise<Either<Error, null>> {

    const { code, confirmPassword, password } = params

    if (!code) {
      return left(new Error("Código não informado"));
    }

    const userEmailToString = base64Decode(code)

    const account = await this.accountRepository.getByEmail(
      userEmailToString
    );

    if (account === null) {
      return left(new AccountNotFoundError());
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

    this.addLog({
      action: "update",
      table: "User",
      description: `Usuário atualizado com sucesso`,
    });
    return right(null);
  }
}

export interface ResetPasswordProtocol {
  execute(
    params: {
      code: string,
      password: string,
      confirmPassword: string
    }
  ): Promise<Either<Error, null>>;
}
