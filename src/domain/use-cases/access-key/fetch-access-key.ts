import { Either, right } from "../../../shared/Either";
import { ApiKey } from "../../entities/apiKey/api-key";
import { AccessKeyRepositoryProtocol } from "../_ports/repositories/acess-key.repository";

export class FetchAccessKeyById
  implements FetchAccessKeyByIdUseCaseProtocol.UseCase
{
  private readonly repository: AccessKeyRepositoryProtocol;

  constructor(repository: AccessKeyRepositoryProtocol) {
    this.repository = repository;
  }

  async execute(
    request: FetchAccessKeyByIdUseCaseProtocol.Request
  ): FetchAccessKeyByIdUseCaseProtocol.Response {
    const exists = await this.repository.getById({
      Id: request.Id,
    });

    return right(exists);
  }
}

export namespace FetchAccessKeyByIdUseCaseProtocol {
  export type Request = {
    Id: number;
  };

  export type Response = Promise<Either<Error, ApiKey | null>>;

  export interface UseCase {
    execute(request: Request): Response;
  }
}
