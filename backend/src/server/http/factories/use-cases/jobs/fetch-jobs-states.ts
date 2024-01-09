import {
  FetchJobsStates,
  FetchJobsStatesUseCaseProtocol,
} from "../../../../../domain/use-cases/jobs";

import { DbBackgroundJobsRepository } from "../../../../../infra/database/postgres/repositories/background-jobs-repository";

export const makeFetchJobsStatesUseCase =
  (): FetchJobsStatesUseCaseProtocol.UseCase => {
    return new FetchJobsStates(new DbBackgroundJobsRepository());
  };
