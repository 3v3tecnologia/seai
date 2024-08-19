import { Either, left, right } from "../../../../shared/Either";
import { Encoder } from "../../../../shared/ports/encoder";
import { base64Decode } from "../../../../shared/utils/base64Encoder";
import { Email } from "../../lib/model/email";
import { UserLogin } from "../../lib/model/login";
import { UserName } from "../../lib/model/name";
import { UserPassword } from "../../lib/model/userPassword";

import { TokenProvider } from "../../lib/infra/token-provider";

import { PUBLIC_ASSETS_BASE_URL } from "../../../../server/http/config/url";
import { TASK_QUEUES } from "../../../../shared/infra/queueProvider/helpers/queues";
import { TaskSchedulerProviderProtocol } from "../../../../shared/infra/queueProvider/protocol/jog-scheduler.protocol";
import { Optional } from "../../../../shared/optional";
import { IPaginationInput } from "../../../../shared/utils/pagination";
import { UserCommandOperationProps } from "../../../Logs/protocols/logger";
import { UserAlreadyRegisteredError } from "../../lib/errors/already-registered";
import { FailToDeleteUserError } from "../../lib/errors/fail-to-delete-user-error";
import { UserModulesNotFound } from "../../lib/errors/invalid-modules";
import { LoginAlreadyExists } from "../../lib/errors/login-aready-exists";
import { UserAlreadyExistsError } from "../../lib/errors/user-already-exists";
import { UserNotFoundError } from "../../lib/errors/user-not-found-error";
import { WrongPasswordError } from "../../lib/errors/wrong-password";
import {
  UserAccountProps,
  UserRepositoryProtocol,
} from "../infra/database/repository/protocol/user-repository";
import { User, UserType, UserTypes } from "../model/user";
import {
  SystemModules,
  SystemModulesProps,
} from "../model/user-modules-access";
import { IUserService } from "./user.service.procotol";
import { InactivatedAccount } from "../../lib/errors/account-not-activated";
import { EmailAlreadyExists } from "../../lib/errors/email-already-exists";

export class GovernmentUserService implements IUserService {
  constructor(
    private readonly accountRepository: UserRepositoryProtocol,
    private readonly encoder: Encoder,
    private readonly tokenProvider: TokenProvider,
    private readonly queueProvider: TaskSchedulerProviderProtocol
  ) {
    this.accountRepository = accountRepository;
    this.encoder = encoder;
    this.tokenProvider = tokenProvider;
    this.queueProvider = queueProvider;
  }
  async getSystemModules(): Promise<
    Either<Error, Array<{ id: number; name: string }>>
  > {
    return right(await this.accountRepository.getModules());
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
    const existingUser = await this.accountRepository.getByEmail(
      request.email,
      [UserTypes.ADMIN, UserTypes.STANDARD]
    );

    if (existingUser) {
      return left(new UserAlreadyExistsError());
    }

    // validar se os módulos existem mesmo
    const modules = await this.accountRepository.getModules();

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

    const userCode = await this.encoder.hashInPbkdf2(
      userEmail,
      100,
      10,
      "sha512"
    );

    const user_id = await this.accountRepository.add(
      {
        email: userEmail,
        type: user.type,
        modules: user.access?.value as SystemModulesProps,
        code: userCode as string,
      },
      author
    );

    if (user_id) {
      const base64Code = Buffer.from(userEmail).toString("base64");
      await this.queueProvider.send(TASK_QUEUES.USER_ACCOUNT_NOTIFICATION, {
        email: userEmail,
        redirect_url: `${PUBLIC_ASSETS_BASE_URL}/initial-register-infos/${base64Code}`,
        action: "create-user-account",
      });
    }

    return right(
      `Usuário criado com sucessso, aguardando confirmação do cadastro.`
    );
  }

  async login({
    login,
    password,
    email,
  }: {
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
    const account = login
      ? await this.accountRepository.getByLogin(login)
      : await this.accountRepository.getByEmail(email as string);

    if (!account) {
      return left(new UserNotFoundError());
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

  //
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
    const userEmailToString = base64Decode(user.code);

    const account = await this.accountRepository.getByEmail(userEmailToString, [
      UserTypes.ADMIN,
      UserTypes.STANDARD,
    ]);

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

    const existingUser = await this.accountRepository.getByLogin(login, [
      UserTypes.ADMIN,
      UserTypes.STANDARD,
    ]);

    if (existingUser) {
      return left(new LoginAlreadyExists());
    }

    const name = userNameOrError.value?.value as string;
    const password = passwordOrError.value?.value as string;

    const hashedPassword = await this.encoder.hash(password);

    const isUpdated = await this.accountRepository.update({
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
    // WARN: versão final não irá ter checagem por email, mas deverá trazer o usuário do banco
    const account = await this.accountRepository.getByEmail(email);

    if (account == null || account.type === "irrigant") {
      return left(new UserNotFoundError());
    }

    const base64Code = Buffer.from(account.email).toString("base64");

    await this.queueProvider.send(TASK_QUEUES.USER_ACCOUNT_NOTIFICATION, {
      email: account.email,
      redirect_url: `${PUBLIC_ASSETS_BASE_URL}/account/reset-password/${base64Code}`,
      action: "forgot-user-account",
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

    return right();
  }

  async deleteUser(
    request: { id?: number; email?: string },
    operation: UserCommandOperationProps
  ): Promise<Either<UserNotFoundError | FailToDeleteUserError, string>> {
    let account = null;

    if (request.email) {
      account = await this.accountRepository.getByEmail(request.email);
    } else if (request.id) {
      account = await this.accountRepository.getById(request.id);
    }

    if (account === null) {
      return left(new UserNotFoundError());
    }

    const result = await this.accountRepository.deleteById(
      account.id as number,
      {
        author: operation.author,
        operation: operation.operation,
      }
    );

    if (result === false) {
      return left(new FailToDeleteUserError());
    }

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
    const result = await this.accountRepository.getById(id);

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
    const userAccount = await this.accountRepository.getById(request.id);

    if (userAccount == null) {
      return left(new UserNotFoundError());
    }

    if (request.login) {
      const existingAccount = await this.accountRepository.getByLogin(
        request.login,
        [UserTypes.ADMIN, UserTypes.STANDARD]
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
      const existingAccount = await this.accountRepository.getByEmail(
        request.email,
        [UserTypes.ADMIN, UserTypes.STANDARD]
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

    await this.accountRepository.update(toUpdate);

    return right(`Usuário atualizado com sucesso.`);
  }

  async getUsers(
    request: {
      id?: number;
      name?: string;
      type?: Record<UserTypes, string>;
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
        await this.accountRepository.getUserById(Number(request.id))
      );
    }

    return right(
      await this.accountRepository.list(
        request as {
          name?: string | undefined;
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
    const existingAccount = await this.accountRepository.getById(request.id);

    if (existingAccount === null) {
      return left(new UserNotFoundError());
    }

    if (existingAccount.type === "admin" && request.type !== "admin") {
      return left(
        new Error("Não é possível alterar o tipo de um usuário administrador")
      );
    }

    if (request.email) {
      const existingAccount = await this.accountRepository.getByEmail(
        request.email,
        [UserTypes.ADMIN, UserTypes.STANDARD]
      );

      if (existingAccount) {
        if (existingAccount.id !== request.id) {
          return left(new EmailAlreadyExists());
        }
      }
    }

    const modules = await this.accountRepository.getModules();

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

    const userToPersistency = {
      id: user.id as number,
      email: user.email ? (user.email.value as string) : null,
      login: user.login ? (user.login.value as string) : null,
      type: user.type ? (user.type as string) : null,
      name: user.name ? (user.name.value as string) : null,
      modules: user.access ? user.access.value : null,
    };

    if (user.password) {
      const hashedPassword = await this.encoder.hash(user.password.value);

      Object.assign(userToPersistency, {
        password: hashedPassword,
      });
    }
    // TODO: deve passar todos os campos do 'account'
    await this.accountRepository.update(userToPersistency, operation);

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
    const access = await this.accountRepository.getUserById(userId);
    return right(access);
  }
}
