import { Either, left, right } from "../../../../../shared/Either";
import { UserRepositoryProtocol } from "../../infra/database/repository/protocol/user-repository";
import { UserTypes } from "../../model/user";
import { UserNotFoundError } from "../../model/errors/user-not-found-error";
import {
  AvailablesEmailServices,
  ScheduleUserAccountNotification,
} from "../send-notification-to-user/send-notification-to-user";

export class ForgotPassword {
  private readonly accountRepository: UserRepositoryProtocol;
  private readonly scheduleUserAccountNotification: ScheduleUserAccountNotification;

  constructor(
    accountRepository: UserRepositoryProtocol,
    scheduleUserAccountNotification: ScheduleUserAccountNotification
  ) {
    this.accountRepository = accountRepository;
    this.scheduleUserAccountNotification = scheduleUserAccountNotification;
  }
  async execute(email: string): Promise<Either<UserNotFoundError, string>> {
    // WARN: versão final não irá ter checagem por email, mas deverá trazer o usuário do banco
    const account = await this.accountRepository.getByEmail(email);

    if (account == null || account.type === UserTypes.IRRIGANT) {
      return left(new UserNotFoundError());
    }

    // TO-DO: change to a specific queue
    await this.scheduleUserAccountNotification.schedule({
      user: {
        email: account.email,
        base64Code: Buffer.from(account.email).toString("base64"),
      },
      templateName: AvailablesEmailServices.FORGOT_PASSWORD,
    });

    return right(`Um email para rescuperação de senha será enviado em breve.`);
  }
}
