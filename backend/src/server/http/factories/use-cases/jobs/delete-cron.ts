import {
  DeleteCron,
  DeleteCronUseCaseProtocol,
} from "../../../../../domain/use-cases/jobs";
import { DbBackgroundJobsRepository } from "../../../../../infra/database/postgres/repositories/background-jobs-repository";

export const makeDeleteCronUseCase = (): DeleteCronUseCaseProtocol.UseCase => {
  return new DeleteCron(new DbBackgroundJobsRepository());
};
