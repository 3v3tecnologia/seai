import { Either, right } from "../../../shared/Either";
import { Content } from "../../entities/newsletter/news";
import { Command } from "../_ports/core/command";
import { NewsRepositoryProtocol } from "../_ports/repositories/newsletter-repository";
import { InputWithPagination, OutputWithPagination } from "../helpers/dto";
import { formatPaginationInput } from "../helpers/formatPaginationInput";

export class FetchAllNews extends Command implements FetchAllNews.UseCase {
  private repository: NewsRepositoryProtocol;
  constructor(repository: NewsRepositoryProtocol) {
    super();
    this.repository = repository;
  }
  async create(request: FetchAllNews.Request): FetchAllNews.Response {
    const data = await this.repository.getAll(
      formatPaginationInput(request.pageNumber, request.limit)
    );

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
