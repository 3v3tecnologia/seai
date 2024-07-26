import { Encoder } from "../../../../../domain/use-cases/_ports/cryptography/encoder";
import { QueueProviderProtocol } from "../../../../../infra/queueProvider/queue.provider";
import { Either, left, right } from "../../../../../shared/Either";
import { UserRepositoryProtocol } from "../../infra/database/repository/protocol/user-repository";
import { UserAlreadyExistsError } from "../../model/errors/user-already-exists";
import { User, UserTypes } from "../../model/user";
import {
  SystemModules,
  SystemModulesProps,
} from "../../model/user-modules-access";
import {
  AvailablesEmailServices
} from "../send-notification-to-user/send-notification-to-user";
import { CreateUserDTO } from "./ports";

export class CreateUser {
  private readonly accountRepository: UserRepositoryProtocol;
  private readonly queueProvider: QueueProviderProtocol;
  private readonly encoder: Encoder;

  constructor(
    accountRepository: UserRepositoryProtocol,
    queueProvider: QueueProviderProtocol,
    encoder: Encoder
  ) {
    this.accountRepository = accountRepository;
    this.queueProvider = queueProvider;
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

        await this.queueProvider.queue({
          name: "user-account-notification",
          priority: 1,
          retryDelay: 60,
          retryLimit: 3,
          data: {
            email: userEmail,
            base64Code: Buffer.from(userEmail).toString("base64"),
            templateName: AvailablesEmailServices.CREATE_ACCOUNT
          },
    })

    }

    return right(
      `Usuário criado com sucessso, aguardando confirmação do cadastro.`
    );
  }
}
