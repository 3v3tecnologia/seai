export class FailToDeleteUserError extends Error {
  constructor() {
    super("Fail to delete user");
    this.name = "FailToDeleteUserError";
  }
}
