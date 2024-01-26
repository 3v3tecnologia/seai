import { Either, right } from "../../../shared/Either";
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

  export type Response = Promise<
    Either<
      Error,
      {
        Id: number;
        Key: string;
        Type: string;
        Enabled: boolean;
        CreatedAt: string;
        UpdatedAt: string;
      } | null
    >
  >;

  export interface UseCase {
    execute(request: Request): Response;
  }
}
