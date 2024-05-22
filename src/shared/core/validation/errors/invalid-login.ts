export class InvalidLoginError extends Error {
  constructor() {
    super(`The login is invalid.`);
    this.name = "InvalidLoginError";
  }
}
