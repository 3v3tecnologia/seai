import env from "../../../../server/http/env";
import { User } from "../../../entities/user/user";
import {
  SystemModules,
  SystemModulesProps,
} from "../../../entities/user/user-modules-access";
import { Command } from "../../_ports/core/command";
import { IDateProvider } from "../../_ports/date-provider/date-provider";
import { AccountRepositoryProtocol } from "../../_ports/repositories/account-repository";
import { TokenProvider } from "../authentication/ports/token-provider";
import {
  AvailablesEmailServices,
  ScheduleUserAccountNotification,
} from "../send-notification-to-user/send-notification-to-user";
import { Either, left, right } from "../../../../shared/Either";
import { UserAlreadyExistsError } from "./errors/user-already-exists";
import { CreateUserDTO, CreateUserProtocol } from "./ports";

export class CreateUser extends Command implements CreateUserProtocol {
  private readonly accountRepository: AccountRepositoryProtocol;
  private readonly scheduleUserAccountNotification: ScheduleUserAccountNotification;
  private readonly dateProvider: IDateProvider;
  private readonly tokenProvider: TokenProvider;

  constructor(
    accountRepository: AccountRepositoryProtocol,
    scheduleUserAccountNotification: ScheduleUserAccountNotification,
    dateProvider: IDateProvider,
    tokenProvider: TokenProvider
  ) {
    super();
    this.accountRepository = accountRepository;
    this.scheduleUserAccountNotification = scheduleUserAccountNotification;
    this.dateProvider = dateProvider;
    this.tokenProvider = tokenProvider;
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

    const user_id = await this.accountRepository.add({
      email: user.email?.value as string,
      type: user.type,
      modules: user.access?.value as SystemModulesProps,
    });

    if (user_id) {
      const token = await this.tokenProvider.sign(
        {
          accountId: user_id as number,
        },
        "1d"
      );

      // const exp_date = this.dateProvider.addHours(3);

      // TODO criar token e adicionar ao email
      await this.scheduleUserAccountNotification.schedule({
        user: {
          email: user.email?.value as string,
          token,
        },
        subject: "Bem vindo ao SEAI",
        action: AvailablesEmailServices.CREATE_ACCOUNT,
      });
    }

    this.addLog({
      action: "create",
      table: "User",
      description: `Usuário criado com sucessso, aguardando confirmação do cadastro`,
    });

    return right(
      `Sucesso ao criar usuário, email enviado com sucesso para ${user.email?.value}`
    );
  }
}
