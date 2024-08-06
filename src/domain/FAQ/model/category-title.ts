import { Either, left, right } from "../../../shared/Either";
import { NullOrUndefinedError } from "../../../shared/errors/null-or-undefined";
import { AgainstNullOrUndefined } from "../../../shared/utils/against-null-or-undefined";

export class CategoryTitle {
  static maxLength = 50;
  private title: string;

  private constructor(title: string) {
    this.title = title;
  }

  get value(): string {
    return this.title;
  }

  static create(
    title: string
  ): Either<NullOrUndefinedError | Error, CategoryTitle> {
    const titleNullOrUndefined = AgainstNullOrUndefined(title, "título");

    if (titleNullOrUndefined.isLeft()) {
      return left(titleNullOrUndefined.value);
    } else {
      if (title.length === 0 || title.length > CategoryTitle.maxLength) {
        return left(
          new Error(
            `título não pode ser vazia e nem maior do que ${CategoryTitle.maxLength} caracteres`
          )
        );
      }
    }
    return right(new CategoryTitle(title));
  }
}
