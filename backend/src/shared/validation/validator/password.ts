import { Either, left, right } from "../../Either";
import {
  InvalidPasswordError,
  UnmatchedPasswordError,
} from "../errors/invalid-password";
import { Validator } from "../ports/validator";

export class PasswordValidator implements Validator {
  public static minLength: number = 6;

  private readonly fieldName: any;

  constructor(field: any) {
    this.fieldName = field;
  }
  validate(input: any): Either<InvalidPasswordError, null> {
    if (input[this.fieldName].length >= PasswordValidator.minLength) {
      return left(
        new InvalidPasswordError(
          `should be greater than ${PasswordValidator.minLength} characters.`
        )
      );
    }
    return right(null);
  }
}

export class ConfirmPasswordValidator implements Validator {
  private readonly fieldName: any;

  constructor(field: any) {
    this.fieldName = field;
  }
  validate({
    plainPassword,
    plainConfirmPassword,
  }: {
    plainPassword: string;
    plainConfirmPassword: string;
  }): Either<UnmatchedPasswordError, null> {
    if (plainPassword !== plainConfirmPassword) {
      return left(new UnmatchedPasswordError());
    }
    return right(null);
  }
}
