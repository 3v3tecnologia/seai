import { TaskSchedulerProviderProtocol } from "../../../../../infra/queueProvider/protocol/jog-scheduler.protocol";
import { Either, left, right } from "../../../../../shared/Either";
import { UserRepositoryProtocol } from "../../infra/database/repository/protocol/user-repository";
import { UserNotFoundError } from "../../../core/model/errors/user-not-found-error";
import { UserTypes } from "../../../core/model/user";
import { TASK_QUEUES } from "../../../../../infra/queueProvider/helpers/queues";
import { PUBLIC_ASSETS_BASE_URL } from "../../../../../server/http/config/url";

export class ForgotPassword {
  private readonly accountRepository: UserRepositoryProtocol;
  private readonly queueProvider: TaskSchedulerProviderProtocol;

  constructor(
    accountRepository: UserRepositoryProtocol,
    queueProvider: TaskSchedulerProviderProtocol
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

    const base64Code = Buffer.from(account.email).toString("base64");

    await this.queueProvider.send(TASK_QUEUES.USER_ACCOUNT_NOTIFICATION, {
      email: account.email,
      redirect_url: `${PUBLIC_ASSETS_BASE_URL}/account/reset-password/${base64Code}`,
      action: "forgot-user-account",
    });

    return right(`Um email para rescuperação de senha será enviado em breve.`);
  }
}
