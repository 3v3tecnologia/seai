export class UserNotFoundError extends Error {
  constructor() {
    super("Falha ao buscar usuário");
    this.name = "UserNotFoundError";
  }
}
