export class NotExistsError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = "NotExistsError";
  }
}
