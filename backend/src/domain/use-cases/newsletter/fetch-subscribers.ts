import { SubscriberRepositoryProtocol } from "../../../domain/use-cases/_ports/repositories/newsletter-repository";
import {
  InputWithPagination,
  OutputWithPagination,
} from "../../../domain/use-cases/helpers/dto";
import { Either, left, right } from "../../../shared/Either";
import { Subscriber } from "../../entities/newsletter/subscriber";

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
    console.log("[FetchSubscribers] ",request)
    if (request.email) {
      const subscriber = await this.repository.getByEmail({
        Email: request.email,
      });

      if (subscriber == null) {
        return left(new Error(`Não foi possível encontrar usuário.`));
      }

      return right(subscriber);
    }

    const dto = {
      limit: request.limit || 50,
      pageNumber: request.pageNumber
        ? (request.limit as number) * (request.pageNumber - 1)
        : 0,
    };

    const data = await this.repository.getAll(dto);

    return right(data);
  }
}

export namespace FetchSubscribersUseCaseProtocol {
  export type Request = {
    email?: string;
  } & Partial<InputWithPagination>;

  export type Response =
    | OutputWithPagination<Array<Subscriber>>
    | null
    | Subscriber;

  export interface UseCase {
    execute(request: Request): Promise<Either<Error, any | null>>;
  }
}
