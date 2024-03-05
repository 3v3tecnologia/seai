export class UnregisteredCultureError extends Error {
  constructor() {
    super("Unregistered Culture.");
    this.name = "UnregisteredCultureError";
  }
}
