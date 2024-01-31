import { InsertManagementWeightsByBasin } from "../../../../../domain/use-cases/management/insert-weights.useCase";
import { DbManagementWeightsRepository } from "../../../../../infra/database/postgres/repositories/management-weights.repository";

export const makeInsertManagementWeightsUseCase =
  (): InsertManagementWeightsByBasin => {
    return new InsertManagementWeightsByBasin(
      new DbManagementWeightsRepository()
    );
  };
