import {
  CreateCron,
  CreateCronUseCaseProtocol,
} from "../../../../../domain/use-cases/jobs";
import { DbBackgroundJobsRepository } from "../../../../../infra/database/postgres/repositories/background-jobs-repository";

export const makeCreateCronUseCase = (): CreateCronUseCaseProtocol.UseCase => {
  return new CreateCron(new DbBackgroundJobsRepository());
};
