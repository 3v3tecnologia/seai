import { Either } from "../../../shared/Either";
import { AvailablesEmailServices } from "../helpers/availables-notification-services";
import { CreateJobUseCaseProtocol } from "../jobs";


export class ScheduleUserAccountNotification {
  private readonly backgroundJobs: CreateJobUseCaseProtocol.UseCase;

  constructor(backgroundJobs: CreateJobUseCaseProtocol.UseCase) {
    this.backgroundJobs = backgroundJobs;
  }

  async schedule(params: {
    user: { email: string, base64Code: string };
    templateName: AvailablesEmailServices;
  }): Promise<Either<Error, any | null>> {
    return await this.backgroundJobs.execute({
      name: "user-account-notification",
      priority: 1,
      retryDelay: 60,
      retryLimit: 3,
      data: {
        email: params.user.email,
        base64Code: params.user.base64Code,
        templateName: params.templateName,
      },
    });
  }
}
