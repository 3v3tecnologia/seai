import { Either, right } from "../../../../shared/Either";
import { SystemModulesProps } from "../../../entities/user/user-modules-access";
import { AccountRepositoryProtocol } from "../../_ports/repositories/account-repository";

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

  export type Response = {
    id: number;
    name: string;
    login: string;
    email: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    modules: SystemModulesProps | null;
  } | null;
}
