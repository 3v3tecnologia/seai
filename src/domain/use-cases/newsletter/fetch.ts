import { Either, right } from "../../../shared/Either";
import { Content } from "../../entities/newsletter/news";
import { Command } from "../_ports/core/command";
import { NewsRepositoryProtocol } from "../_ports/repositories/newsletter-repository";
import { InputWithPagination } from "../helpers/dto";
import { formatPaginationInput } from "../helpers/formatPaginationInput";
import { IOuputWithPagination } from './../_ports/repositories/dto/output';

export class FetchAllNews implements FetchAllNews.UseCase {
  private repository: NewsRepositoryProtocol;
  constructor(repository: NewsRepositoryProtocol) {

    this.repository = repository;
  }
  async execute(request: FetchAllNews.Request): FetchAllNews.Response {
    const dto = {
      ...formatPaginationInput(request.pageNumber, request.limit),
    };

    if (request.title) {
      Object.assign(dto, {
        title: request.title
      })
    }

    const data = await this.repository.getAll(
      dto
    );

    return right(data);
  }
}

export namespace FetchAllNews {
  export type Request = { title?: string } & InputWithPagination;

  export type Response = Promise<
    Either<Error, IOuputWithPagination<Required<Content>>>
  >;

  export interface UseCase {
    execute(request: Request): Response;
  }
}
