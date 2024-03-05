import {
  CreateCronController,
  CreateJobController,
  DeleteCronController,
  DeleteJobController,
  FetchCronController,
  FetchJobsController,
  FetchJobsStatesController,
  UpdateCronController,
  UpdateJobController,
} from "../../../../presentation/controllers/jobs";
import { Controller } from "../../../../presentation/controllers/ports/controllers";
import { makeLogControllerDecorator } from "../decorators";
import { JobsUseCasesFactory } from "../use-cases";

export class BackgroundJobsControllerFactory {
  static makeCreateCron(): Controller {
    return makeLogControllerDecorator(
      new CreateCronController(JobsUseCasesFactory.makeCreateCron())
    );
  }
  static makeCreateJob(): Controller {
    return makeLogControllerDecorator(
      new CreateJobController(JobsUseCasesFactory.makeCreateJob())
    );
  }
  static makeDeleteCron(): Controller {
    return makeLogControllerDecorator(
      new DeleteCronController(JobsUseCasesFactory.makeDeleteCron())
    );
  }
  static makeDeleteJob(): Controller {
    return makeLogControllerDecorator(
      new DeleteJobController(JobsUseCasesFactory.makeDeleteJob())
    );
  }
  static makeFetchCron(): Controller {
    return new FetchCronController(JobsUseCasesFactory.makeFetchCron());
  }
  static makeFetchJobs(): Controller {
    return makeLogControllerDecorator(
      new FetchJobsController(JobsUseCasesFactory.makeFetchJob())
    );
  }
  static makeFetchJobsStates(): Controller {
    return new FetchJobsStatesController(
      JobsUseCasesFactory.makeFetchJobsStates()
    );
  }
  static makeUpdateCron(): Controller {
    return makeLogControllerDecorator(
      new UpdateCronController(JobsUseCasesFactory.makeUpdateCron())
    );
  }
  static makeUpdateJob(): Controller {
    return makeLogControllerDecorator(
      new UpdateJobController(JobsUseCasesFactory.makeUpdateJob())
    );
  }
}
