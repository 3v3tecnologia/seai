
import { BaseUserModel } from "../core/model/base-user";
import { UserTypes } from "../core/model/user";

import { IPaginationInput, IOutputWithPagination } from "../../../shared/core/pagination";
import { Either, right } from "../../../shared/core/Either";
import { AccountRepositoryProtocol } from "../infra/repositories/protocol/user-repository";

export class FetchUsersUseCase implements IFetchUsersUseCase {
  private readonly accountRepository: AccountRepositoryProtocol;

  constructor(accountRepository: AccountRepositoryProtocol) {
    this.accountRepository = accountRepository;
  }
  async execute(
    request: FetchUsersDTO.Request
  ): Promise<Either<Error, FetchUsersDTO.Response | null>> {
    let data = null;
    if (request?.id) {
      data = await this.accountRepository.getUserById(Number(request.id));
    } else {
      data = await this.accountRepository.list(request as {
        name?: string | undefined;
        type?: Record<UserTypes, string> | undefined;
      } & IPaginationInput);
    }
    return right(data);
  }
}

export namespace FetchUsersDTO {
  export type Request = {
    id?: number;
    name?: string;
    type?: Record<UserTypes, string>;
  } & Partial<IPaginationInput>;

  export type Response = BaseUserModel | IOutputWithPagination<BaseUserModel> | null;
}

export interface IFetchUsersUseCase {
  execute(
    request: FetchUsersDTO.Request
  ): Promise<Either<Error, FetchUsersDTO.Response>>;
}
