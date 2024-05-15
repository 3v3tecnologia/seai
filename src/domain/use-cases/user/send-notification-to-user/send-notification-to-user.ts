import { Either } from "../../../../shared/Either";
import { CreateJobUseCaseProtocol } from "../../jobs";

export enum AvailablesEmailServices {
  CREATE_ACCOUNT = "createUserAccount",
  FORGOT_PASSWORD = "forgotUserPassword",
}
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
        code: params.user.base64Code,
        template: params.templateName,
      },
    });
  }
}
