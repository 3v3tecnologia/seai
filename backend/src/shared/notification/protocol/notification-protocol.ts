export type NotificationErrorProps = {
  message: string;
  context?: string;
  stack?: string;
  name?: string;
};

export interface NotificationProtocol {
  addError(error: NotificationErrorProps): void;
  hasErrors(): boolean;
  getErrors(): Array<NotificationErrorProps>;
  messages(context?: string): string;
}
