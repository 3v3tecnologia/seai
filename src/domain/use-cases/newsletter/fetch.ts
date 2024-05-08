import { Either, right } from "../../../shared/Either";
import { Content } from "../../entities/newsletter/news";
import { Command } from "../_ports/core/command";
import { NewsRepositoryProtocol } from "../_ports/repositories/newsletter-repository";
import { IPaginationInput, IOutputWithPagination } from "../helpers/pagination";

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
