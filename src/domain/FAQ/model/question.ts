import { Either, left, right } from "../../../shared/Either";
import { NullOrUndefinedError } from "../../../shared/errors/null-or-undefined";
import { AgainstNullOrUndefined } from "../../../shared/utils/against-null-or-undefined";

export class Question {
  static questionMaxLength = 300;
  private question: string;

  private constructor(question: string) {
    this.question = question;
  }

  get value(): string {
    return this.question;
  }

  static create(
    question: string
  ): Either<NullOrUndefinedError | Error, Question> {
    const nullOrUndefined = AgainstNullOrUndefined(question, "pergunta");

    if (nullOrUndefined.isLeft()) {
      return left(nullOrUndefined.value);
    }

    if (question.length === 0 || question.length > Question.questionMaxLength) {
      return left(
        new Error(
          `questão não pode ser vazia e nem maior do que ${Question.questionMaxLength}`
        )
      );
    }

    return right(new Question(question));
  }
}
