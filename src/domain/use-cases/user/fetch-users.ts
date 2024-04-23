import { Either, right } from "../../../shared/Either";
import { UserTypes } from "../../entities/user/user";
import { AccountRepositoryProtocol } from "../_ports/repositories/account-repository";
import { IInputWithPagination } from "../_ports/repositories/dto/input";
import { IOuputWithPagination } from "../_ports/repositories/dto/output";
import { User } from "./model/user";

export class FetchUsersUseCase implements IFetchUsersUseCase {
  private readonly accountRepository: AccountRepositoryProtocol;

  constructor(accountRepository: AccountRepositoryProtocol) {
    this.accountRepository = accountRepository;
  }
  async execute(
    request: FetchUsersDTO.Request
  ): Promise<Either<Error, FetchUsersDTO.Response | null>> {
    let data = null;
    if (request?.userId) {
      data = await this.accountRepository.getUserById(Number(request.userId));
    } else {
      data = await this.accountRepository.list({
        name: request.name,
        type: request.type,
        limit: request.limit,
        offset: request.offset,
        pageNumber: request.pageNumber,
      });
    }
    return right(data);
  }
}

export namespace FetchUsersDTO {
  export type Request = {
    userId?: number;
    name?: string;
    type?: Record<UserTypes, string>;
  } & IInputWithPagination;

  export type Response = User | IOuputWithPagination<User> | null;
}

export interface IFetchUsersUseCase {
  execute(
    request: FetchUsersDTO.Request
  ): Promise<Either<Error, FetchUsersDTO.Response>>;
}
