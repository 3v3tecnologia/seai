import { Either, right } from "../../../shared/Either";
import { ApiKey } from "../core/models/api-key";
import { AccessKeyRepositoryProtocol } from "../../../domain/use-cases/_ports/repositories/acess-key.repository";
import { IPaginationInput, OldOutputWithPagination } from "../../../shared/core/pagination";
import { formatPaginationInput } from "../../../shared/core/formatPaginationInput";

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
