import { DeleteManagementStudiesByBasin } from "../../../../../domain/use-cases/management/delete-management-studies-by-basin.useCase";
import { DbManagementStudiesRepository } from "../../../../../infra/database/postgres/repositories/management-studies.repository";

export const makeDeleteManagementStudiesByBasinUseCase =
  (): DeleteManagementStudiesByBasin => {
    return new DeleteManagementStudiesByBasin(
      new DbManagementStudiesRepository()
    );
  };
