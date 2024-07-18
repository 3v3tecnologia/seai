import { Either, right } from "../../../shared/Either";
import { Subscriber } from "../../entities/newsletter/subscriber";
import { NewsletterSubscriberRepositoryProtocol } from "../_ports/repositories/newsletter-repository";

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
