import { DomainError } from "./errors";

export class InvalidLoginError extends Error implements DomainError {
  constructor() {
    super(`The login is invalid.`);
    this.name = "InvalidLoginError";
  }
}
