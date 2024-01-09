import {
  DeleteJob,
  DeleteJobUseCaseProtocol,
} from "../../../../../domain/use-cases/jobs";

import { DbBackgroundJobsRepository } from "../../../../../infra/database/postgres/repositories/background-jobs-repository";

export const makeDeleteJobUseCase = (): DeleteJobUseCaseProtocol.UseCase => {
  return new DeleteJob(new DbBackgroundJobsRepository());
};
