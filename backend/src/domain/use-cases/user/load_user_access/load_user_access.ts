import { Either, right } from "../../../../shared/Either";
import {
  AccountRepository,
  AccountRepositoryProtocol,
} from "../../_data/repositories/account-repository";

export class LoaUserModules {
  private readonly accountRepository: AccountRepositoryProtocol;
  constructor(accountRepository: AccountRepositoryProtocol) {
    this.accountRepository = accountRepository;
  }
  async execute(
    user_id: number
  ): Promise<
    Either<Error, AccountRepository.system_modules_permissions | null>
  > {
    const access = await this.accountRepository.getUserModulesPermissions(
      user_id
    );
    return right(access);
  }
}
