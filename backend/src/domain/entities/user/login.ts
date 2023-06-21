import { InvalidLoginError } from "./errors/invalid-login";

export class UserLogin {
  static maxLength: number = 60;
  static minLength: number = 20;
  private login: string;

  private constructor(login: string) {
    this.login = login;
  }

  get value(): string {
    return this.login;
  }

  static create(login: string) {
    if (login.length === 0 || login.length > UserLogin.maxLength) {
      return {
        isError: true,
        value: new InvalidLoginError(),
      };
    }
    return {
      isError: false,
      value: new UserLogin(login),
    };
  }
}
