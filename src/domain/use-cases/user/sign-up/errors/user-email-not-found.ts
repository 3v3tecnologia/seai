export class AccountEmailNotFound extends Error {
  constructor(email: string) {
    super("Usuário " + email + " não registrado");
    this.name = "AccountEmailNotFound";
  }
}
export class UserModulesNotFound extends Error {
  constructor() {
    super("Acesso do usuário não existe");
    this.name = "UserModulesNotFound";
  }
}
