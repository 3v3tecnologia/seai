import { Either, right } from "../../../shared/Either";
import { ApiKey } from "../../entities/apiKey/api-key";
import { AccessKeyRepositoryProtocol } from "../_ports/repositories/acess-key.repository";
import { InputWithPagination, OutputWithPagination } from "../helpers/dto";

export class FetchAccessKeys implements FetchAccessKeysUseCaseProtocol.UseCase {
  private readonly repository: AccessKeyRepositoryProtocol;

  constructor(repository: AccessKeyRepositoryProtocol) {
    this.repository = repository;
  }

  async execute(
    request: FetchAccessKeysUseCaseProtocol.Request
  ): FetchAccessKeysUseCaseProtocol.Response {
    const dto = {
      limit: request.limit || 50,
      pageNumber: request.pageNumber
        ? (request.limit as number) * (request.pageNumber - 1)
        : 0,
    };

    const exists = await this.repository.getAll(dto);

    return right(exists);
  }
}

export namespace FetchAccessKeysUseCaseProtocol {
  export type Request = InputWithPagination;

  export type Response = Promise<
    Either<Error, OutputWithPagination<Array<ApiKey>> | null>
  >;

  export interface UseCase {
    execute(request: Request): Response;
  }
}
