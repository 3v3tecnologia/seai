import { Either, right } from "../../../shared/Either";
import { ManagementCensusStudy } from "../../entities/management/study";
import { ManagementStudiesRepositoryProtocol } from "../_ports/repositories/management-studies.repository";
import { InputWithPagination, OutputWithPagination } from "../helpers/dto";
import { formatPaginationInput } from "../helpers/formatPaginationInput";

export class GetManagementStudiesByBasin
  implements GetManagementStudiesByBasinUseCaseProtocol.UseCase
{
  private repository: ManagementStudiesRepositoryProtocol;

  constructor(repository: ManagementStudiesRepositoryProtocol) {
    this.repository = repository;
  }

  async execute(
    request: GetManagementStudiesByBasinUseCaseProtocol.Request
  ): GetManagementStudiesByBasinUseCaseProtocol.Response {
    const result = await this.repository.getByBasin({
      Id_Basin: request.Id_Basin,
      ...formatPaginationInput(request.pageNumber, request.limit),
    });

    return right(result);
  }
}

export namespace GetManagementStudiesByBasinUseCaseProtocol {
  export type Request = {
    Id_Basin: number;
  } & InputWithPagination;

  export type Response = Promise<
    Either<Error, OutputWithPagination<ManagementCensusStudy> | null>
  >;

  export interface UseCase {
    execute(request: Request): Response;
  }
}
