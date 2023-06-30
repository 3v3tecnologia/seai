import { Either, left, right } from "../../Either";
import { EmptyArrayList } from "../errors/empty-array-list";
import { UnmatchedFields } from "../errors/unmatch-fields";
import { Validator } from "../ports/validator";

export class AgainstEmptyArrayList implements Validator {
  constructor(private readonly fieldName: string) {}

  validate(field: Array<any>): Either<UnmatchedFields, null> {
    if (field.length === 0) {
      return left(new EmptyArrayList(this.fieldName));
    }
    return right(null);
  }
}
