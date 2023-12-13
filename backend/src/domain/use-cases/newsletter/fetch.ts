import { Either, right } from "../../../shared/Either";
import { DATABASES_NAMES } from "../../../shared/db/tableNames";
import { Content } from "../../entities/newsletter/news";
import { Command } from "../_ports/core/command";
import { NewsRepositoryProtocol } from "../_ports/repositories/newsletter-repository";
import { InputWithPagination, OutputWithPagination } from "../helpers/dto";

export class FetchAllNews extends Command implements FetchAllNews.UseCase {
  private repository: NewsRepositoryProtocol;
  constructor(repository: NewsRepositoryProtocol) {
    super();
    this.repository = repository;
  }
  async create(request: FetchAllNews.Request): FetchAllNews.Response {
    const pageNumber = request.pageNumber ? Number(request.pageNumber) : 40;
    const limit = request.limit ? Number(request.limit) : 40;

    const data = await this.repository.getAll({
      pageNumber,
      limit,
    });

    return right(data);
  }
}

export namespace FetchAllNews {
  export type Request = InputWithPagination;

  export type Response = Promise<
    Either<Error, OutputWithPagination<Required<Content>> | null>
  >;

  export interface UseCase {
    create(request: Request): Response;
  }
}
