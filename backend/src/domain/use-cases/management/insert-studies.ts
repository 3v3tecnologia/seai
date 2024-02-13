import { Either, right } from "../../../shared/Either";
import {
  ManagementCensusStudy,
  ManagementStudyIndicator,
} from "../../entities/management/study";
import { Command } from "../_ports/core/command";
import { ManagementStudiesRepositoryProtocol } from "../_ports/repositories/management-studies.repository";

export class InsertManagementStudiesByBasin
  extends Command
  implements InsertManagementStudiesByBasinUseCaseProtocol.UseCase
{
  private repository: ManagementStudiesRepositoryProtocol;

  constructor(repository: ManagementStudiesRepositoryProtocol) {
    super();
    this.repository = repository;
  }

  async execute(
    request: InsertManagementStudiesByBasinUseCaseProtocol.Request
  ): InsertManagementStudiesByBasinUseCaseProtocol.Response {
    const deleteLog = await this.repository.delete({
      Id_Basin: request.Id_Basin,
    });

    this.addLog(deleteLog);

    const createLog = await this.repository.create(request.Data);

    this.addLog(createLog);

    return right(createLog.description);
  }
}

export namespace InsertManagementStudiesByBasinUseCaseProtocol {
  export type Request = {
    Id_Basin: number;
    Data: Array<ManagementCensusStudy>;
  };

  export type Response = Promise<Either<Error, string>>;

  export interface UseCase {
    execute(request: Request): Response;
  }
}
