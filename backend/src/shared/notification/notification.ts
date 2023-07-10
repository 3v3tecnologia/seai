import {
  NotificationErrorProps,
  NotificationProtocol,
} from "./protocol/notification-protocol";

export class Notification implements NotificationProtocol {
  private readonly errors: Array<NotificationErrorProps> = [];
  addError(error: NotificationErrorProps): void {
    this.errors.push(error);
  }
  hasErrors(): boolean {
    return this.errors.length > 0;
  }
  getErrors(): NotificationErrorProps[] {
    return this.errors;
  }
  messages(context?: string | undefined): string {
    let message = "";

    this.errors.forEach((error) => {
      message += error.message + "\n";
    });

    return message;
  }
}
