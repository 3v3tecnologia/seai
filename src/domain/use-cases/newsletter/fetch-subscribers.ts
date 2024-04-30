import { Either, right } from "../../../shared/Either";
import { Subscriber } from "../../entities/newsletter/subscriber";
import { IOuputWithPagination } from "../_ports/repositories/dto/output";
import { SubscriberRepositoryProtocol } from "../_ports/repositories/newsletter-repository";
import { InputWithPagination } from "../helpers/dto";

export class FetchSubscribers
  implements FetchSubscribersUseCaseProtocol.UseCase {
  private readonly repository: SubscriberRepositoryProtocol;

  constructor(repository: SubscriberRepositoryProtocol) {
    this.repository = repository;
  }

  async execute(
    request: FetchSubscribersUseCaseProtocol.Request
  ): Promise<Either<Error, any | null>> {
    const data = await this.repository.getAll(
      request
    );

    return right(data);
  }
}

export namespace FetchSubscribersUseCaseProtocol {
  export type Request = { email?: string, name?: string } & InputWithPagination;

  export type Response = IOuputWithPagination<Subscriber>;

  export interface UseCase {
    execute(request: Request): Promise<Either<Error, any | null>>;
  }
}
