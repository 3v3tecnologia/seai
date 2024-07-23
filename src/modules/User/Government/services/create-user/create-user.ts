import { Encoder } from "../../../../../domain/use-cases/_ports/cryptography/encoder";
import { AccountRepositoryProtocol } from "../../infra/database/repository/protocol/user-repository";
import { Either, left, right } from "../../../../../shared/Either";
import { User, UserTypes } from "../../model/user";
import {
  SystemModules,
  SystemModulesProps,
} from "../../model/user-modules-access";
import {
  AvailablesEmailServices,
  ScheduleUserAccountNotification,
} from "../send-notification-to-user/send-notification-to-user";
import { UserAlreadyExistsError } from "./errors/user-already-exists";
import { CreateUserDTO } from "./ports";

export class CreateUser {
  private readonly accountRepository: AccountRepositoryProtocol;
  private readonly scheduleUserAccountNotification: ScheduleUserAccountNotification;
  private readonly encoder: Encoder;

  constructor(
    accountRepository: AccountRepositoryProtocol,
    scheduleUserAccountNotification: ScheduleUserAccountNotification,
    encoder: Encoder
  ) {
    this.accountRepository = accountRepository;
    this.scheduleUserAccountNotification = scheduleUserAccountNotification;
    this.encoder = encoder;
  }
  async create(
    request: CreateUserDTO.Params
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

    const user_id = await this.accountRepository.add({
      email: userEmail,
      type: user.type,
      modules: user.access?.value as SystemModulesProps,
      code: userCode as string,
    });

    if (user_id) {
      // const exp_date = this.dateProvider.addHours(3);

      const notificationSuccessOrError =
        await this.scheduleUserAccountNotification.schedule({
          user: {
            email: userEmail,
            base64Code: Buffer.from(userEmail).toString("base64"),
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
