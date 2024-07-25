import { Optional } from "./../../../../shared/optional";
import {
  IOutputWithPagination,
  IPaginationInput,
} from "../../../../domain/use-cases/helpers/pagination";
import { Either, right } from "../../../../shared/Either";
import { UserRepositoryProtocol } from "../infra/database/repository/protocol/user-repository";
import { UserTypes } from "../model/user";
import { UserAccountProps } from "../model/account";

export class FetchUsersUseCase implements IFetchUsersUseCase {
  private readonly accountRepository: UserRepositoryProtocol;

  constructor(accountRepository: UserRepositoryProtocol) {
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

  type account = Optional<
    UserAccountProps,
    "id" | "name" | "code" | "status" | "login"
  >;

  export type Response = account | IOutputWithPagination<account> | null;
}

export interface IFetchUsersUseCase {
  execute(
    request: FetchUsersDTO.Request
  ): Promise<Either<Error, FetchUsersDTO.Response>>;
}
