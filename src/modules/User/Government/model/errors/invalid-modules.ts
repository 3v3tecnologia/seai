import { DomainError } from "./errors";

export class InvalidUserModulesError extends Error implements DomainError {
  constructor(module: string) {
    super(`The ${module} is invalid.`);
    this.name = "InvalidEmailError";
  }
}
