import { AccountRepository } from "../../../../infra/database/postgres/repositories/account-repository";
import { Either, right } from "../../../../shared/Either";

export class LoaUserModules {
  private readonly accountRepository: AccountRepository;
  constructor(accountRepository: AccountRepository) {
    this.accountRepository = accountRepository;
  }
  async execute(
    user_id: number
  ): Promise<
    Either<Error, AccountRepository.system_modules_permissions | null>
  > {
    const access = await this.accountRepository.loadUserModules(user_id);
    return right(access);
  }
}
