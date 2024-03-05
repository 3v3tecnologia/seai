export class InvalidEmailError extends Error {
  constructor(msg: string) {
    super(`The email is invalid. ${msg}`);
    this.name = "InvalidEmailError";
  }
}
