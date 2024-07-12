import { User, UserTypes } from "../../../../domain/entities/user/user";
import { UserPassword } from "../../../../domain/entities/user/userPassword";
import { Encoder } from "../../../../domain/use-cases/_ports/cryptography/encoder";
import { AccountRepositoryProtocol } from "../../../../domain/use-cases/_ports/repositories/account-repository";
import { UserNotFoundError } from "../../../../domain/use-cases/errors/user-not-found";
import {
  AvailablesEmailServices,
  ScheduleUserAccountNotification,
} from "../../../../domain/use-cases/user";
import {
  UnmatchedPasswordError,
  WrongPasswordError,
} from "../../../../domain/use-cases/user/authentication/errors";
import { AuthenticationService } from "../../../../domain/use-cases/user/authentication/ports/authentication-service";
import { TokenProvider } from "../../../../domain/use-cases/user/authentication/ports/token-provider";
import { AccountNotFoundError } from "../../../../domain/use-cases/user/errors/user-account-not-found";
import { Either, left, right } from "../../../../shared/Either";
import { Logger } from "../../../../shared/logger/logger";
import { base64Decode } from "../../../../shared/utils/base64Encoder";
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
  resetPassword(params: {
    code: string;
    password: string;
    confirmPassword: string;
  }): Promise<Either<Error, null>>;
}

export class UserIrrigantServices implements IUserIrrigantServices {
  private readonly accountRepository: AccountRepositoryProtocol;
  private readonly encoder: Encoder;
  private readonly authentication: AuthenticationService;
  private readonly preferencesRepository: IUserPreferencesRepository;
  private readonly tokenProvider: TokenProvider;
  private readonly userNotification: ScheduleUserAccountNotification;

  constructor(
    accountRepository: AccountRepositoryProtocol,
    authentication: AuthenticationService,
    preferencesRepository: IUserPreferencesRepository,
    encoder: Encoder,
    tokenProvider: TokenProvider,
    userNotification: ScheduleUserAccountNotification
  ) {
    this.accountRepository = accountRepository;
    this.encoder = encoder;
    this.authentication = authentication;
    this.preferencesRepository = preferencesRepository;
    this.tokenProvider = tokenProvider;
    this.userNotification = userNotification;
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

  //
  completeRegister(user: any): Promise<Either<Error, string>> {
    throw new Error("Method not implemented.");
  }

  async forgotPassword(email: string): Promise<Either<Error, string>> {
    const account = await this.accountRepository.getByEmail(email);

    if (account == null || account.type === UserTypes.IRRIGANT) {
      return left(new UserNotFoundError());
    }
    // TO-DO: change to a specific queue
    await this.userNotification.schedule({
      user: {
        email: account.email,
        base64Code: Buffer.from(account.email).toString("base64"),
      },
      templateName: AvailablesEmailServices.FORGOT_PASSWORD,
    });

    return right(`Um email para rescuperação de senha será enviado em breve.`);
  }

  async resetPassword(params: {
    code: string;
    password: string;
    confirmPassword: string;
  }): Promise<Either<Error, null>> {
    const { code, confirmPassword, password } = params;

    if (!code) {
      return left(new Error("Código não informado"));
    }

    const userEmailToString = base64Decode(code);

    const account = await this.accountRepository.getByEmail(userEmailToString);

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

    return right(null);
  }

  async updateProfile(): Promise<Either<Error, string>> {
    throw new Error("Method not implemented.");
  }

  async deleteAccount(): Promise<Either<Error, void>> {
    throw new Error("Method not implemented.");
  }
}
