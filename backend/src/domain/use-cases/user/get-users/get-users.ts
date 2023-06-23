import { AccountRepository } from "../../../../infra/database/postgres/repositories/account-repository";
import { Either, right } from "../../../../shared/Either";

export class GetUsers {
  private readonly accountRepository: AccountRepository;

  constructor(accountRepository: AccountRepository) {
    this.accountRepository = accountRepository;
  }
  async execute(user_id: number): Promise<Either<Error, any>> {
    return right(true);
  }
}
