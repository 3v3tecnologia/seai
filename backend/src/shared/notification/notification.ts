import {
  NotificationProps,
  NotificationProtocol,
} from "./protocol/notification-protocol";

export class Notification implements NotificationProtocol {
  addError(error: NotificationProps): void {
    throw new Error("Method not implemented.");
  }
  hasErrors(): boolean {
    throw new Error("Method not implemented.");
  }
  getErrors(): NotificationProps[] {
    throw new Error("Method not implemented.");
  }
  messages(context?: string | undefined): string {
    throw new Error("Method not implemented.");
  }
}
