export class AccountNotFoundError extends Error {
  constructor(login: string) {
    super("User " + login + " not found.");
    this.name = "AccountNotFound";
  }
}
