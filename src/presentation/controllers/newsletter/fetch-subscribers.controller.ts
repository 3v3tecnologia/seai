import { HttpResponse } from "../ports";

import { IPaginationInput, parsePaginationInput } from "../../../domain/use-cases/helpers/pagination";
import { FetchSubscribersUseCaseProtocol } from "../../../domain/use-cases/newsletter";
import { created, forbidden, serverError } from "../helpers";

export class FetchNewsletterSubscribersController {
  private useCase: FetchSubscribersUseCaseProtocol.UseCase;

  constructor(
    useCase: FetchSubscribersUseCaseProtocol.UseCase,
  ) {
    this.useCase = useCase;
  }

  async handle(
    request: FetchNewsletterSubscribersControllerProtocol.Request
  ): Promise<HttpResponse> {
    try {
      const dto = {
        ...parsePaginationInput({
          page: request.pageNumber,
          limit: request.limit
        }),
      }

      if (request.name) {
        Object.assign(dto, {
          name: request.name
        })
      }

      if (request.email) {
        Object.assign(dto, {
          email: request.email
        })
      }
      const resultOrError = await this.useCase.execute(dto);


      if (resultOrError.isLeft()) {
        return forbidden(resultOrError.value);
      }

      return created(resultOrError.value);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }
}

export namespace FetchNewsletterSubscribersControllerProtocol {
  export type Request = { email?: string, name?: string } & IPaginationInput
}
