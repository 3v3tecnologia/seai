import { Either, right } from "../../../shared/Either";
import { Content } from "../../entities/newsletter/news";
import { Command } from "../_ports/core/command";
import { NewsRepositoryProtocol } from "../_ports/repositories/newsletter-repository";

export class FetchByIdNews
  extends Command
  implements FetchNewsByIdUseCaseProtocol.UseCase
{
  private repository: NewsRepositoryProtocol;
  constructor(repository: NewsRepositoryProtocol) {
    super();
    this.repository = repository;
  }
  async create(
    request: FetchNewsByIdUseCaseProtocol.Request
  ): FetchNewsByIdUseCaseProtocol.Response {
    const data = await this.repository.getById(request);

    return right(data);
  }
}

export namespace FetchNewsByIdUseCaseProtocol {
  export type Request = {
    Id: number;
  };

  export type Response = Promise<Either<Error, Content | null>>;

  export interface UseCase {
    create(request: Request): Response;
  }
}
