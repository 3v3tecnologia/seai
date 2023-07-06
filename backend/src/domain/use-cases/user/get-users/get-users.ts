import { Either, right } from "../../../../shared/Either";
import { AccountRepositoryProtocol } from "../../_data/repositories/account-repository";

export class GetUsers {
  private readonly accountRepository: AccountRepositoryProtocol;

  constructor(accountRepository: AccountRepositoryProtocol) {
    this.accountRepository = accountRepository;
  }
  async execute(): Promise<Either<Error, Array<any> | null>> {
    const users = await this.accountRepository.list();
    return right(users);
  }
}
