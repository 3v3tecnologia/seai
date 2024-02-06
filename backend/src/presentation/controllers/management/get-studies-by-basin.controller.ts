import { HttpResponse } from "../ports";

import { GetManagementStudiesByBasinUseCaseProtocol } from "../../../domain/use-cases/management/get-studies-by-basin";
import { created, forbidden, serverError } from "../helpers";
import { InputWithPagination } from "../../../domain/use-cases/helpers/dto";
import { formatPaginationInput } from "../../../domain/use-cases/helpers/formatPaginationInput";

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
        Id_Basin: Number(request.id),
        ...formatPaginationInput(request.pageNumber, request.limit),
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
