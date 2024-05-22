import { Either } from "../../Either";

export interface Validator {
  validate(input: any): Either<Error, null>;
}
