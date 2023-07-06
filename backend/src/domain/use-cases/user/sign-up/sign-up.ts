import { Either, left, right } from "../../../../shared/Either";
import { Encoder } from "../../_data/cryptography/encoder";
import { AccountRepositoryProtocol } from "../../_data/repositories/account-repository";
import {
  AccountNotFoundError,
  WrongPasswordError,
} from "../authentication/errors";
import {
  AuthenticationDTO,
  AuthenticationService,
} from "../authentication/ports/authentication-service";
import { AccountEmailNotFound } from "./errors/user-email-not-found";
import { SignUpDTO } from "./ports/sign-up";

export class SignUp {
  private readonly accountRepository: AccountRepositoryProtocol;
  private readonly encoder: Encoder;
  private readonly authentication: AuthenticationService;

  constructor(
    accountRepository: AccountRepositoryProtocol,
    authentication: AuthenticationService,
    encoder: Encoder
  ) {
    this.accountRepository = accountRepository;
    this.encoder = encoder;
    this.authentication = authentication;
  }
  async create(
    user: SignUpDTO.params
  ): Promise<
    Either<
      AccountEmailNotFound | AccountNotFoundError | WrongPasswordError,
      AuthenticationDTO.result
    >
  > {
    // WARN: versão final não irá ter checagem por email, mas deverá trazer o usuário do banco
    const account = await this.accountRepository.getByEmail(user.email);

    if (!account) {
      return left(new AccountEmailNotFound(user.email));
    }

    const hashedPassword = await this.encoder.hash(user.password);

    console.log("hash = ", hashedPassword);
    // TODO: deve passar todos os campos do 'account'
    await this.accountRepository.update({
      id: account.id as number,
      email: user.email,
      login: user.login,
      name: user.name,
      password: hashedPassword,
    });

    const tokenOrError = await this.authentication.auth({
      login: user.login,
      password: user.password,
    });

    if (tokenOrError.isLeft()) {
      return left(tokenOrError.value);
    }

    return right(tokenOrError.value);
  }
}
