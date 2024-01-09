import {
  FetchJobs,
  FetchJobUseCaseProtocol,
} from "../../../../../domain/use-cases/jobs";

import { DbBackgroundJobsRepository } from "../../../../../infra/database/postgres/repositories/background-jobs-repository";

export const makeFetchJobUseCase = (): FetchJobUseCaseProtocol.UseCase => {
  return new FetchJobs(new DbBackgroundJobsRepository());
};
