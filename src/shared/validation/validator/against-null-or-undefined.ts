import { Either, left, right } from "../../Either";
import { NullOrUndefinedError } from "../errors/null-or-undefined";

export function AgainstNullOrUndefined(
  field: any,
  fieldName: string
): Either<NullOrUndefinedError, void> {
  if (field === null || field === undefined) {
    return left(new NullOrUndefinedError(fieldName));
  }
  return right();
}
