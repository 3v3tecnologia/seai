import {
  FetchCron,
  FetchCronUseCaseProtocol,
} from "../../../../../domain/use-cases/jobs";
import { DbBackgroundJobsRepository } from "../../../../../infra/database/postgres/repositories/background-jobs-repository";

export const makeFetchCronUseCase = (): FetchCronUseCaseProtocol.UseCase => {
  return new FetchCron(new DbBackgroundJobsRepository());
};
