import { User, UserTypes } from "../../../../domain/entities/user/user";
import { Encoder } from "../../../../domain/use-cases/_ports/cryptography/encoder";
import { AccountRepositoryProtocol } from "../../../../domain/use-cases/_ports/repositories/account-repository";
import { UserNotFoundError } from "../../../../domain/use-cases/errors/user-not-found";
import {
  UnmatchedPasswordError,
  WrongPasswordError,
} from "../../../../domain/use-cases/user/authentication/errors";
import { AuthenticationService } from "../../../../domain/use-cases/user/authentication/ports/authentication-service";
import { TokenProvider } from "../../../../domain/use-cases/user/authentication/ports/token-provider";
import { Either, left, right } from "../../../../shared/Either";
import { Logger } from "../../../../shared/logger/logger";
import { IUserPreferencesRepository } from "../repositories/protocol/preferences.repository";

import { CreateIrrigantAccountDTO } from "./dto/user-account";

export interface IUserIrrigantServices {
  create(
    dto: CreateIrrigantAccountDTO.Input
  ): Promise<CreateIrrigantAccountDTO.Output>;
  login(user: any): Promise<
    Either<
      Error,
      {
        accessToken: string;
        // accountId: number;
      }
    >
  >;
  completeRegister(user: any): Promise<Either<Error, string>>;
  resetPassword(user: any): Promise<Either<Error, string>>;
}

export class UserIrrigantServices implements IUserIrrigantServices {
  private readonly accountRepository: AccountRepositoryProtocol;
  private readonly encoder: Encoder;
  private readonly authentication: AuthenticationService;
  private readonly preferencesRepository: IUserPreferencesRepository;
  private readonly tokenProvider: TokenProvider;

  constructor(
    accountRepository: AccountRepositoryProtocol,
    authentication: AuthenticationService,
    preferencesRepository: IUserPreferencesRepository,
    encoder: Encoder,
    tokenProvider: TokenProvider
  ) {
    this.accountRepository = accountRepository;
    this.encoder = encoder;
    this.authentication = authentication;
    this.preferencesRepository = preferencesRepository;
    this.tokenProvider = tokenProvider;
  }

  async login(user: {
    login?: string;
    email?: string;
    password: string;
  }): Promise<
    Either<
      Error,
      {
        accessToken: string;
        // accountId: number;
      }
    >
  > {
    const account = user.login
      ? await this.accountRepository.getByLogin(user.login, UserTypes.IRRIGANT)
      : await this.accountRepository.getByEmail(
          user.email as string,
          UserTypes.IRRIGANT
        );

    if (!account) {
      return left(new UserNotFoundError());
    }

    const isMatch = await this.encoder.compare(
      user.password,
      account.password as string
    );

    if (isMatch === false) {
      return left(new WrongPasswordError());
    }

    const userId = account.id as number;

    const token = await this.tokenProvider.sign(
      {
        accountId: userId,
      },
      "7d"
    );

    return right({
      accessToken: token,
      userName: account.name,
    });
  }

  completeRegister(user: any): Promise<Either<Error, string>> {
    throw new Error("Method not implemented.");
  }

  resetPassword(user: any): Promise<Either<Error, string>> {
    throw new Error("Method not implemented.");
  }

  async create(
    dto: CreateIrrigantAccountDTO.Input
  ): Promise<CreateIrrigantAccountDTO.Output> {
    const emailAlreadyExists = await this.accountRepository.getByEmail(
      dto.email,
      UserTypes.IRRIGANT
    );

    if (
      !!emailAlreadyExists &&
      emailAlreadyExists.type === UserTypes.IRRIGANT
    ) {
      return left(new Error("Email já existe"));
    }

    const existingLogin = await this.accountRepository.getByLogin(
      dto.login,
      UserTypes.IRRIGANT
    );

    if (existingLogin) {
      return left(new Error("Login já existe"));
    }

    if (dto.password !== dto.confirmPassword) {
      return left(new UnmatchedPasswordError());
    }

    const userOrError = User.create({
      email: dto.email,
      type: UserTypes.IRRIGANT,
      login: dto.login,
      name: dto.name,
      password: dto.password,
      confirmPassword: dto.confirmPassword,
    });

    if (userOrError.isLeft()) {
      return left(userOrError.value);
    }

    const userHash = await this.encoder.hashInPbkdf2(
      dto.email,
      100,
      10,
      "sha512"
    );

    const hashedPassword = await this.encoder.hash(dto.password);

    // TODO: deve passar todos os campos do 'account'
    const user_id = await this.accountRepository.add({
      email: dto.email,
      login: dto.login,
      name: dto.name,
      type: UserTypes.IRRIGANT,
      code: userHash as string,
      status: "registered",
      password: hashedPassword,
    });

    Logger.info(`Usuário ${user_id} criado com sucesso`);

    const tokenOrError = await this.authentication.auth({
      login: dto.login,
      password: dto.password,
    });

    if (tokenOrError.isLeft()) {
      return left(tokenOrError.value);
    }

    const notificationSystems =
      await this.preferencesRepository.getAvailableNotificationsServices();

    if (notificationSystems) {
      Logger.info("Inserindo preferências de notificações dos usuários...");
      await this.preferencesRepository.createUserNotificationsPreferences(
        notificationSystems.map((service: any) => {
          return {
            enabled: false,
            service_id: service.id,
            user_id: user_id as number,
          };
        })
      );
    }

    return right(tokenOrError.value);
  }
}
