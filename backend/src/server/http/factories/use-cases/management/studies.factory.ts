import { DeleteManagementStudiesByBasin } from "../../../../../domain/use-cases/management/delete-management-studies-by-basin";
import {
  GetManagementStudiesByBasin,
  GetManagementStudiesByBasinUseCaseProtocol,
} from "../../../../../domain/use-cases/management/get-studies-by-basin";
import { InsertManagementStudiesByBasin } from "../../../../../domain/use-cases/management/insert-studies";
import { DbManagementStudiesRepository } from "../../../../../infra/database/postgres/repositories/management-studies.repository";

export class ManagementUseCasesFactory {
  private static repository = new DbManagementStudiesRepository();

  static makeDeleteManagementStudiesByBasin(): DeleteManagementStudiesByBasin {
    return new DeleteManagementStudiesByBasin(this.repository);
  }

  static makeGetManagementStudiesByBasin(): GetManagementStudiesByBasinUseCaseProtocol.UseCase {
    return new GetManagementStudiesByBasin(this.repository);
  }

  static makeInsertManagementStudies(): InsertManagementStudiesByBasin {
    return new InsertManagementStudiesByBasin(this.repository);
  }
}
