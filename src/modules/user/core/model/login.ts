import { Either, left, right } from "../../../../shared/Either";
import { InvalidLoginError } from "../errors/invalid-login";

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

  static create(login?: string | null): Either<InvalidLoginError, UserLogin> {
    if (!login || login.length === 0 || login.length > UserLogin.maxLength) {
      return left(new InvalidLoginError());
    }
    return right(new UserLogin(login));
  }
}
