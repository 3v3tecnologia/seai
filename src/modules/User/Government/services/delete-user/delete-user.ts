import { Either, left, right } from "../../../../../shared/Either";
import { UserCommandOperationProps } from "../../../../Logs/protocols/logger";
import { FailToDeleteUserError } from "../../../core/errors/fail-to-delete-user-error";
import { UserNotFoundError } from "../../../core/errors/user-not-found-error";
import { UserRepositoryProtocol } from "../../infra/database/repository/protocol/user-repository";

export class DeleteUser implements DeleteUserProtocol {
  constructor(private readonly accountRepository: UserRepositoryProtocol) {
    this.accountRepository = accountRepository;
  }
  async execute(
    request: {
      id?: number;
      email?: string;
    },
    operation: UserCommandOperationProps
  ): Promise<Either<UserNotFoundError | FailToDeleteUserError, string>> {
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
      account.id as number,
      {
        author: operation.author,
        operation: operation.operation,
      }
    );

    if (result === false) {
      return left(new FailToDeleteUserError());
    }

    return right("Usuário deletado com sucesso");
  }
}

export interface DeleteUserProtocol {
  execute(
    request: {
      id?: number;
      email?: string;
    },
    operation: UserCommandOperationProps
  ): Promise<Either<UserNotFoundError | FailToDeleteUserError, string>>;
}
