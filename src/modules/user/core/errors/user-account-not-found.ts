export class AccountNotFoundError extends Error {
  constructor() {
    super("Falha ao buscar usuário");
    this.name = "AccountNotFound";
  }
}
