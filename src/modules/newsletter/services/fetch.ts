import { Either, right } from "../../../shared/Either";
import { Content } from "../core/models/news";
import { Command } from "../../../shared/core/command";
import { NewsRepositoryProtocol } from "../../../domain/use-cases/_ports/repositories/newsletter-repository";
import { IPaginationInput, IOutputWithPagination } from "../../../shared/core/pagination";

export class FetchAllNews implements FetchAllNews.UseCase {
  private repository: NewsRepositoryProtocol;
  constructor(repository: NewsRepositoryProtocol) {

    this.repository = repository;
  }
  async execute(request: FetchAllNews.Request): FetchAllNews.Response {

    const data = await this.repository.getAll(
      request
    );

    return right(data);
  }
}

export namespace FetchAllNews {
  export type Request = { title?: string } & IPaginationInput;

  export type Response = Promise<
    Either<Error, IOutputWithPagination<Required<Content>>>
  >;

  export interface UseCase {
    execute(request: Request): Response;
  }
}
