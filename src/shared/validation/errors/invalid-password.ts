export class InvalidPasswordError extends Error {
  constructor(msg: string) {
    super(`Password invalid, ${msg}`);
    this.name = "InvalidPasswordError";
  }
}

export class UnmatchedPasswordError extends Error {
  constructor() {
    super(`The password is not matched`);
    this.name = "UnmatchedPasswordError";
  }
}
