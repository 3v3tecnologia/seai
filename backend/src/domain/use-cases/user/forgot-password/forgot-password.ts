import { AccountRepository } from "../../../../infra/database/postgres/repositories/account-repository";
import { Either, left, right } from "../../../../shared/Either";
import { MailServiceError } from "../../errors/mail-service-error";
import { SendEmailToUser } from "../send-email-to-user/send-email-to-user";
import { AccountEmailNotFound } from "../sign-up/errors/user-email-not-found";

export class ForgotPassword {
  private readonly accountRepository: AccountRepository;
  private readonly sendEmailToUser: SendEmailToUser;

  constructor(
    accountRepository: AccountRepository,
    sendEmailToUser: SendEmailToUser
  ) {
    this.accountRepository = accountRepository;
    this.sendEmailToUser = sendEmailToUser;
  }
  async execute(
    email: string
  ): Promise<Either<AccountEmailNotFound | MailServiceError, string>> {
    // WARN: versão final não irá ter checagem por email, mas deverá trazer o usuário do banco
    const account = await this.accountRepository.loadByEmail(email);

    if (!account) {
      return left(new AccountEmailNotFound(email));
    }

    const token = "asAxnZsd2d12sas123#@$sdasdz11";

    const msg = `
      Você está recebendo esta mensagem por que você (ou alguém) solicitou a redefinição de senha da conta ${account.login} (login) do SEAI.<br>
      Por favor, clique no link abaixo ou copie e cole no seu navegador para completar o processo:<br><br>


      <a href="http://seai.com/create-user-account?action=verify&token=${token}">http://seai.com/create-user-account?action=verify&token=${token}</a><br><br>

      Se houver algum questionamento você pode entrar em contato com suporteseai@email.com <br>

      Se não reconhece a conta do SEAI  email@email.com, você pode clicar aqui para remover seu endereço de email dessa conta.<br><br>

      Obrigado<br>
      Equipe SEAI<br>

    `;

    return await this.sendEmailToUser.send(
      {
        email: account.email.value,
      },
      {
        subject: "Bem vindo ao SEAI",
        text: "Recuperação de senha!",
        html: msg,
      }
    );
  }
}
