import { AccountRepository } from "../../../../infra/database/postgres/repositories/account-repository";
import { IDateProvider } from "../../../../infra/dateprovider/protocols/dateprovider";
import env from "../../../../server/http/env";
import { Either, left, right } from "../../../../shared/Either";
import { TokenProvider } from "../authentication/ports/token-provider";
import { SendEmailToUser } from "../send-email-to-user/send-email-to-user";
import { AccountEmailNotFound } from "../sign-up/errors/user-email-not-found";

import { v4 as uuidV4 } from "uuid";

export class ForgotPassword {
  private readonly accountRepository: AccountRepository;
  private readonly sendEmailToUser: SendEmailToUser;
  private readonly dateProvider: IDateProvider;
  private readonly tokenProvider: TokenProvider;

  constructor(
    accountRepository: AccountRepository,
    sendEmailToUser: SendEmailToUser,
    dateProvider: IDateProvider,
    tokenProvider: TokenProvider
  ) {
    this.accountRepository = accountRepository;
    this.sendEmailToUser = sendEmailToUser;
    this.dateProvider = dateProvider;
    this.tokenProvider = tokenProvider;
  }
  async execute(email: string): Promise<Either<AccountEmailNotFound, string>> {
    // WARN: versão final não irá ter checagem por email, mas deverá trazer o usuário do banco
    const account = await this.accountRepository.loadByEmail(email);

    if (!account) {
      return left(new AccountEmailNotFound(email));
    }

    const token = await this.tokenProvider.sign(
      {
        accountId: account.id as number,
      },
      "1d"
    );

    // const exp_date = this.dateProvider.addHours(3);

    const port = env.port;

    const link = `http://localhost:${port}/api/login/password/reset?token=${token}`;

    const msg = `
      Você está recebendo esta mensagem por que você (ou alguém) solicitou a redefinição de senha da conta ${account.login} (login) do SEAI.<br>
      Por favor, clique no link abaixo ou copie e cole no seu navegador para completar o processo:<br><br>


      <a href="${link}">${link}</a><br><br>

      Se houver algum questionamento você pode entrar em contato com suporteseai@email.com <br>

      Se não reconhece a conta do SEAI  email@email.com, você pode clicar aqui para remover seu endereço de email dessa conta.<br><br>

      Obrigado<br>
      Equipe SEAI<br>

    `;

    console.log("ENVIANDO = ", account);
    await this.sendEmailToUser.send(
      {
        email: account.email,
      },
      {
        subject: "Bem vindo ao SEAI",
        text: "Recuperação de senha!",
        html: msg,
      }
    );

    return right(
      `Email de recuperação de senha enviado com sucesso para ${account.email}`
    );
  }
}
