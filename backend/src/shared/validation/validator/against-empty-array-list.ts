import { Either, left, right } from "../../Either";
import { EmptyArrayList } from "../errors/empty-array-list";
import { UnmatchedFields } from "../errors/unmatch-fields";

export function AgainstEmptyArrayList(
  field: Array<any>,
  fieldName: string
): Either<UnmatchedFields, null> {
  if (field.length === 0) {
    return left(new EmptyArrayList(fieldName));
  }
  return right(null);
}
