import { Either, right } from "../../../../../shared/Either";
import { Optional } from "../../../../../shared/optional";
import { UserRepositoryProtocol } from "../../infra/database/repository/protocol/user-repository";
import { UserAccount } from "../../model/account";

export class FetchUserById {
  private readonly accountRepository: UserRepositoryProtocol;
  constructor(accountRepository: UserRepositoryProtocol) {
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

  export type Response = Optional<
    UserAccount,
    "id" | "name" | "code" | "status" | "login"
  > | null;
}
