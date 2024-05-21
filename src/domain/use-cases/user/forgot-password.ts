import { Either, left, right } from "../../../shared/Either";
import { AccountRepositoryProtocol } from "../_ports/repositories/account-repository";
import {
  ScheduleUserAccountNotification,
} from "./send-notification-to-user";
import { UserNotFoundError } from '../errors/user-not-found';
import { AccountNotFoundError } from "./errors/user-account-not-found";
import { AvailablesEmailServices } from "../helpers/availables-notification-services";

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
      `Um email para rescuperação de senha será enviado em breve.`
    );
  }
}
