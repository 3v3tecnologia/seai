import { Either, left, right } from "./../../../../shared/Either";
import { AccountRepository } from "../../../../infra/database/postgres/repositories/account-repository";
import { CreateUserProtocol, CreateUserDTO } from "./ports";
import { UserAlreadyExistsError } from "./errors/user-already-exists";
import { SendEmailToUser } from "../send-email-to-user/send-email-to-user";
import { MailServiceError } from "../../errors/mail-service-error";

export class CreateUser implements CreateUserProtocol {
  private readonly accountRepository: AccountRepository;
  private readonly sendEmailToUser: SendEmailToUser;

  constructor(
    accountRepository: AccountRepository,
    sendEmailToUser: SendEmailToUser
  ) {
    this.accountRepository = accountRepository;
    this.sendEmailToUser = sendEmailToUser;
  }
  async create(
    user: CreateUserDTO.Params
  ): Promise<Either<UserAlreadyExistsError, string>> {
    // TO DO: verificar o caso de criar o usuário mas o email não ter sido enviado para tal destinatário
    const alreadyExists = await this.accountRepository.checkByEmail(user.email);

    if (alreadyExists) {
      return left(new UserAlreadyExistsError());
    }

    console.log("Adding :::", user);
    await this.accountRepository.add(user);

    const token = "asAxnZsd2d12sas123#@$sdasdz11";
    const msg = `
      Você está recebendo esta mensagem por que você (ou alguém) criou uma conta no <b>SEAI</b> associada a esse e-mail.<br>
      Por favor, clique no link abaixo ou copie e cole no seu navegador para realizar o cadastro da sua conta de acesso:<br><br>

      <a href="http://seai.com/create-user-account?action=verify&token=${token}">http://seai.com/create-user-account?action=verify&token=${token}</a>
      <br><br>

      Se houver algum questionamento você pode entrar em contato com <b>suporteseai@email.com</b> <br><br>

      Se não reconhece a conta do SEAI <a href="mailto:${user.email}">${user.email}</a> , você pode <a href="https://www.google.com/">clicar aqui</a> para remover seu endereço de email dessa conta.<br><br>

      Obrigado <br>
      Equipe SEAI
    `;

    // TODO criar token e adicionar ao email
    await this.sendEmailToUser.send(
      {
        email: user.email,
      },
      {
        subject: "Bem vindo ao SEAI",
        text: "Estou muito content de ter você por aqui!",
        html: msg,
      }
    );

    console.log("Email enviado para o usuário...");
    return right(
      `Sucesso ao criar usuário, email enviado com sucesso para ${user.email}`
    );
  }
}
