import { AccountRepositoryProtocol } from "../infra/database/repository/protocol/user-repository";
import {
  IOutputWithPagination,
  IPaginationInput,
} from "../../../../domain/use-cases/helpers/pagination";
import { Either, right } from "../../../../shared/Either";
import { UserTypes } from "../model/user";
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
    if (request?.id) {
      data = await this.accountRepository.getUserById(Number(request.id));
    } else {
      data = await this.accountRepository.list(
        request as {
          name?: string | undefined;
          type?: Record<UserTypes, string> | undefined;
        } & IPaginationInput
      );
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

  export type Response = User | IOutputWithPagination<User> | null;
}

export interface IFetchUsersUseCase {
  execute(
    request: FetchUsersDTO.Request
  ): Promise<Either<Error, FetchUsersDTO.Response>>;
}
