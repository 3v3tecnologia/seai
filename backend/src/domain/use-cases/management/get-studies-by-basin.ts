import { Either, right } from "../../../shared/Either";
import { ManagementCensusStudy } from "../../entities/management/study";
import { ManagementStudiesRepositoryProtocol } from "../_ports/repositories/management-studies.repository";
import { InputWithPagination, OutputWithPagination } from "../helpers/dto";

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

export namespace GetManagementStudiesByBasinUseCaseProtocol {
  export type Request = {
    Id: number;
  } & InputWithPagination;

  export type Response = Promise<
    Either<Error, OutputWithPagination<Array<ManagementCensusStudy>> | null>
  >;

  export interface UseCase {
    execute(request: Request): Response;
  }
}
