import { Either, left, right } from "../../../shared/Either";
import { Encoder } from "../../../shared/ports/encoder";
import { Logger } from "../../../shared/utils/logger";
import { Email } from "../core/model/email";
import { UserLogin } from "../core/model/login";
import { UserName } from "../core/model/name";
import { UserPassword } from "../core/model/userPassword";

import { TASK_QUEUES } from "../../../shared/infra/queueProvider/helpers/queues";
import { MQProviderProtocol } from "../../../shared/infra/queueProvider/protocol/messageQueue.protocol";
import { InactivatedAccount } from "../core/errors/account-not-activated";
import { EmailAlreadyExists } from "../core/errors/email-already-exists";
import { LoginAlreadyExists } from "../core/errors/login-aready-exists";
import { UserNotFoundError } from "../core/errors/user-not-found-error";
import {
  UnmatchedPasswordError,
  WrongPasswordError
} from "../core/errors/wrong-password";
import { IrrigationUser } from "../core/model/irrigation-user";
import { IrrigationUserRepositoryProtocol } from "../infra/repository/protocol/irrigation-user.repository";
import { CreateIrrigationAccountDTO } from "./dto/user-account";
import { IIrrigationUserService } from "./protocols/irrigant-user";
import { IUserPreferencesServices } from "./protocols/user-settings";
import { IRRIGANT_WEB_PAGE_BASE_URL } from "../../../server/http/config/url";
import { TokenProvider } from "../infra/token-provider";
import { AuthServiceInput, AuthServiceOutput } from "./protocols/auth";


export class IrrigationUserService implements IIrrigationUserService {
  constructor(
    private readonly userRepository: IrrigationUserRepositoryProtocol,
    private readonly encoder: Encoder,
    private readonly tokenProvider: TokenProvider,
    private readonly queueProvider: MQProviderProtocol,
    private readonly userPreferencesServices: IUserPreferencesServices,
  ) { }

  async create(
    dto: CreateIrrigationAccountDTO.Input
  ): Promise<CreateIrrigationAccountDTO.Output> {

    const emailAlreadyExists = await this.userRepository.getByEmail(
      dto.email
    );

    if (!!emailAlreadyExists) {
      return left(new EmailAlreadyExists());
    }

    const existingLogin = await this.userRepository.getByLogin(dto.login);

    if (existingLogin) {
      return left(new LoginAlreadyExists());
    }

    if (dto.password !== dto.confirmPassword) {
      return left(new UnmatchedPasswordError());
    }

    const userOrError = IrrigationUser.create({
      email: dto.email,
      login: dto.login,
      name: dto.name,
      password: dto.password,
      confirmPassword: dto.confirmPassword,
    });

    if (userOrError.isLeft()) {
      return left(userOrError.value);
    }

    const userCode = this.encoder.generateRandomHexCode(16)

    const hashedPassword = await this.encoder.hash(dto.password);

    // TODO: deve passar todos os campos do 'account'
    const user_id = await this.userRepository.add({
      email: dto.email,
      login: dto.login,
      name: dto.name,
      code: userCode,
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

      await this.queueProvider.sendToQueue(TASK_QUEUES.USER_ACCOUNT_NOTIFICATION, {
        email: dto.email,
        redirect_url: `${IRRIGANT_WEB_PAGE_BASE_URL}/activate/${userCode}`,
      });
    }

    return right(
      `Usuário criado com sucessso, aguardando confirmação do cadastro.`
    );
  }

  async completeRegister(code: string): Promise<Either<Error, void>> {
    // const userEmailToString = base64Decode(code);

    const account = await this.userRepository.getUserByCode(code);

    if (account === null) {
      return left(new UserNotFoundError());
    }

    if (account.status === "registered") {
      return left(new Error("Operação inválida"));
    }

    await this.userRepository.updateUserStatus(
      account.id as number,
      "registered"
    );

    return right();
  }

  async forgotPassword(email: string): Promise<Either<Error, string>> {
    const account = await this.userRepository.getByEmail(
      email,
      "registered"
    );

    if (account == null || account.type == "pending") {
      return left(new UserNotFoundError());
    }

    await this.queueProvider.sendToQueue(TASK_QUEUES.USER_ACCOUNT_NOTIFICATION, {
      email: account.email,
      redirect_url: `${IRRIGANT_WEB_PAGE_BASE_URL}/reset-password/${account.code}`,
    });


    return right(`Um email para recuperação de senha será enviado em breve.`);
  }

  async login({
    login,
    password,
  }: AuthServiceInput): Promise<
    AuthServiceOutput
  > {
    const account = Email.validate(login) ? await this.userRepository.getByEmail(login, 'registered') : await this.userRepository.getByLogin(login, 'registered')

    if (!account) {
      return left(new UserNotFoundError());
    }

    if (account.status === "pending") {
      return left(new InactivatedAccount());
    }

    const isMatch = await this.encoder.compare(
      password,
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

  async resetPassword(params: {
    code: string;
    password: string;
    confirmPassword: string;
  }): Promise<Either<Error, void>> {
    const { code, confirmPassword, password } = params;

    if (!code) {
      return left(new Error("Código não informado"));
    }

    const account = await this.userRepository.getUserByCode(
      code,
      "registered"
    );

    if (account === null) {
      return left(new UserNotFoundError());
    }

    if (account.type === "pending") {
      return left(new InactivatedAccount());
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

    await this.userRepository.updateUserPassword(
      account.id as number,
      account.password
    );

    return right();
  }

  async updateProfile(request: {
    id: number;
    email?: string;
    login: string;
    name: string;
    password?: string;
    confirmPassword?: string;
  }): Promise<Either<Error, string>> {
    const userAccount = await this.userRepository.getById(
      request.id as number
    );

    if (userAccount === null) {
      return left(new UserNotFoundError());
    }

    if (userAccount.type === "pending") {
      return left(new InactivatedAccount());
    }

    const existingLogin = await this.userRepository.getByLogin(
      request.login
    );

    if (existingLogin && existingLogin.id !== request.id) {
      return left(new LoginAlreadyExists());
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
      const existingAccount = await this.userRepository.getByEmail(
        request.email
      );

      if (existingAccount) {
        if (existingAccount.id !== request.id) {
          return left(new EmailAlreadyExists());
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

    await this.userRepository.update(toUpdate);

    return right(`Usuário atualizado com sucesso.`);
  }

  async deleteAccount(id: number): Promise<Either<Error, void>> {
    const account = await this.userRepository.getById(id);

    if (account === null) {
      return left(new UserNotFoundError());
    }
    await this.userPreferencesServices.removeUserNotificationsPreferences(
      id,
      account.email
    );

    await this.userRepository.deleteById(id);

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
    const result = await this.userRepository.getById(id);

    if (result === null) {
      return left(new Error("Falha ao buscar usuário"));
    }

    const { createdAt, email, login, name, type, updatedAt } = result;

    return right({ createdAt, email, login, name, type, updatedAt });
  }
}
