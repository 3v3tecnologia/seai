import { SubscriberRepositoryProtocol } from "../_ports/repositories/newsletter-repository";
import { InputWithPagination, OutputWithPagination } from "../helpers/dto";
import { Either, left, right } from "../../../shared/Either";
import { Subscriber } from "../../entities/newsletter/subscriber";
import { formatPaginationInput } from "../helpers/formatPaginationInput";

export class FetchSubscribers
  implements FetchSubscribersUseCaseProtocol.UseCase
{
  private readonly repository: SubscriberRepositoryProtocol;

  constructor(repository: SubscriberRepositoryProtocol) {
    this.repository = repository;
  }

  async execute(
    request: FetchSubscribersUseCaseProtocol.Request
  ): Promise<Either<Error, any | null>> {
    if (request.email) {
      const subscriber = await this.repository.getByEmail({
        Email: request.email,
      });

      if (subscriber == null) {
        return left(new Error(`Não foi possível encontrar usuário.`));
      }

      return right(subscriber);
    }

    const data = await this.repository.getAll(
      formatPaginationInput(request.pageNumber, request.limit)
    );

    return right(data);
  }
}

export namespace FetchSubscribersUseCaseProtocol {
  export type Request = {
    email?: string;
  } & Partial<InputWithPagination>;

  export type Response = OutputWithPagination<Subscriber> | null | Subscriber;

  export interface UseCase {
    execute(request: Request): Promise<Either<Error, any | null>>;
  }
}
