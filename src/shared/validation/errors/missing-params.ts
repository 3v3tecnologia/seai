export class MissingParamsError extends Error {
  constructor(field: string) {
    super(`The ${field} is required`);
    this.name = "MissingParamsError";
  }
}
