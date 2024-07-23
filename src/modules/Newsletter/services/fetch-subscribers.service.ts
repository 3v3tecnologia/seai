import { NewsletterSubscriberRepositoryProtocol } from "./../../../domain/use-cases/_ports/repositories/newsletter-repository";
import { Either, right } from "../../../shared/Either";
import { Subscriber } from "../model/subscriber";
import {
  IOutputWithPagination,
  IPaginationInput,
} from "../../../domain/use-cases/helpers/pagination";

export class FetchSubscribers
  implements FetchSubscribersUseCaseProtocol.UseCase
{
  private readonly repository: NewsletterSubscriberRepositoryProtocol;

  constructor(repository: NewsletterSubscriberRepositoryProtocol) {
    this.repository = repository;
  }

  async execute(
    request: FetchSubscribersUseCaseProtocol.Request
  ): Promise<Either<Error, any | null>> {
    const data = await this.repository.getAll(request);

    return right(data);
  }
}

export namespace FetchSubscribersUseCaseProtocol {
  export type Request = { email?: string; name?: string } & IPaginationInput;

  export type Response = IOutputWithPagination<Subscriber>;

  export interface UseCase {
    execute(request: Request): Promise<Either<Error, any | null>>;
  }
}
