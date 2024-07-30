import { Encoder } from "../../../../../domain/use-cases/_ports/cryptography/encoder";
import { TASK_QUEUES } from "../../../../../infra/queueProvider/helpers/queues";
import { TaskSchedulerProviderProtocol } from "../../../../../infra/queueProvider/protocol/jog-scheduler.protocol";
import { PUBLIC_ASSETS_BASE_URL } from "../../../../../server/http/config/url";
import { Either, left, right } from "../../../../../shared/Either";
import { UserRepositoryProtocol } from "../../infra/database/repository/protocol/user-repository";
import { User, UserTypes } from "../../../core/model/user";
import {
  SystemModules,
  SystemModulesProps,
} from "../../../core/model/user-modules-access";
import { CreateUserDTO } from "./ports";
import { UserAlreadyExistsError } from "../../../core/errors/user-already-exists";
import { UserOperationsLoggerProtocol } from "../../../../UserOperations/protocols/logger";

export class CreateUser {
  constructor(
    private readonly accountRepository: UserRepositoryProtocol,
    private readonly queueProvider: TaskSchedulerProviderProtocol,
    private readonly encoder: Encoder,
    private readonly operationsLogger: UserOperationsLoggerProtocol
  ) {}

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

    await this.operationsLogger.save(request.accountId, request.description);

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
}
