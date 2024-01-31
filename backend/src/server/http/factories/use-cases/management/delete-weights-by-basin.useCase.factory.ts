import { DeleteManagementWeightsByBasin } from "../../../../../domain/use-cases/management/delete-weights-by-basin.useCase";
import { DbManagementWeightsRepository } from "../../../../../infra/database/postgres/repositories/management-weights.repository";

export const makeDeleteManagementWeightsByBasinUseCase =
  (): DeleteManagementWeightsByBasin => {
    return new DeleteManagementWeightsByBasin(
      new DbManagementWeightsRepository()
    );
  };
