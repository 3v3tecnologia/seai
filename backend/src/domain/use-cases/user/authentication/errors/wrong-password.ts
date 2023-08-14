export class WrongPasswordError extends Error {
  constructor() {
    super("Senha errada");
    this.name = "WrongPasswordError";
  }
}
export class UnmatchedPasswordError extends Error {
  constructor() {
    super("Confirme a senha");
    this.name = "UnmatchedPasswordError";
  }
}
