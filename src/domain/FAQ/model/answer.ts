import { Either, left, right } from "../../../shared/Either";
import { NullOrUndefinedError } from "../../../shared/errors/null-or-undefined";
import { AgainstNullOrUndefined } from "../../../shared/utils/against-null-or-undefined";

export class Answer {
  private answer: string;

  private constructor(answer: string) {
    this.answer = answer;
  }

  get value(): string {
    return this.answer;
  }

  static create(answer: string): Either<NullOrUndefinedError | Error, Answer> {
    const nullOrUndefined = AgainstNullOrUndefined(answer, "answer");

    if (nullOrUndefined.isLeft()) {
      return left(nullOrUndefined.value);
    }

    if (answer.length === 0) {
      return left(new Error("resposta não pode ser vazia"));
    }

    return right(new Answer(answer));
  }
}
