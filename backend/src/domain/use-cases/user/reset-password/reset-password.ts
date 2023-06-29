import { AccountRepository } from "../../../../infra/database/postgres/repositories/account-repository";
import { Either, left, right } from "../../../../shared/Either";
import { Encoder } from "../../ports/encoder";
import {
  TokenProvider,
  TokenResponse,
} from "../authentication/ports/token-provider";

export class ResetPassword {
  private readonly accountRepository: AccountRepository;
  // private readonly sendEmailToUser: SendEmailToUser;
  private readonly tokenProvider: TokenProvider;
  private readonly encoder: Encoder;

  // sendEmailToUser: SendEmailToUser,
  constructor(
    accountRepository: AccountRepository,
    tokenProvider: TokenProvider,
    encoder: Encoder
  ) {
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
      return left(new Error("Token not informed"));
    }

    let token: TokenResponse;

    try {
      token = await this.tokenProvider.verify(access_token);
    } catch (error) {
      console.error(error);
      return left(new Error("Token invalid"));
    }

    const user = await this.accountRepository.loadById(Number(token.sub));

    if (!user) {
      return left(new Error("User not found"));
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

    console.log("Usuário atualizado com sucesso");
    return right(null);
  }
}
