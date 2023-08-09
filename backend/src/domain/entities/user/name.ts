import { Either, left, right } from "../../../shared/Either";

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

  static create(name: string): Either<Error, UserName> {
    if (name.length === 0 || name.length > UserName.maxLength) {
      return left(new Error("Nome não deve ser vazio ou nulo"));
    }
    return right(new UserName(name));
  }
}
