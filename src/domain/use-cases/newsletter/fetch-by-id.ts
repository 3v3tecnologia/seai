import { Either, left, right } from "../../../shared/Either";
import { Content } from "../../entities/newsletter/news";
import { Command } from "../_ports/core/command";
import { JobsRepositoryProtocol } from "../_ports/repositories/background-jobs-repository";
import { NewsRepositoryProtocol } from "../_ports/repositories/newsletter-repository";

export class FetchByIdNews
  extends Command
  implements FetchNewsByIdUseCaseProtocol.UseCase {
  private repository: NewsRepositoryProtocol;
  constructor(
    repository: NewsRepositoryProtocol,
  ) {
    super();
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
