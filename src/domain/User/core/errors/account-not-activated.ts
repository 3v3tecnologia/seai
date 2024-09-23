export class InactivatedAccount extends Error {
  constructor() {
    super("Necessário ativar a conta");
    this.name = "LoginAlreadyExists";
  }
}
