import { InputWithPagination } from "../../../domain/use-cases/helpers/dto";
import { formatPaginationInput } from "../../../domain/use-cases/helpers/formatPaginationInput";
import {
  badRequest,
  created,
  forbidden,
  ok,
  serverError,
} from "../../../presentation/controllers/helpers";
import { HttpResponse } from "../../../presentation/controllers/ports";
import { CensusStudy } from "../entities/study";
import { ManagementStudiesUseCases } from "../services/studies";

export class ManagementStudiesControllers {
  static async create(request: {
    accountId: number;
    id: number;
    data: Array<Omit<CensusStudy, "Id_Basin">>;
  }): Promise<HttpResponse> {
    try {
      const successOrError = await ManagementStudiesUseCases.create({
        id_basin: request.id,
        data: request.data,
      });

      if (successOrError.isLeft()) {
        return badRequest(successOrError.value);
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
      const deletedOrError = await ManagementStudiesUseCases.getByBasin(
        request.id
      );

      if (deletedOrError.isLeft()) {
        return badRequest(deletedOrError.value);
      }

      return ok(deletedOrError.value);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }
}
