import { HttpResponse } from "../../../../shared/presentation/ports";

import { GetManagementWeightsByBasinUseCaseProtocol } from "../../services/get-weights-by-basin";
import { created, forbidden, serverError } from "../../../../presentation/controllers/helpers";
import { formatPaginationInput } from "../../../../shared/core/formatPaginationInput";
import { IPaginationInput, parsePaginationInput } from "../../../../shared/core/pagination";

export class GetManagementWeightsByBasinController {
  private useCase: GetManagementWeightsByBasinUseCaseProtocol.UseCase;

  constructor(useCase: GetManagementWeightsByBasinUseCaseProtocol.UseCase) {
    this.useCase = useCase;
  }

  async handle(
    request: GetManagementWeightsByBasinControllerProtocol.Request
  ): Promise<HttpResponse> {
    try {
      const deletedOrError = await this.useCase.execute({
        Id_Basin: Number(request.id),
        ...parsePaginationInput({
          page: request.pageNumber,
          limit: request.limit
        }),
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

export namespace GetManagementWeightsByBasinControllerProtocol {
  export type Request = {
    accountId: number;
    id: number;
  } & IPaginationInput;
}
