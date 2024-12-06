import { Either, left, right } from "../../../shared/Either";
import { Encoder } from "../../../shared/ports/encoder";
import { Email } from "../core/model/email";
import { UserLogin } from "../core/model/login";
import { UserName } from "../core/model/name";
import { UserPassword } from "../core/model/userPassword";


import { TASK_QUEUES } from "../../../shared/infra/queueProvider/helpers/queues";
import { MQProviderProtocol } from "../../../shared/infra/queueProvider/protocol/messageQueue.protocol";
import { Optional } from "../../../shared/optional";
import { IPaginationInput } from "../../../shared/utils/pagination";
import { UserCommandOperationProps } from "../../Logs/core/protocols/logger";
import { InactivatedAccount } from "../core/errors/account-not-activated";
import { UserAlreadyRegisteredError } from "../core/errors/already-registered";
import { EmailAlreadyExists } from "../core/errors/email-already-exists";
import { FailToDeleteUserError } from "../core/errors/fail-to-delete-user-error";
import { UserModulesNotFound } from "../core/errors/invalid-modules";
import { LoginAlreadyExists } from "../core/errors/login-aready-exists";
import { UserAlreadyExistsError } from "../core/errors/user-already-exists";
import { UserNotFoundError } from "../core/errors/user-not-found-error";
import { WrongPasswordError } from "../core/errors/wrong-password";
import { User, UserType, UserTypes } from "../core/model/gov-user";
import {
  SystemModules,
  SystemModulesProps
} from "../core/model/user-modules-access";
import {
  UserAccountProps,
  UserRepositoryProtocol,
} from "../infra/repository/protocol/gov-user-repository";
import { IUserService } from "./protocols/gov-user";
import { GOVERNMENT_WEB_PAGE_BASE_URL } from "../../../server/http/config/url";
import { AuthServiceInput, AuthServiceOutput } from "./protocols/auth";
import { TokenProvider } from "../infra/token-provider";
import { UserStatus } from "../core/model/status";


export class GovernmentUserService implements IUserService {
  constructor(
    private readonly userRepository: UserRepositoryProtocol,
    private readonly encoder: Encoder,
    private readonly tokenProvider: TokenProvider,
    private readonly queueProvider: MQProviderProtocol,
  ) { }

  async getSystemModules(): Promise<
    Either<Error, Array<{ id: number; name: string }>>
  > {
    return right(await this.userRepository.getModules());
  }


  private isGovUser(type: string) {
    return [UserTypes.ADMIN, UserTypes.STANDARD].some((item) => item === type)
  }

  async create(
    request: {
      email: string;
      type: UserType;
      modules: SystemModulesProps;
    },
    author: number
  ): Promise<Either<UserAlreadyExistsError | Error, string>> {
    // TO DO: verificar o caso de criar o usuário mas o email não ter sido enviado para tal destinatário
    const existingUser = await this.userRepository.checkIfEmailAlreadyExists(request.email);

    if (existingUser) {
      return left(new UserAlreadyExistsError());
    }

    // validar se os módulos existem mesmo
    const modules = await this.userRepository.getModules();

    if (!modules) {
      return left(new Error("Não há módulos de acesso cadastrado"));
    }

    const hasValidModulesOrError = SystemModules.checkIfModuleExists(
      request.modules,
      modules
    );

    if (hasValidModulesOrError.isLeft()) {
      return left(hasValidModulesOrError.value);
    }

    const userOrError = User.create({
      email: request.email,
      type: request.type,
      modulesAccess: request.modules,
    });

    if (userOrError.isLeft()) {
      return left(userOrError.value);
    }

    const user = userOrError.value as User;

    const userEmail = user.email?.value as string;

    const userCode = this.encoder.generateRandomHexCode(16)

    const user_id = await this.userRepository.add(
      {
        email: userEmail,
        type: user.type,
        modules: user.access?.value as SystemModulesProps,
        code: userCode,
      },
      author
    );

    if (user_id) {
      await this.queueProvider.sendToQueue(TASK_QUEUES.USER_ACCOUNT_NOTIFICATION, {
        email: userEmail,
        redirect_url: `${GOVERNMENT_WEB_PAGE_BASE_URL}/initial-register-infos/${userCode}`,
      });
    }

    return right(
      `Usuário criado com sucessso, aguardando confirmação do cadastro.`
    );
  }

  async completeRegister(user: {
    code: string;
    name: string;
    login: string;
    password: string;
    confirmPassword: string;
  }): Promise<
    Either<
      | UserNotFoundError
      | WrongPasswordError
      | LoginAlreadyExists
      | UserModulesNotFound,
      string
    >
  > {
    // Decode user code to base64

    const account = await this.userRepository.getUserByCode(user.code);

    if (account === null) {
      return left(new UserNotFoundError());
    }

    if (account.status === "registered") {
      return left(new UserAlreadyRegisteredError());
    }

    const userLoginOrError = UserLogin.create(user.login);
    const userNameOrError = UserName.create(user.name);

    if (userLoginOrError.isLeft()) {
      return left(userLoginOrError.value);
    }

    if (userNameOrError.isLeft()) {
      return left(userNameOrError.value);
    }

    const passwordOrError = UserPassword.create({
      value: user.password,
      confirm: user.confirmPassword,
      isHashed: false,
    });

    if (passwordOrError.isLeft()) {
      return left(passwordOrError.value);
    }

    const login = userLoginOrError.value?.value as string;

    const existingUser = await this.userRepository.getByLogin(login);

    if (existingUser) {
      return left(new LoginAlreadyExists());
    }

    const name = userNameOrError.value?.value as string;
    const password = passwordOrError.value?.value as string;

    const hashedPassword = await this.encoder.hash(password);

    const isUpdated = await this.userRepository.update({
      code: account.code,
      login: login,
      name: name,
      password: hashedPassword,
    });

    if (isUpdated) {
      return right(`Sucesso ao completar cadastro de usuário`);
    }

    return left(new Error("Não foi possível completar o cadastro do usuário."));
  }

  async forgotPassword(email: string): Promise<Either<Error, string>> {
    const account = await this.userRepository.getByEmail(
      email,
      "registered"
    );

    if (account == null || account.type === "irrigant") {
      return left(new UserNotFoundError());
    }

    await this.queueProvider.sendToQueue(TASK_QUEUES.USER_ACCOUNT_NOTIFICATION, {
      email: account.email,
      redirect_url: `${GOVERNMENT_WEB_PAGE_BASE_URL}/change-password/${account.code}`,
    });

    return right(`Um email para rescuperação de senha será enviado em breve.`);
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
  }): Promise<Either<Error, null>> {
    const { code, confirmPassword, password } = params;

    if (!code) {
      return left(new Error("Código não informado"));
    }

    // const userEmailToString = base64Decode(code);

    const account = await this.userRepository.getUserByCode(code);

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

    await this.userRepository.updateUserPassword(
      account.id as number,
      account.password
    );

    return right();
  }

  async deleteUser(
    request: { id?: number; email?: string },
    operation: UserCommandOperationProps
  ): Promise<Either<UserNotFoundError | FailToDeleteUserError, string>> {
    let account = null;

    if (request.email) {
      account = await this.userRepository.getByEmail(request.email);
    } else if (request.id) {
      account = await this.userRepository.getById(request.id);
    }

    if (account === null) {
      return left(new UserNotFoundError());
    }

    await this.userRepository.deleteById(
      account.id as number,
      {
        author: operation.author,
        operation: operation.operation,
      }
    );


    return right("Usuário deletado com sucesso");
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

  async updateProfile(request: {
    id: number;
    email?: string;
    login: string;
    name: string;
    password?: string;
    confirmPassword?: string;
  }): Promise<Either<UserNotFoundError | LoginAlreadyExists, string>> {
    const userAccount = await this.userRepository.getById(request.id);

    if (userAccount == null) {
      return left(new UserNotFoundError());
    }

    if (request.login) {
      const existingAccount = await this.userRepository.getByLogin(
        request.login
      );

      if (existingAccount) {
        if (existingAccount.id !== request.id) {
          return left(new LoginAlreadyExists());
        }
      }
    }

    if (userAccount.type === "pending") {
      return left(new InactivatedAccount());
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

    if (Reflect.has(request, "password")) {
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

    if (request.email) {
      const existingAccount = await this.userRepository.getByEmail(
        request.email
      );

      if (existingAccount) {
        if (existingAccount.id !== request.id && this.isGovUser(existingAccount.type)) {
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

  async getUsers(
    request: {
      id?: number;
      name?: string;
      type?: Record<UserTypes, string>;
      status?: UserStatus;
    } & Partial<IPaginationInput>
  ): Promise<
    Either<
      Error,
      | Optional<UserAccountProps, "id" | "name" | "code" | "status" | "login">
      | any
    >
  > {
    if (request?.id) {
      return right(
        await this.userRepository.getUserById(Number(request.id))
      );
    }


    return right(
      await this.userRepository.list(
        request as {
          name?: string | undefined;
          status?: UserStatus | undefined;
          type?: Record<UserTypes, string> | undefined;
        } & IPaginationInput
      )
    );
  }

  async updateUser(
    request: {
      id: number;
      email: string;
      type: UserType;
      name: string;
      login: string;
      modules?: SystemModulesProps;
    },
    operation: UserCommandOperationProps
  ): Promise<
    Either<UserNotFoundError | WrongPasswordError | LoginAlreadyExists, string>
  > {
    const existingAccount = await this.userRepository.getById(request.id);

    if (existingAccount === null) {
      return left(new UserNotFoundError());
    }

    if (existingAccount.type === "admin" && request.type !== "admin") {
      return left(
        new Error("Não é possível alterar o tipo de um usuário administrador")
      );
    }

    if (request.email) {
      const existingAccount = await this.userRepository.getByEmail(
        request.email
      );

      if (existingAccount && this.isGovUser(existingAccount.type)) {
        if (existingAccount.id !== request.id) {
          return left(new EmailAlreadyExists());
        }
      }
    }

    const modules = await this.userRepository.getModules();

    const userPermissionType = request.type;

    const createUserDTO = {
      email: request.email,
      type: userPermissionType,
      login: request.login,
      name: request.name,
      modulesAccess: null,
    };

    if (request.modules) {
      const hasValidModulesOrError = SystemModules.checkIfModuleExists(
        request.modules,
        modules
      );

      if (hasValidModulesOrError.isLeft()) {
        return left(hasValidModulesOrError.value);
      }

      Object.assign(createUserDTO, {
        modulesAccess: request.modules,
      });
    }

    // TODO: add validation in controller
    // if (Reflect.has(request, "password") && request.password !== null) {
    //   Object.assign(createUserDTO, {
    //     password: request.password,
    //     confirmPassword: request.confirmPassword,
    //   });
    // }

    const userAccountOrError = User.create(createUserDTO, request.id);

    if (userAccountOrError.isLeft()) {
      return left(userAccountOrError.value);
    }

    const user = userAccountOrError.value as User;

    let userModules = null

    if (user.access) {
      /**
       * TO-DO: Avoid using this function
      */
      delete user.access.value.logs

      userModules = user.access.value
    }

    const userToPersistency = {
      id: user.id as number,
      email: user.email ? (user.email.value as string) : null,
      login: user.login ? (user.login.value as string) : null,
      type: user.type ? (user.type as string) : null,
      name: user.name ? (user.name.value as string) : null,
      modules: userModules,
    };

    if (user.password) {
      const hashedPassword = await this.encoder.hash(user.password.value);

      Object.assign(userToPersistency, {
        password: hashedPassword,
      });
    }
    // TODO: deve passar todos os campos do 'account'
    await this.userRepository.update(userToPersistency, operation);

    return right(`Usuário atualizado com sucesso.`);
  }

  async getUserById(
    userId: number
  ): Promise<
    Either<
      Error,
      Optional<
        UserAccountProps,
        "id" | "name" | "code" | "status" | "login"
      > | null
    >
  > {
    const user = await this.userRepository.getUserById(userId);

    return right(user);
  }
}
