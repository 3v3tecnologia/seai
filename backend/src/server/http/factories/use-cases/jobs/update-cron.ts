import {
  UpdateCron,
  UpdateCronUseCaseProtocol,
} from "../../../../../domain/use-cases/jobs";
import { DbBackgroundJobsRepository } from "../../../../../infra/database/postgres/repositories/background-jobs-repository";

export const makeUpdateCronUseCase = (): UpdateCronUseCaseProtocol.UseCase => {
  return new UpdateCron(new DbBackgroundJobsRepository());
};
