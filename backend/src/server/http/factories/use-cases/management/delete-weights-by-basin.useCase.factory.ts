import { DeleteManagementWeightsByBasin } from "../../../../../domain/use-cases/management/delete-weights-by-basin.useCase";
import { ManagementWeightsRepository } from "../../../../../infra/database/postgres/repositories/management-weights.repository";

export const makeDeleteManagementWeightsByBasinUseCase =
  (): DeleteManagementWeightsByBasin => {
    return new DeleteManagementWeightsByBasin(
      new ManagementWeightsRepository()
    );
  };
