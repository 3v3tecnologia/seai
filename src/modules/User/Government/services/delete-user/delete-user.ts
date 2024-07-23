import { AccountRepositoryProtocol } from "../../infra/database/repository/protocol/user-repository";
import { Either, left, right } from "../../../../../shared/Either";
import { FailToDeleteUserError } from "./errors/fail-to-delete-user-error";
import { UserNotFoundError } from "./errors/user-not-found-error";

export class DeleteUser implements DeleteUserProtocol.UseCase {
  private readonly accountRepository: AccountRepositoryProtocol;

  constructor(accountRepository: AccountRepositoryProtocol) {
    this.accountRepository = accountRepository;
  }
  async execute(
    request: DeleteUserProtocol.Request
  ): Promise<Either<UserNotFoundError | FailToDeleteUserError, string>> {
    console.log("request :: ", request);
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
