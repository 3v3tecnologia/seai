import { Either, right } from "../../../shared/Either";
import { ApiKey } from "../../entities/apiKey/api-key";
import { AccessKeyRepositoryProtocol } from "../_ports/repositories/acess-key.repository";
import { IPaginationInput, OldOutputWithPagination } from "../helpers/pagination";
import { formatPaginationInput } from "../helpers/formatPaginationInput";

export class FetchAccessKeys implements FetchAccessKeysUseCaseProtocol.UseCase {
  private readonly repository: AccessKeyRepositoryProtocol;

  constructor(repository: AccessKeyRepositoryProtocol) {
    this.repository = repository;
  }

  async execute(
    request: FetchAccessKeysUseCaseProtocol.Request
  ): FetchAccessKeysUseCaseProtocol.Response {
    const exists = await this.repository.getAll(
      formatPaginationInput(request.pageNumber, request.limit)
    );

    return right(exists);
  }
}

export namespace FetchAccessKeysUseCaseProtocol {
  export type Request = IPaginationInput;

  export type Response = Promise<
    Either<Error, OldOutputWithPagination<ApiKey> | null>
  >;

  export interface UseCase {
    execute(request: Request): Response;
  }
}
