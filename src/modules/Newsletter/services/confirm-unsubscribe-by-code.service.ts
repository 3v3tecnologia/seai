import { Either, left, right } from "../../../shared/Either";
import { NewsletterSubscriberRepositoryProtocol } from "./../../../domain/use-cases/_ports/repositories/newsletter-repository";

export class ConfirmUnsubscribeByCode
  implements ConfirmUnsubscribeByCodeUseCaseProtocol.UseCase
{
  private repository: NewsletterSubscriberRepositoryProtocol;

  constructor(repository: NewsletterSubscriberRepositoryProtocol) {
    this.repository = repository;
  }
  async execute(
    request: ConfirmUnsubscribeByCodeUseCaseProtocol.Request
  ): ConfirmUnsubscribeByCodeUseCaseProtocol.Response {
    const pendingSubscriber = await this.repository.getByCode(
      request.Code,
      "confirmed"
    );

    if (pendingSubscriber === null) {
      return left(new Error("Falha ao realizar a operação."));
    }

    await this.repository.deleteByCode(request.Code);

    return right();
  }
}

export namespace ConfirmUnsubscribeByCodeUseCaseProtocol {
  export type Request = {
    Code: string;
  };

  export type Response = Promise<Either<Error, string>>;

  export interface UseCase {
    execute(request: Request): Response;
  }
}
