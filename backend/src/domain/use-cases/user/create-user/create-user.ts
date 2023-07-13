import env from "../../../../server/http/env";
import { Email } from "../../../entities/user/email";
import { User } from "../../../entities/user/user";
import { SystemModules } from "../../../entities/user/user-modules-access";
import { Command } from "../../_ports/core/command";
import { IDateProvider } from "../../_ports/date-provider/date-provider";
import { AccountRepositoryProtocol } from "../../_ports/repositories/account-repository";
import { TokenProvider } from "../authentication/ports/token-provider";
import { SendEmailToUser } from "../send-email-to-user/send-email-to-user";
import { Either, left, right } from "./../../../../shared/Either";
import { UserAlreadyExistsError } from "./errors/user-already-exists";
import { CreateUserDTO, CreateUserProtocol } from "./ports";

export class CreateUser extends Command implements CreateUserProtocol {
  private readonly accountRepository: AccountRepositoryProtocol;
  private readonly sendEmailToUser: SendEmailToUser;
  private readonly dateProvider: IDateProvider;
  private readonly tokenProvider: TokenProvider;

  constructor(
    accountRepository: AccountRepositoryProtocol,
    sendEmailToUser: SendEmailToUser,
    dateProvider: IDateProvider,
    tokenProvider: TokenProvider
  ) {
    super();
    this.accountRepository = accountRepository;
    this.sendEmailToUser = sendEmailToUser;
    this.dateProvider = dateProvider;
    this.tokenProvider = tokenProvider;
  }
  async create(
    request: CreateUserDTO.Params
  ): Promise<Either<UserAlreadyExistsError | Error, string>> {
    this.resetLog();
    // TO DO: verificar o caso de criar o usuário mas o email não ter sido enviado para tal destinatário
    const alreadyExists =
      await this.accountRepository.checkIfEmailAlreadyExists(request.email);

    if (alreadyExists) {
      return left(new UserAlreadyExistsError());
    }

    // validar se os módulos existem mesmo
    const modules = await this.accountRepository.getModules();

    if (!modules) {
      return left(new Error("Não há módulos de acesso cadastrado"));
    }

    const userModulesAccess = [
      request.modules.news_manager.id,
      request.modules.registers.id,
      request.modules.users_manager.id,
    ];

    // evitar ter que salvar usuário com módulos que não existem
    userModulesAccess.forEach((module) => {
      if (
        modules.some((module_access) => module_access.id === module) === false
      ) {
        return left(new Error("Módulos de acesso do usuário não existe"));
      }
    });

    const userOrError = User.create({
      email: request.email,
      type: request.type,
      modulesAccess: request.modules,
    });

    if (userOrError.isLeft()) {
      return left(userOrError.value);
    }

    const user = userOrError.value as User;

    const user_id = await this.accountRepository.add({
      email: user.email?.value as string,
      type: user.type,
      modules: user.access.value,
    });

    if (user_id) {
      const token = await this.tokenProvider.sign(
        {
          accountId: user_id as number,
        },
        "1d"
      );
      const exp_date = this.dateProvider.addHours(3);

      console.log("Adding :::", user);

      const port = env.port;

      const link = `http://localhost:${port}/api/login/password/reset?token=${token}`;

      // const token = "asAxnZsd2d12sas123#@$sdasdz11";
      const msg = `
      Você está recebendo esta mensagem por que você (ou alguém) criou uma conta no <b>SEAI</b> associada a esse e-mail.<br>
      Por favor, clique no link abaixo ou copie e cole no seu navegador para realizar o cadastro da sua conta de acesso:<br><br>

      <a href="http://seai.com/create-user-account?action=verify&token=${token}">http://seai.com/create-user-account?action=verify&token=${token}</a>
      <br><br>

      Se houver algum questionamento você pode entrar em contato com <b>suporteseai@email.com</b> <br><br>

      Se não reconhece a conta do SEAI <a href="mailto:${user.email?.value}">${user.email?.value}</a> , você pode <a href="https://www.google.com/">clicar aqui</a> para remover seu endereço de email dessa conta.<br><br>

      Obrigado <br>
      Equipe SEAI
    `;

      // TODO criar token e adicionar ao email
      await this.sendEmailToUser.send(
        {
          email: user.email?.value as string,
        },
        {
          subject: "Bem vindo ao SEAI",
          text: "Estou muito content de ter você por aqui!",
          html: msg,
        }
      );
    }

    this.addLog({
      action: "create",
      table: "User",
      description: `Usuário criado com sucessso, aguardando confirmação do cadastro`,
    });

    return right(
      `Sucesso ao criar usuário, email enviado com sucesso para ${user.email?.value}`
    );
  }
}
