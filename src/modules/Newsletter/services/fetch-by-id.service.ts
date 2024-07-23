import { NewsRepositoryProtocol } from "../../../domain/use-cases/_ports/repositories/newsletter-repository";
import { Either, right } from "../../../shared/Either";
import { Content } from "../model/content";

export class FetchByIdNews implements FetchNewsByIdUseCaseProtocol.UseCase {
  private repository: NewsRepositoryProtocol;
  constructor(repository: NewsRepositoryProtocol) {
    this.repository = repository;
  }
  async execute(
    request: FetchNewsByIdUseCaseProtocol.Request
  ): FetchNewsByIdUseCaseProtocol.Response {
    const data = await this.repository.getById(request);

    if (data === null) {
      return right(null);
    }

    return right(data);
  }
}

export namespace FetchNewsByIdUseCaseProtocol {
  export type Request = {
    Id: number;
  };

  export type Response = Promise<Either<Error, Content | null>>;

  export interface UseCase {
    execute(request: Request): Response;
  }
}
