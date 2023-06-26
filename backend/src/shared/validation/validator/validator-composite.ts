import { Either, left, right } from "../../Either";
import { Validator } from "../ports/validator";

export class ValidatorComposite implements Validator {
  private readonly validations: Array<Validator>;

  constructor(validations: Array<Validator>) {
    this.validations = validations;
  }

  validate(input: any): Either<Error, null> {
    for (const validation of this.validations) {
      const result = validation.validate(input);
      if (result.isLeft()) {
        return left(result.value);
      }
    }
    return right(null);
  }
}
