import { Either, left, right } from "../../../../shared/Either";
import { AccountRepositoryProtocol } from "../../_ports/repositories/account-repository";
import { FailToDeleteUserError } from "./errors/fail-to-delete-user-error";
import { UserNotFoundError } from "./errors/user-not-found-error";

export class DeleteUser {
  private readonly accountRepository: AccountRepositoryProtocol;

  constructor(accountRepository: AccountRepositoryProtocol) {
    this.accountRepository = accountRepository;
  }
  async execute(
    user_id: number
  ): Promise<Either<UserNotFoundError | FailToDeleteUserError, string>> {
    console.log("Buscando usuário por id ", user_id);
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

    return right("Usuário deletado com sucesso");
  }
}
