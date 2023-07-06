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