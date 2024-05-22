import {
  ScheduleUserAccountNotification,
} from "./send-notification-to-user";
import { AccountNotFoundError } from "../core/errors/user-account-not-found";
import { AvailablesEmailServices } from "../../../shared/core/availables-notification-services";
import { AccountRepositoryProtocol } from "../infra/repositories/protocol/user-repository";
import { Either, left, right } from "../../../shared/core/Either";

export class ForgotPassword {
  private readonly accountRepository: AccountRepositoryProtocol;
  private readonly scheduleUserAccountNotification: ScheduleUserAccountNotification;

  constructor(
    accountRepository: AccountRepositoryProtocol,
    scheduleUserAccountNotification: ScheduleUserAccountNotification
  ) {
    this.accountRepository = accountRepository;
    this.scheduleUserAccountNotification = scheduleUserAccountNotification;
  }
  async execute(email: string): Promise<Either<AccountNotFoundError, string>> {
    // WARN: versão final não irá ter checagem por email, mas deverá trazer o usuário do banco
    const account = await this.accountRepository.getByEmail(email);

    if (!account) {
      return left(new AccountNotFoundError());
    }

    await this.scheduleUserAccountNotification.schedule({
      user: {
        email: account.email as string,
        base64Code: Buffer.from(account.email as string).toString('base64')
      },
      templateName: AvailablesEmailServices.FORGOT_PASSWORD,
    });

    return right(
      `Um email para rescuperação de senha será enviado em breve.`
    );
  }
}
