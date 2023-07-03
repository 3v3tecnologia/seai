import { Either, left, right } from "../../Either";
import { UnmatchedFields } from "../errors/unmatch-fields";
import { Validator } from "../ports/validator";

export class CompareFieldsValidation implements Validator {
  constructor(
    private readonly fieldName: string,
    private readonly fieldToCompareName: string
  ) {}

  validate(input: any): Either<UnmatchedFields, null> {
    if (input[this.fieldName] !== input[this.fieldToCompareName]) {
      return left(new UnmatchedFields(this.fieldToCompareName));
    }
    return right(null);
  }
}
