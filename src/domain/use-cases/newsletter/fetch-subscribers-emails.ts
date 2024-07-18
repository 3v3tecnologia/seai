import { Either, right } from "../../../shared/Either";
import { NewsletterSubscriberRepositoryProtocol } from "../_ports/repositories/newsletter-repository";

export class FetchSubscribersEmails
  implements FetchSubscribersEmailUseCaseProtocol.UseCase
{
  private readonly repository: NewsletterSubscriberRepositoryProtocol;

  constructor(repository: NewsletterSubscriberRepositoryProtocol) {
    this.repository = repository;
  }

  async execute(): Promise<Either<Error, any | null>> {
    const data = await this.repository.getReceiversEmails();

    return right(data);
  }
}

export namespace FetchSubscribersEmailUseCaseProtocol {
  export type Request = void;

  export type Response = Array<string> | null;

  export interface UseCase {
    execute(request: Request): Promise<Either<Error, any | null>>;
  }
}
