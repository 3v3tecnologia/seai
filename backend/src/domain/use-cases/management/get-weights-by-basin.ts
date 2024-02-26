import { Either, right } from "../../../shared/Either";
import { ManagementWeights } from "../../entities/management/weights";
import { ManagementWeightsRepositoryProtocol } from "../_ports/repositories/management-weights.repository";
import { InputWithPagination, OutputWithPagination } from "../helpers/dto";
import { formatPaginationInput } from "../helpers/formatPaginationInput";

export class GetManagementWeightsByBasin
  implements GetManagementWeightsByBasinUseCaseProtocol.UseCase
{
  private repository: ManagementWeightsRepositoryProtocol;

  constructor(repository: ManagementWeightsRepositoryProtocol) {
    this.repository = repository;
  }

  async execute(
    request: GetManagementWeightsByBasinUseCaseProtocol.Request
  ): GetManagementWeightsByBasinUseCaseProtocol.Response {
    const result = await this.repository.getByBasin({
      Id_Basin: request.Id_Basin,
      ...formatPaginationInput(request.pageNumber, request.limit),
    });

    if (result == null) {
      return right(null);
    }

    // R = (S.Produtiva + S.Economiac + S.Social + S.hídrica) / 8
    // Corte = (R - 1) * 100

    const weights = result.Data;

    

    return right({
      Data: weights,
      Pagination: result.Pagination
    });
  }
}

export namespace GetManagementWeightsByBasinUseCaseProtocol {
  export type Request = {
    Id_Basin: number;
  } & InputWithPagination;

  export type Response = Promise<
    Either<Error, OutputWithPagination<ManagementWeights> | null>
  >;

  export interface UseCase {
    execute(request: Request): Response;
  }
}
