export class LoginAlreadyExists extends Error {
  constructor() {
    super(`Não é possível cadastar usuário com login já existente`);
    this.name = "LoginAlreadyExists";
  }
}
