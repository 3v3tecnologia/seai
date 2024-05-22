import { Either, left, right } from "../../../../shared/Either";
import { User } from "../../../entities/user/user";
import {
  SystemModules,
  SystemModulesProps,
} from "../../../entities/user/user-modules-access";
import { Command } from "../../_ports/core/command";
import { Encoder } from "../../_ports/cryptography/encoder";
import { AccountRepositoryProtocol } from "../../_ports/repositories/account-repository";
import {
  AvailablesEmailServices,
  ScheduleUserAccountNotification,
} from "../send-notification-to-user/send-notification-to-user";
import { UserAlreadyExistsError } from "./errors/user-already-exists";
import { CreateUserDTO, CreateUserProtocol } from "./ports";
export class CreateUser extends Command implements CreateUserProtocol {
  private readonly accountRepository: AccountRepositoryProtocol;
  private readonly scheduleUserAccountNotification: ScheduleUserAccountNotification;
  private readonly encoder: Encoder;

  constructor(
    accountRepository: AccountRepositoryProtocol,
    scheduleUserAccountNotification: ScheduleUserAccountNotification,
    encoder: Encoder
  ) {
    super();
    this.accountRepository = accountRepository;
    this.scheduleUserAccountNotification = scheduleUserAccountNotification;
    this.encoder = encoder;
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


    const userHash = await this.encoder.hashInPbkdf2(user.email?.value as string, 100, 10, 'sha512')

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
