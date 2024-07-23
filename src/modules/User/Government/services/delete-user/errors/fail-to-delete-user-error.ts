export class FailToDeleteUserError extends Error {
  constructor() {
    super("Falha ao deletar usuário");
    this.name = "FailToDeleteUserError";
  }
}
