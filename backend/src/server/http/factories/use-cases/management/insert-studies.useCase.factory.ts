import { InsertManagementStudiesByBasin } from "../../../../../domain/use-cases/management/insert-studies.useCase";
import { DbManagementStudiesRepository } from "../../../../../infra/database/postgres/repositories/management-studies.repository";

export const makeInsertManagementStudiesUseCase =
  (): InsertManagementStudiesByBasin => {
    return new InsertManagementStudiesByBasin(
      new DbManagementStudiesRepository()
    );
  };
