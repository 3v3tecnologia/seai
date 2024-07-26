import { QueueProviderProtocol } from "../../../../../infra/queueProvider/queue.provider";
import { Either, left, right } from "../../../../../shared/Either";
import { UserRepositoryProtocol } from "../../infra/database/repository/protocol/user-repository";
import { UserNotFoundError } from "../../model/errors/user-not-found-error";
import { UserTypes } from "../../model/user";
import {
  AvailablesEmailServices
} from "../send-notification-to-user/send-notification-to-user";

export class ForgotPassword {
  private readonly accountRepository: UserRepositoryProtocol;
  private readonly queueProvider: QueueProviderProtocol;

  constructor(
    accountRepository: UserRepositoryProtocol,
    queueProvider: QueueProviderProtocol
  ) {
    this.accountRepository = accountRepository;
    this.queueProvider = queueProvider;
  }
  async execute(email: string): Promise<Either<UserNotFoundError, string>> {
    // WARN: versão final não irá ter checagem por email, mas deverá trazer o usuário do banco
    const account = await this.accountRepository.getByEmail(email);

    if (account == null || account.type === UserTypes.IRRIGANT) {
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

    return right(`Um email para rescuperação de senha será enviado em breve.`);
  }
}
