import { HttpResponse } from "../ports";

import { InputWithPagination } from "../../../domain/use-cases/helpers/dto";
import { GetManagementWeightsByBasinUseCaseProtocol } from "../../../domain/use-cases/management/get-weights-by-basin";
import { created, forbidden, serverError } from "../helpers";
import { formatPaginationInput } from "../../../domain/use-cases/helpers/formatPaginationInput";

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
        Id: Number(request.id),
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

export namespace GetManagementWeightsByBasinControllerProtocol {
  export type Request = {
    accountId: number;
    id: number;
  } & InputWithPagination;
}
