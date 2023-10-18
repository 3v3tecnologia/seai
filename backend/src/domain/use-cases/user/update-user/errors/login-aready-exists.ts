export class LoginAlreadyExists extends Error {
  constructor(login: string) {
    super(`Usuário com login "${login}" já existe`);
    this.name = "LoginAlreadyExists";
  }
}
