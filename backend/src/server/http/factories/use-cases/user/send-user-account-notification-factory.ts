import { ScheduleUserAccountNotification } from "../../../../../domain/use-cases/user/send-notification-to-user/send-notification-to-user";
import { makeCreateJobUseCase } from "../jobs";

export const makeSendNotificationToUser =
  (): ScheduleUserAccountNotification => {
    return new ScheduleUserAccountNotification(makeCreateJobUseCase());
  };
