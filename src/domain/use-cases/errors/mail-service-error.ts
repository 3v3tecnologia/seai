export class MailServiceError extends Error {
  constructor(error: Error) {
    super("Mail service error.");
    this.name = "MailServiceError";
    this.stack = error.stack;
    console.log(error);
  }
}
