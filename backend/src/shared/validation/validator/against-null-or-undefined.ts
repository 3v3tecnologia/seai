import { Either, left, right } from "../../Either";
import { NullOrUndefinedError } from "../errors/null-or-undefined";
import { UnmatchedFields } from "../errors/unmatch-fields";
import { Validator } from "../ports/validator";

export class AgainstNullOrUndefined implements Validator {
  constructor(private readonly fieldName: string) {}

  validate(field: any): Either<UnmatchedFields, null> {
    if (field === null || field === undefined) {
      return left(new NullOrUndefinedError(this.fieldName));
    }
    return right(null);
  }
}
