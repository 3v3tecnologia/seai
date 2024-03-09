import { ManagementCensusStudy } from "../../../domain/entities/management/study";
import { InputWithPagination } from "../../../domain/use-cases/helpers/dto";
import { formatPaginationInput } from "../../../domain/use-cases/helpers/formatPaginationInput";
import { ManagementStudiesUseCases } from "../../../domain/use-cases/management/studies";
import { created, forbidden, serverError } from "../helpers";
import { HttpResponse } from "../ports";

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
