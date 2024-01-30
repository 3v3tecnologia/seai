import { Either, right } from "../../../shared/Either";
import { ManagementWeight } from "../../entities/management/weights";
import { ManagementWeightsRepositoryProtocol } from "../_ports/repositories/management-weights.repository";
import { InputWithPagination, OutputWithPagination } from "../helpers/dto";

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
    const pageNumber = request.pageNumber ? Number(request.pageNumber) : 40;
    const limit = request.limit ? Number(request.limit) : 40;

    const result = await this.repository.getByBasin({
      Id_Bacia: request.Id,
      limit,
      pageNumber,
    });

    return right(result);
  }
}

export namespace GetManagementWeightsByBasinUseCaseProtocol {
  export type Request = {
    Id: number;
  } & InputWithPagination;

  export type Response = Promise<
    Either<Error, OutputWithPagination<Array<ManagementWeight>> | null>
  >;

  export interface UseCase {
    execute(request: Request): Response;
  }
}
