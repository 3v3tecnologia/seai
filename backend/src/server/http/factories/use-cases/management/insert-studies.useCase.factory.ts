import { InsertManagementStudiesByBasin } from "../../../../../domain/use-cases/management/insert-studies.useCase";
import { ManagementStudiesRepository } from "../../../../../infra/database/postgres/repositories/management-studies.repository";

export const makeInsertManagementStudiesUseCase =
  (): InsertManagementStudiesByBasin => {
    return new InsertManagementStudiesByBasin(
      new ManagementStudiesRepository()
    );
  };
