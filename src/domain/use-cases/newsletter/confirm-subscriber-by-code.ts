import { Either, left, right } from "../../../shared/Either";
import { Command } from "../_ports/core/command";
import { NewsletterSubscriberRepositoryProtocol } from "../_ports/repositories/newsletter-repository";

export class ConfirmSubscriberByCode
  extends Command
  implements ConfirmSubscriberByCodeUseCaseProtocol.UseCase
{
  private repository: NewsletterSubscriberRepositoryProtocol;

  constructor(repository: NewsletterSubscriberRepositoryProtocol) {
    super();
    this.repository = repository;
  }
  async execute(
    request: ConfirmSubscriberByCodeUseCaseProtocol.Request
  ): ConfirmSubscriberByCodeUseCaseProtocol.Response {
    const pendingSubscriber = await this.repository.getByCode(
      request.Code,
      "pending"
    );

    if (pendingSubscriber === null) {
      return left(new Error("Falha ao realizar a operação."));
    }

    await this.repository.confirmSubscriber(request.Code);

    return right();
  }
}

export namespace ConfirmSubscriberByCodeUseCaseProtocol {
  export type Request = {
    Code: string;
  };

  export type Response = Promise<Either<Error, string>>;

  export interface UseCase {
    execute(request: Request): Response;
  }
}
