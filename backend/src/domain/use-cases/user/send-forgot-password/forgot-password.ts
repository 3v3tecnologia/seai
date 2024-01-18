import env from "../../../../server/http/env";
import { Either, left, right } from "../../../../shared/Either";
import { IDateProvider } from "../../_ports/date-provider/date-provider";
import { AccountRepositoryProtocol } from "../../_ports/repositories/account-repository";
import { TokenProvider } from "../authentication/ports/token-provider";
import {
  AvailablesEmailServices,
  ScheduleUserAccountNotification,
} from "../send-notification-to-user/send-notification-to-user";
import { AccountEmailNotFound } from "../sign-up/errors/user-email-not-found";

export class ForgotPassword {
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
    this.accountRepository = accountRepository;
    this.scheduleUserAccountNotification = scheduleUserAccountNotification;
    this.dateProvider = dateProvider;
    this.tokenProvider = tokenProvider;
  }
  async execute(email: string): Promise<Either<AccountEmailNotFound, string>> {
    // WARN: versão final não irá ter checagem por email, mas deverá trazer o usuário do banco
    const account = await this.accountRepository.getByEmail(email);

    if (!account) {
      return left(new AccountEmailNotFound(email));
    }

    const token = await this.tokenProvider.sign(
      {
        accountId: account.id as number,
      },
      "1d"
    );

    await this.scheduleUserAccountNotification.schedule({
      user: {
        email: account.email,
        token,
      },
      action: AvailablesEmailServices.FORGOT_PASSWORD,
      subject: "Resetar senhar",
    });

    return right(
      `Email de recuperação de senha enviado com sucesso para ${account.email}`
    );
  }
}
