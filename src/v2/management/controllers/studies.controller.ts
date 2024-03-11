import { InputWithPagination } from "../../../domain/use-cases/helpers/dto";
import { formatPaginationInput } from "../../../domain/use-cases/helpers/formatPaginationInput";
import {
  created,
  forbidden,
  serverError,
} from "../../../presentation/controllers/helpers";
import { HttpResponse } from "../../../presentation/controllers/ports";
import { ManagementCensusStudy } from "../entities/study";
import { ManagementStudiesUseCases } from "../services/studies";

export class ManagementStudiesControllers {
  static async create(request: {
    accountId: number;
    id: number;
    Data: Array<ManagementCensusStudy>;
  }): Promise<HttpResponse> {
    try {
      const successOrError = await ManagementStudiesUseCases.create({
        Id_Basin: request.id,
        Data: request.Data,
      });

      if (successOrError.isLeft()) {
        return forbidden(successOrError.value);
      }

      //   await this.userLogs.log(request.accountId, this.useCase);

      return created(successOrError.value);
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
      const deletedOrError = await ManagementStudiesUseCases.getByBasin({
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
  static async delete(request: {
    accountId: number;
    id: number;
  }): Promise<HttpResponse> {
    try {
      const deletedOrError = await ManagementStudiesUseCases.deleteByBasin({
        Id: request.id,
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
}
