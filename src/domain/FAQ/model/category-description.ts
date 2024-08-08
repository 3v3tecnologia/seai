import { Either, left, right } from "../../../shared/Either";
import { NullOrUndefinedError } from "../../../shared/errors/null-or-undefined";
import { AgainstNullOrUndefined } from "../../../shared/utils/against-null-or-undefined";

export class CategoryDescription {
  static maxLength = 50;
  private description: string;

  private constructor(description: string) {
    this.description = description;
  }

  get value(): string {
    return this.description;
  }

  static create(
    description: string
  ): Either<NullOrUndefinedError | Error, CategoryDescription> {
    const descriptionNullOrUndefined = AgainstNullOrUndefined(
      description,
      "descrição"
    );

    if (descriptionNullOrUndefined.isLeft()) {
      return left(descriptionNullOrUndefined.value);
    } else {
      if (
        description.length === 0 ||
        description.length > CategoryDescription.maxLength
      ) {
        return left(
          new Error(
            `descrição não pode ser vazia e nem maior do que ${CategoryDescription.maxLength} caracteres`
          )
        );
      }
    }
    return right(new CategoryDescription(description));
  }
}
