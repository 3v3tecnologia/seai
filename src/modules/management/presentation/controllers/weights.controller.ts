import { formatPaginationInput } from "../../../../shared/core/formatPaginationInput";
import { IPaginationInput } from "../../../../shared/core/pagination";
import {
  created,
  forbidden,
  serverError,
} from "../../../presentation/controllers/helpers";
import { HttpResponse } from "../../../shared/presentation/ports";
import { ManagementWeightsUseCases } from "../services/weights";

export class ManagementWeightsController {
  static async create(request: {
    accountId: number;
    id: number;
    data: Array<any>;
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

  static async getByBasin(
    request: {
      accountId: number;
      id: number;
    } & IPaginationInput
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
