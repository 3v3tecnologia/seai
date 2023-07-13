import { Either, left, right } from "../../../../shared/Either";
import { Command } from "../../_ports/core/command";
import { AccountRepositoryProtocol } from "../../_ports/repositories/account-repository";
import { FailToDeleteUserError } from "./errors/fail-to-delete-user-error";
import { UserNotFoundError } from "./errors/user-not-found-error";
import { DeleteUserProtocol } from "./protocol";

export class DeleteUser extends Command implements DeleteUserProtocol {
  private readonly accountRepository: AccountRepositoryProtocol;

  constructor(accountRepository: AccountRepositoryProtocol) {
    super();
    this.accountRepository = accountRepository;
  }
  async execute(
    user_id: number
  ): Promise<Either<UserNotFoundError | FailToDeleteUserError, string>> {
    this.resetLog();
    const account = await this.accountRepository.getById(user_id);

    if (account === null) {
      return left(new UserNotFoundError());
    }

    const result = await this.accountRepository.deleteById(
      account.id as number
    );

    if (result === false) {
      return left(new FailToDeleteUserError());
    }

    this.addLog({
      action: "delete",
      table: "User",
      description: `Usuário ${account.login} deletado com sucesso`,
    });

    return right("Usuário deletado com sucesso");
  }
}
