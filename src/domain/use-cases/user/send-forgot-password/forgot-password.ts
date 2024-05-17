import { Either, left, right } from "../../../../shared/Either";
import { AccountRepositoryProtocol } from "../../_ports/repositories/account-repository";
import { UserNotFoundError } from "../delete-user/errors/user-not-found-error";
import {
  AvailablesEmailServices,
  ScheduleUserAccountNotification,
} from "../send-notification-to-user/send-notification-to-user";
import { AccountEmailNotFound } from "../sign-up/errors/user-email-not-found";

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
  async execute(email: string): Promise<Either<AccountEmailNotFound, string>> {
    // WARN: versão final não irá ter checagem por email, mas deverá trazer o usuário do banco
    const account = await this.accountRepository.getByEmail(email);

    if (!account) {
      return left(new UserNotFoundError());
    }

    await this.scheduleUserAccountNotification.schedule({
      user: {
        email: account.email,
        base64Code: Buffer.from(account.email).toString('base64')
      },
      templateName: AvailablesEmailServices.FORGOT_PASSWORD,
    });

    return right(
      `Email de recuperação de senha enviado com sucesso`
    );
  }
}
