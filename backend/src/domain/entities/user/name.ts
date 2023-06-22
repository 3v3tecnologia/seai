import { InvalidLoginError } from "./errors/invalid-login";

export class UserName {
  public static maxLength: number = 20;
  public static minLength: number = 2;

  private name: string;

  private constructor(name: string) {
    this.name = name;
  }

  get value(): string {
    return this.name;
  }

  static create(name: string) {
    if (name.length === 0 || name.length > UserName.maxLength) {
      return {
        isError: true,
        value: new InvalidLoginError(),
      };
    }
    return {
      isError: false,
      value: new UserName(name),
    };
  }
}
