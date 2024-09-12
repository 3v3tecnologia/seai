export class UserNameAlreadyExists extends Error {
  constructor() {
    super("Nome do usuário já existe");
    this.name = "NameAlreadyExists";
  }
}
