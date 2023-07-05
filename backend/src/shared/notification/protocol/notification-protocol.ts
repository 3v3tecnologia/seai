export type NotificationProps = {
  message: string;
  context: string;
};

export interface NotificationProtocol {
  addError(error: NotificationProps): void;
  hasErrors(): boolean;
  getErrors(): Array<NotificationProps>;
  messages(context?: string): string;
}
