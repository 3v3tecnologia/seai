import {
  CreateCron,
  CreateCronUseCaseProtocol,
  CreateJob,
  CreateJobUseCaseProtocol,
  DeleteCron,
  DeleteCronUseCaseProtocol,
  DeleteJob,
  DeleteJobUseCaseProtocol,
  FetchCron,
  FetchCronUseCaseProtocol,
  FetchJobUseCaseProtocol,
  FetchJobs,
  FetchJobsStates,
  FetchJobsStatesUseCaseProtocol,
  UpdateCron,
  UpdateCronUseCaseProtocol,
  UpdateJob,
  UpdateJobUseCaseProtocol,
  DeleteJobByKeyUseCaseProtocol,
  DeleteJobByKey
} from "../../../../domain/use-cases/jobs";

import { DbBackgroundJobsRepository } from "../../../../infra/database/postgres/repositories/background-jobs-repository";

export class JobsUseCasesFactory {
  static repository = new DbBackgroundJobsRepository();

  static makeCreateCron(): CreateCronUseCaseProtocol.UseCase {
    return new CreateCron(this.repository);
  }

  static makeCreateJob(): CreateJobUseCaseProtocol.UseCase {
    return new CreateJob(this.repository);
  }

  static makeDeleteCron(): DeleteCronUseCaseProtocol.UseCase {
    return new DeleteCron(this.repository);
  }

  static makeDeleteJob(): DeleteJobUseCaseProtocol.UseCase {
    return new DeleteJob(this.repository);
  }
  static makeDeleteJobByKey(): DeleteJobByKeyUseCaseProtocol.UseCase {
    return new DeleteJobByKey(this.repository);
  }

  static makeFetchCron(): FetchCronUseCaseProtocol.UseCase {
    return new FetchCron(this.repository);
  }

  static makeFetchJob(): FetchJobUseCaseProtocol.UseCase {
    return new FetchJobs(this.repository);
  }

  static makeFetchJobsStates(): FetchJobsStatesUseCaseProtocol.UseCase {
    return new FetchJobsStates(this.repository);
  }

  static makeUpdateCron(): UpdateCronUseCaseProtocol.UseCase {
    return new UpdateCron(this.repository);
  }

  static makeUpdateJob(): UpdateJobUseCaseProtocol.UseCase {
    return new UpdateJob(this.repository);
  }
}
