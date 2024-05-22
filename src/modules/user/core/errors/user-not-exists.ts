export class AccountNotFoundError extends Error {
  constructor() {
    super("User não encontrado");
    this.name = "AccountNotFound";
  }
}
