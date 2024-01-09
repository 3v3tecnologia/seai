import {
  CreateJob,
  CreateJobUseCaseProtocol,
} from "../../../../../domain/use-cases/jobs";

import { DbBackgroundJobsRepository } from "../../../../../infra/database/postgres/repositories/background-jobs-repository";

export const makeCreateJobUseCase = (): CreateJobUseCaseProtocol.UseCase => {
  return new CreateJob(new DbBackgroundJobsRepository());
};
