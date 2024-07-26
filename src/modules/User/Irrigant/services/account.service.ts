import { Encoder } from "../../../../domain/use-cases/_ports/cryptography/encoder";
import { Either, left, right } from "../../../../shared/Either";
import { Logger } from "../../../../shared/logger/logger";
import { base64Decode } from "../../../../shared/utils/base64Encoder";
import { UserRepositoryProtocol } from "../../Government/infra/database/repository/protocol/user-repository";
import { Email } from "../../Government/model/email";
import { UserLogin } from "../../Government/model/login";
import { UserName } from "../../Government/model/name";
import { User, UserTypes } from "../../Government/model/user";
import { UserPassword } from "../../Government/model/userPassword";
import {
  AvailablesEmailServices
} from "../../Government/services";

import { UserAlreadyExistsError } from "../../Government/model/errors/user-already-exists";
import { UserNotFoundError } from "../../Government/model/errors/user-not-found-error";
import { AuthenticationService } from "../../Government/services/authentication/ports/authentication-service";
import { TokenProvider } from "../../Government/services/authentication/ports/token-provider";

import { QueueProviderProtocol } from "../../../../infra/queueProvider/queue.provider";
import {
  UnmatchedPasswordError,
  WrongPasswordError,
} from "../../Government/model/errors/wrong-password";
import { CreateIrrigantAccountDTO } from "./dto/user-account";
import { IUserIrrigantServices } from "./protocols/account";
import { IUserPreferencesServices } from "./protocols/user-settings";

export class UserIrrigantServices implements IUserIrrigantServices {
  private readonly accountRepository: UserRepositoryProtocol;
  private readonly encoder: Encoder;
  private readonly tokenProvider: TokenProvider;
  private readonly queueProvider: QueueProviderProtocol;
  private readonly userPreferencesServices: IUserPreferencesServices;

  constructor(
    accountRepository: UserRepositoryProtocol,
    encoder: Encoder,
    tokenProvider: TokenProvider,
    queueProvider: QueueProviderProtocol,
    userPreferencesServices: IUserPreferencesServices
  ) {
    this.accountRepository = accountRepository;
    this.encoder = encoder;
    this.tokenProvider = tokenProvider;
    this.queueProvider = queueProvider;
    this.userPreferencesServices = userPreferencesServices;
  }

  async create(
    dto: CreateIrrigantAccountDTO.Input
  ): Promise<CreateIrrigantAccountDTO.Output> {
    const emailAlreadyExists = await this.accountRepository.getByEmail(
      dto.email,
      UserTypes.IRRIGANT
    );

    if (!!emailAlreadyExists) {
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

    const userCode = await this.encoder.hashInPbkdf2(
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
      code: userCode as string,
      password: hashedPassword,
    });

    Logger.info(`Usuário ${user_id} criado com sucesso`);

    const notificationSystems =
      await this.userPreferencesServices.getAvailableNotificationsServices();

    if (notificationSystems) {
      Logger.info("Inserindo preferências de notificações dos usuários...");
      await this.userPreferencesServices.createUserNotificationsPreferences(
        notificationSystems.map((service: any) => {
          return {
            enabled: false,
            service_id: service.id,
            user_id: user_id as number,
          };
        })
      );
    }

    // Send confirmation email
    if (user_id) {
      await this.queueProvider.queue({
        name: "user-account-notification",
        priority: 1,
        retryDelay: 60,
        retryLimit: 3,
        data: {
          email: dto.email,
          base64Code: Buffer.from(dto.email).toString("base64"),
          templateName: AvailablesEmailServices.CREATE_IRRIGANT,
        },
      })
    }

    return right(
      `Usuário criado com sucessso, aguardando confirmação do cadastro.`
    );
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

    if (account.status === "pending") {
      return left(new Error("Necessário confirmar a conta"));
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
  async completeRegister(code: string): Promise<Either<Error, void>> {
    const userEmailToString = base64Decode(code);

    const account = await this.accountRepository.getByEmail(userEmailToString);

    if (account === null) {
      return left(new UserNotFoundError());
    }

    if (account.status === "registered") {
      return left(new UserAlreadyExistsError());
    }

    await this.accountRepository.updateUserStatus(
      account.id as number,
      "registered"
    );

    return right();
  }

  async forgotPassword(email: string): Promise<Either<Error, string>> {
    const account = await this.accountRepository.getByEmail(
      email,
      UserTypes.IRRIGANT
    );

    if (account == null || account.type == "pending") {
      return left(new UserNotFoundError());
    }

    await this.queueProvider.queue({
        name: "user-account-notification",
        priority: 1,
        retryDelay: 60,
        retryLimit: 3,
        data: {
          email: account.email,
          base64Code: Buffer.from(account.email).toString("base64"),
          templateName: AvailablesEmailServices.FORGOT_PASSWORD,
        },
      })


    return right(`Um email para recuperação de senha será enviado em breve.`);
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
      return left(new UserNotFoundError());
    }

    if (account.type === "pending") {
      return left(new Error("Necessário ativar a conta"));
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

  async updateProfile(request: {
    id: number;
    email?: string;
    login: string;
    name: string;
    password?: string;
    confirmPassword?: string;
  }): Promise<Either<Error, string>> {
    const userAccount = await this.accountRepository.getById(
      request.id as number
    );

    if (userAccount === null) {
      return left(new UserNotFoundError());
    }

    if (userAccount.type === "pending") {
      return left(new Error("Necessário ativar a conta"));
    }

    const existingLogin = await this.accountRepository.getByLogin(
      request.login,
      UserTypes.IRRIGANT
    );

    if (existingLogin && existingLogin.id !== request.id) {
      return left(new Error("Login já existe"));
    }

    const userLoginOrError = UserLogin.create(request.login);
    const userNameOrError = UserName.create(request.name);

    if (userLoginOrError.isLeft()) {
      return left(userLoginOrError.value);
    }

    if (userNameOrError.isLeft()) {
      return left(userNameOrError.value);
    }

    const userLogin = userLoginOrError.value?.value as string;
    const userName = userNameOrError.value?.value as string;

    const toUpdate = {
      id: request.id,
      login: userLogin || null,
      name: userName || null,
    };

    if (Reflect.has(request, "password") && request.password) {
      const passwordOrError = UserPassword.create({
        value: request.password as string,
        confirm: request.confirmPassword,
        isHashed: false,
      });

      if (passwordOrError.isLeft()) {
        return left(passwordOrError.value);
      }

      const password = passwordOrError.value?.value as string;
      const hashedPassword = await this.encoder.hash(password);

      Object.assign(toUpdate, {
        password: hashedPassword,
      });
    }

    // Usuário admin pode editar usuário mesmo não havendo login ain

    if (request.email) {
      // TO-DO: update newsleter subscriber
      const existingAccount = await this.accountRepository.getByEmail(
        request.email,
        [UserTypes.ADMIN, UserTypes.STANDARD]
      );

      if (existingAccount) {
        if (existingAccount.id !== request.id) {
          return left(
            new Error(`Usuário com email ${request.email} já existe.`)
          );
        }
      }

      const userEmailOrError = Email.create(request.email);

      if (userEmailOrError.isLeft()) {
        return left(userEmailOrError.value);
      }

      const userEmail = userEmailOrError.value?.value;

      Object.assign(toUpdate, {
        email: userEmail || null,
      });
    }

    await this.accountRepository.update(toUpdate);

    return right(`Usuário atualizado com sucesso.`);
  }

  async deleteAccount(id: number): Promise<Either<Error, void>> {
    const account = await this.accountRepository.getById(id);

    if (account === null) {
      return left(new UserNotFoundError());
    }
    await this.userPreferencesServices.removeUserNotificationsPreferences(
      id,
      account.email
    );

    await this.accountRepository.deleteById(id);

    return right();
  }

  async getProfile(id: number): Promise<
    Either<
      Error,
      {
        createdAt: string;
        email: string;
        login: string;
        name: string;
        type: string;
        updatedAt: string;
      }
    >
  > {
    const result = await this.accountRepository.getById(id);

    if (result === null) {
      return left(new Error("Falha ao buscar usuário"));
    }

    const { createdAt, email, login, name, type, updatedAt } = result;

    return right({ createdAt, email, login, name, type, updatedAt });
  }
}
