import {
  InsertManagementWeightsByBasin,
  InsertManagementWeightsByBasinUseCaseProtocol,
} from "../../../../../domain/use-cases/management/insert-weights.useCase";
import { ManagementWeightsRepository } from "../../../../../infra/database/postgres/repositories/management-weights.repository";

export const makeInsertManagementWeightsUseCase =
  (): InsertManagementWeightsByBasin => {
    return new InsertManagementWeightsByBasin(
      new ManagementWeightsRepository()
    );
  };
