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
    user: { email: string; token: string };
    subject: string;
    action: AvailablesEmailServices;
  }): Promise<Either<Error, any | null>> {
    return await this.backgroundJobs.execute({
      name: "user-account-notification",
      priority: 2,
      retryDelay: 60,
      retryLimit: 3,
      data: {
        to: params.user.email,
        token: params.user.token,
        subject: params.subject,
        action: params.action,
      },
    });
  }
}
