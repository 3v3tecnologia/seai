import { InputWithPagination } from "../../../domain/use-cases/helpers/dto";
import { formatPaginationInput } from "../../../domain/use-cases/helpers/formatPaginationInput";
import {
  created,
  forbidden,
  serverError,
} from "../../../presentation/controllers/helpers";
import { HttpResponse } from "../../../presentation/controllers/ports";
import { CultureWeights } from "../entities/weights";
import { ManagementWeightsUseCases } from "../services/weights";

export class ManagementWeightsController {
  static async create(request: {
    accountId: number;
    id: number;
    data: Array<CultureWeights>;
  }): Promise<HttpResponse> {
    try {
      const deletedOrError = await ManagementWeightsUseCases.create({
        id_basin: Number(request.id),
        weights: request.data,
      });

      if (deletedOrError.isLeft()) {
        return forbidden(deletedOrError.value);
      }

      //   await this.userLogs.log(request.accountId, this.useCase);

      return created(deletedOrError.value);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }

  static async delete(request: {
    accountId: number;
    id: number;
  }): Promise<HttpResponse> {
    try {
      const deletedOrError = await ManagementWeightsUseCases.deleteByBasin({
        id: request.id,
      });

      if (deletedOrError.isLeft()) {
        return forbidden(deletedOrError.value);
      }

      //   await this.userLogs.log(request.accountId, this.useCase);

      return created(deletedOrError.value);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }

  static async getByBasin(
    request: {
      accountId: number;
      id: number;
    } & InputWithPagination
  ): Promise<HttpResponse> {
    try {
      const deletedOrError = await ManagementWeightsUseCases.getByBasin({
        id_basin: Number(request.id),
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
