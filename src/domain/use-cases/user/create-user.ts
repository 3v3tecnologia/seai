
import { Either, left, right } from "../../../shared/Either";
import { User, UserType } from "../../entities/user/user";
import {
  SystemModules,
  SystemModulesProps,
} from "../../entities/user/user-modules-access";
import { Command } from "../_ports/core/command";
import { AccountRepositoryProtocol } from "../_ports/repositories/account-repository";
import {
  ScheduleUserAccountNotification,
} from "./send-notification-to-user";
import { UserAlreadyExistsError } from "./errors/user-already-exists";
import { MailServiceError } from '../errors/mail-service-error';
import { AvailablesEmailServices } from '../helpers/availables-notification-services';
import { hashInPbkdf2 } from "../../../infra/cryptography/bcrypt-adapter";





export class CreateUser extends Command implements CreateUserProtocol {
  private readonly accountRepository: AccountRepositoryProtocol;
  private readonly scheduleUserAccountNotification: ScheduleUserAccountNotification;

  constructor(
    accountRepository: AccountRepositoryProtocol,
    scheduleUserAccountNotification: ScheduleUserAccountNotification,
  ) {
    super();
    this.accountRepository = accountRepository;
    this.scheduleUserAccountNotification = scheduleUserAccountNotification;
  }
  async create(
    request: CreateUserDTO.Params
  ): Promise<Either<UserAlreadyExistsError | Error, string>> {
    // TO DO: verificar o caso de criar o usuário mas o email não ter sido enviado para tal destinatário
    const alreadyExists =
      await this.accountRepository.checkIfEmailAlreadyExists(request.email);

    if (alreadyExists) {
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

    const salt = "89af61e3502242626b5ea5f54199126e"

    const iterations = 100;
    const keylen = 10;
    const digest = 'sha512';

    const userHash = await hashInPbkdf2(user.email?.value as string, salt, iterations, keylen, digest)

    const userEmail = user.email?.value as string

    const user_id = await this.accountRepository.add({
      email: userEmail,
      type: user.type,
      modules: user.access?.value as SystemModulesProps,
      code: userHash as string
    });

    if (user_id) {
      this.addLog({
        action: "create",
        table: "User",
        description: `Usuário criado com sucessso, aguardando confirmação do cadastro.`,
      });
      // const exp_date = this.dateProvider.addHours(3);

      const notificationSuccessOrError = await this.scheduleUserAccountNotification.schedule({
        user: {
          email: userEmail,
          base64Code: Buffer.from(userEmail).toString('base64')
        },
        templateName: AvailablesEmailServices.CREATE_ACCOUNT,
      });

      if (notificationSuccessOrError.isRight()) {
        console.log(notificationSuccessOrError.value);
      }
    }


    return right(
      `Usuário criado com sucessso, aguardando confirmação do cadastro.`
    );
  }
}

export interface CreateUserProtocol {
  create(
    user: CreateUserDTO.Params
  ): Promise<Either<UserAlreadyExistsError | MailServiceError, string>>;
}
export namespace CreateUserDTO {
  type system_modules_permissions = SystemModulesProps;

  export type Params = {
    email: string;
    type: UserType;
    modules: system_modules_permissions;
  };

  export type Result = string;
}
