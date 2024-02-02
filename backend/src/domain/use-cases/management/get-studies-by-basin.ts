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

  private formatPaginationInput(page: number, limit: number) {
    return {
      pageNumber: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 40,
    };
  }

  async execute(
    request: GetManagementStudiesByBasinUseCaseProtocol.Request
  ): GetManagementStudiesByBasinUseCaseProtocol.Response {
    const result = await this.repository.getByBasin({
      Id_Bacia: request.Id,
      ...this.formatPaginationInput(request.pageNumber, request.limit),
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
