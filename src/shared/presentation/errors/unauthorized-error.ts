export class UnauthorizedError extends Error {
  constructor() {
    super("Não autorizado, necessário realizar o login");
    this.name = "UnauthorizedError";
  }
}
