import { Either, left, right } from "../../Either";
import { UnmatchedFields } from "../errors/unmatch-fields";

export function CompareFieldsValidation(
  fieldName: string,
  fieldToCompareName: string
): Either<UnmatchedFields, null> {
  if (fieldName !== fieldToCompareName) {
    return left(new UnmatchedFields(fieldToCompareName));
  }
  return right(null);
}
