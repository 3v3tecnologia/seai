export class NullOrUndefinedError extends Error {
  constructor(field: string) {
    super(`The ${field} is null or undefined`);
    this.name = "NullOrUndefinedError";
  }
}
