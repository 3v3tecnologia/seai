import { AccountRepository } from "../../../../infra/database/postgres/repositories/account-repository";
import { Either, left, right } from "../../../../shared/Either";
import { FailToDeleteUserError } from "./errors/fail-to-delete-user-error";
import { UserNotFoundError } from "./errors/user-not-found-error";

export class DeleteUser {
  private readonly accountRepository: AccountRepository;

  constructor(accountRepository: AccountRepository) {
    this.accountRepository = accountRepository;
  }
  async execute(
    user_id: number
  ): Promise<Either<UserNotFoundError | FailToDeleteUserError, any>> {
    console.log("Buscando usuário por id ", user_id);
    const account = await this.accountRepository.loadById(user_id);

    if (account === null) {
      return left(new UserNotFoundError());
    }

    const result = await this.accountRepository.deleteById(
      account.id as number
    );

    if (result === false) {
      return left(new FailToDeleteUserError());
    }

    return right(true);
  }
}
