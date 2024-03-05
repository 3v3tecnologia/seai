import { Either, right } from "../../../../shared/Either";
import {
  AccountRepository,
  AccountRepositoryProtocol,
} from "../../_ports/repositories/account-repository";

export class GetUsers {
  private readonly accountRepository: AccountRepositoryProtocol;

  constructor(accountRepository: AccountRepositoryProtocol) {
    this.accountRepository = accountRepository;
  }
  async execute(
    request: FetchUsers.Request
  ): Promise<
    Either<
      Error,
      | Required<AccountRepository.UserData>
      | Array<Required<AccountRepository.UserData>>
      | null
    >
  > {
    let data = null;
    if (request?.userId) {
      data = await this.accountRepository.getUserById(Number(request.userId));
    } else {
      data = await this.accountRepository.list();
    }
    return right(data);
  }
}

export namespace FetchUsers {
  export type Request = {
    userId?: number;
  } | null;
}
