import {
  GetManagementWeightsByBasin,
  GetManagementWeightsByBasinUseCaseProtocol,
} from "../../../../../domain/use-cases/management/get-weights-by-basin.useCase";
import { ManagementWeightsRepository } from "../../../../../infra/database/postgres/repositories/management-weights.repository";

export const makeGetManagementWeightsByBasinUseCase =
  (): GetManagementWeightsByBasinUseCaseProtocol.UseCase => {
    return new GetManagementWeightsByBasin(new ManagementWeightsRepository());
  };
