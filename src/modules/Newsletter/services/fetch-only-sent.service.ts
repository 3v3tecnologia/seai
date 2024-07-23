import { Either, right } from "../../../shared/Either";
import { Content } from "../model/content";
import { NewsRepositoryProtocol } from "../../../domain/use-cases/_ports/repositories/newsletter-repository";
import {
  IOutputWithPagination,
  IPaginationInput,
} from "../../../domain/use-cases/helpers/pagination";

export class FetchOnlySentNews implements FetchOnlySentNews.UseCase {
  private repository: NewsRepositoryProtocol;
  constructor(repository: NewsRepositoryProtocol) {
    this.repository = repository;
  }
  async execute(
    request: FetchOnlySentNews.Request
  ): FetchOnlySentNews.Response {
    const data = await this.repository.getAll({
      only_sent: true,
      ...request,
    });

    return right(data);
  }
}

export namespace FetchOnlySentNews {
  export type Request = { title?: string } & IPaginationInput;

  export type Response = Promise<
    Either<Error, IOutputWithPagination<Required<Content>>>
  >;

  export interface UseCase {
    execute(request: Request): Response;
  }
}
