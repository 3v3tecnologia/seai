import { HttpResponse } from "../ports";

import { GetManagementStudiesByBasinUseCaseProtocol } from "../../../domain/use-cases/management/get-studies-by-basin";
import { created, forbidden, serverError } from "../helpers";
import { InputWithPagination } from "../../../domain/use-cases/helpers/dto";

export class GetManagementStudiesByBasinController {
  private useCase: GetManagementStudiesByBasinUseCaseProtocol.UseCase;

  constructor(useCase: GetManagementStudiesByBasinUseCaseProtocol.UseCase) {
    this.useCase = useCase;
  }

  async handle(
    request: GetManagementStudiesByBasinControllerProtocol.Request
  ): Promise<HttpResponse> {
    try {
      const deletedOrError = await this.useCase.execute({
        Id: Number(request.id),
        limit: request.limit,
        pageNumber: request.pageNumber,
      });

      if (deletedOrError.isLeft()) {
        return forbidden(deletedOrError.value);
      }

      return created(deletedOrError.value);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }
}

export namespace GetManagementStudiesByBasinControllerProtocol {
  export type Request = {
    accountId: number;
    id: number;
  } & InputWithPagination;
}
