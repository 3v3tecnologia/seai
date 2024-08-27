import { Either, right } from "../../../shared/Either";
import { NewsletterSubscriberRepositoryProtocol } from "../infra/database/repository/protocol/newsletter-repository";
import { Subscriber } from "../model/subscriber";

export class FetchNewsletterSubscriberByEmail
  implements FetchNewsletterSubscriberByEmailUseCaseProtocol.UseCase
{
  private repository: NewsletterSubscriberRepositoryProtocol;

  constructor(repository: NewsletterSubscriberRepositoryProtocol) {
    this.repository = repository;
  }
  async execute(
    request: FetchNewsletterSubscriberByEmailUseCaseProtocol.Request
  ): FetchNewsletterSubscriberByEmailUseCaseProtocol.Response {
    const subscriber = await this.repository.getByEmail({
      Email: request.Email,
    });

    return right(subscriber);
  }
}

export namespace FetchNewsletterSubscriberByEmailUseCaseProtocol {
  export type Request = {
    Email: string;
  };

  export type Response = Promise<Either<Error, Required<Subscriber> | null>>;

  export interface UseCase {
    execute(request: Request): Response;
  }
}
