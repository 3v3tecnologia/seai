import { Either, left, right } from "../../../shared/Either";
import { Command } from "../../../shared/core/command";
import { AccountRepositoryProtocol } from "../../../domain/use-cases/_ports/repositories/account-repository";
import { UserNotFoundError } from "../../../domain/use-cases/errors/user-not-found";
import { FailToDeleteUserError } from "../core/errors/delete-user-error";

export class DeleteUser extends Command implements DeleteUserProtocol.UseCase {
  private readonly accountRepository: AccountRepositoryProtocol;

  constructor(accountRepository: AccountRepositoryProtocol) {
    super();
    this.accountRepository = accountRepository;
  }
  async execute(
    request: DeleteUserProtocol.Request
  ): Promise<Either<UserNotFoundError | FailToDeleteUserError, string>> {
    console.log('request :: ', request);
    let account = null;

    if (request.email) {
      account = await this.accountRepository.getByEmail(request.email);
    } else if (request.id) {
      account = await this.accountRepository.getById(request.id);
    }

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
      description: `Usuário deletado com sucesso`,
    });

    return right("Usuário deletado com sucesso");
  }
}

export namespace DeleteUserProtocol {
  export type Request = {
    id?: number;
    email?: string;
  };

  export interface UseCase {
    execute(
      request: Request
    ): Promise<Either<UserNotFoundError | FailToDeleteUserError, string>>;
  }
}
