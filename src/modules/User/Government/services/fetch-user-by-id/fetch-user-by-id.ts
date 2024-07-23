import { AccountRepositoryProtocol } from "../../infra/database/repository/protocol/user-repository";
import { Either, right } from "../../../../../shared/Either";
import { User } from "../model/user";

export class FetchUserById {
  private readonly accountRepository: AccountRepositoryProtocol;
  constructor(accountRepository: AccountRepositoryProtocol) {
    this.accountRepository = accountRepository;
  }
  async execute(
    request: LoadUser.Request
  ): Promise<Either<Error, LoadUser.Response>> {
    const access = await this.accountRepository.getUserById(request.userId);
    return right(access);
  }
}

namespace LoadUser {
  export type Request = {
    userId: number;
  };

  export type Response = User | null;
}
