import {
  UpdateJob,
  UpdateJobUseCaseProtocol,
} from "../../../../../domain/use-cases/jobs";

import { DbBackgroundJobsRepository } from "../../../../../infra/database/postgres/repositories/background-jobs-repository";

export const makeUpdateJobUseCase = (): UpdateJobUseCaseProtocol.UseCase => {
  return new UpdateJob(new DbBackgroundJobsRepository());
};
