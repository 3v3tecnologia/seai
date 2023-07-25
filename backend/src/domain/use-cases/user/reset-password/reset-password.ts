import { Either, left, right } from "../../../../shared/Either";
import { UserPassword } from "../../../entities/user/userPassword";
import { Command } from "../../_ports/core/command";
import { Encoder } from "../../_ports/cryptography/encoder";
import { AccountRepositoryProtocol } from "../../_ports/repositories/account-repository";

import {
  TokenProvider,
  TokenResponse,
} from "../authentication/ports/token-provider";
import { ResetPasswordProtocol } from "./protocol";

export class ResetPassword extends Command implements ResetPasswordProtocol {
  private readonly accountRepository: AccountRepositoryProtocol;
  // private readonly sendEmailToUser: SendEmailToUser;
  private readonly tokenProvider: TokenProvider;
  private readonly encoder: Encoder;

  // sendEmailToUser: SendEmailToUser,
  constructor(
    accountRepository: AccountRepositoryProtocol,
    tokenProvider: TokenProvider,
    encoder: Encoder
  ) {
    super();
    this.accountRepository = accountRepository;
    // this.sendEmailToUser = sendEmailToUser;
    this.tokenProvider = tokenProvider;
    this.encoder = encoder;
  }
  async execute(
    access_token: string,
    password: string
  ): Promise<Either<Error, null>> {
    if (!access_token) {
      return left(new Error("Token não informado"));
    }

    let token: TokenResponse;

    try {
      token = await this.tokenProvider.verify(access_token);
    } catch (error) {
      console.error(error);
      return left(new Error("Token inválido"));
    }

    const user = await this.accountRepository.getById(Number(token.sub));

    if (!user) {
      return left(new Error("Usuário não encontado"));
    }

    const passwordOrError = UserPassword.create({
      value: password,
      isHashed: false,
    });

    if (passwordOrError.isLeft()) {
      return left(passwordOrError.value);
    }

    const newPassword = await this.encoder.hash(password);

    user.password = newPassword;

    await this.accountRepository.update({
      email: user.email,
      id: user.id as number,
      login: user.login as string,
      name: user.name as string,
      password: user.password,
    });

    this.addLog({
      action: "update",
      table: "User",
      description: `Senha do usuário ${user.login} resetada com sucesso`,
    });
    return right(null);
  }
}
