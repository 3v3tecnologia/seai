export class AccessDeniedError extends Error {
  constructor() {
    super("Access negado, permissão necessária.");
    this.name = "AccessDeniedError";
  }
}
