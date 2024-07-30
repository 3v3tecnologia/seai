import { Either, left, right } from "../../../../../shared/Either";
import {
  CommandProps,
  UserOperationsLoggerProtocol,
} from "../../../../UserOperations/protocols/logger";
import { FailToDeleteUserError } from "../../../core/errors/fail-to-delete-user-error";
import { UserNotFoundError } from "../../../core/errors/user-not-found-error";
import { UserRepositoryProtocol } from "../../infra/database/repository/protocol/user-repository";

export class DeleteUser implements DeleteUserProtocol.UseCase {
  constructor(
    private readonly accountRepository: UserRepositoryProtocol,
    private readonly operationsLogger: UserOperationsLoggerProtocol
  ) {
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

    await this.operationsLogger.save(request.accountId, request.description);

    return right("Usuário deletado com sucesso");
  }
}

export namespace DeleteUserProtocol {
  export type Request = {
    id?: number;
    email?: string;
  } & CommandProps;

  export interface UseCase {
    execute(
      request: Request
    ): Promise<Either<UserNotFoundError | FailToDeleteUserError, string>>;
  }
}
