export class AccountEmailNotFound extends Error {
  constructor(email: string) {
    super("User " + email + " not registered.");
    this.name = "AccountEmailNotFound";
  }
}
