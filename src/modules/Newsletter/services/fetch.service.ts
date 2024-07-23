import {
  IOutputWithPagination,
  IPaginationInput,
} from "../../../domain/use-cases/helpers/pagination";
import { Either, right } from "../../../shared/Either";
import { NewsRepositoryProtocol } from "../infra/database/repository/protocol/newsletter-repository";
import { Content } from "../model/content";

export class FetchAllNews implements FetchAllNews.UseCase {
  private repository: NewsRepositoryProtocol;
  constructor(repository: NewsRepositoryProtocol) {
    this.repository = repository;
  }
  async execute(request: FetchAllNews.Request): FetchAllNews.Response {
    const data = await this.repository.getAll({
      only_sent: false,
      ...request,
    });

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
