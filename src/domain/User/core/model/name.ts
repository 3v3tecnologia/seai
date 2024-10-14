import { Either, left, right } from "../../../../shared/Either";

export class UserName {
  public static maxLength: number = 50;
  public static minLength: number = 2;

  private name: string;

  private constructor(name: string) {
    this.name = name;
  }

  get value(): string {
    return this.name;
  }

  static create(name: string | null): Either<Error, UserName> {
    if (!name || name.length === 0 || name.length > UserName.maxLength) {
      return left(new Error("Nome não deve ser vazio ou nulo"));
    }
    if (name.length > UserName.maxLength) {
      return left(
        new Error(
          `Nome não deve ser maior do que ${UserName.maxLength} caracteres.`
        )
      );
    }
    if (name.length < UserName.minLength) {
      return left(
        new Error(
          `Nome não deve ser menor do que ${UserName.maxLength} caracteres.`
        )
      );
    }
    return right(new UserName(name));
  }
}
