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
    let messages: Array<string> = [];

    this.errors.forEach((error) => {
      messages.push(error.message);
    });

    return messages.join("; ");
  }
}
