import {
  GetManagementStudiesByBasin,
  GetManagementStudiesByBasinUseCaseProtocol,
} from "../../../../../domain/use-cases/management/get-studies-by-basin.useCase";
import { ManagementStudiesRepository } from "../../../../../infra/database/postgres/repositories/management-studies.repository";

export const makeGetManagementStudiesByBasinUseCase =
  (): GetManagementStudiesByBasinUseCaseProtocol.UseCase => {
    return new GetManagementStudiesByBasin(new ManagementStudiesRepository());
  };
