export class AccountEmailNotFound extends Error {
  constructor(email: string) {
    super("Usuário " + email + " não registrado");
    this.name = "AccountEmailNotFound";
  }
}
