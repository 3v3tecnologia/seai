import { Validator } from "../ports/validator";
import { Either, left, right } from "../../Either";
import { MissingParamsError } from "../errors/missing-params";

export class RequiredFieldValidator implements Validator {
  private readonly fieldName: any;

  constructor(field: any) {
    this.fieldName = field;
  }

  validate(value: any): Either<Error, null> {
    console.log(
      "VALIDATOR ===== ",
      value + ":::",
      this.fieldName,
      " ",
      Reflect.has(value, this.fieldName)
    );
    if (!Reflect.has(value, this.fieldName)) {
      return left(new MissingParamsError(this.fieldName));
    }
    return right(null);
  }
}
