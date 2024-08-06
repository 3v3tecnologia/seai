import { Either, left, right } from "../../../shared/Either";
import {
  GuardArgumentCollection,
  againstNullOrUndefinedBulk,
  concatenateMessages,
} from "../../../shared/Guard";
import { Notification } from "../../../shared/notification/notification";
import { NullOrUndefinedError } from "../../../shared/validation/errors/null-or-undefined";
import { Answer } from "./answer";
import { Category } from "./category";
import { Question } from "./question";

interface FaqProps {
  question: Question;
  answer: Answer;
  category: Category;
}

export class Faq {
  private readonly _id?: number | null;
  private _question: Question;
  private _answer: Answer;
  private _category: Category;

  constructor(props: FaqProps, id?: number) {
    this._id = id || null;
    this._question = props.question;
    this._answer = props.answer;
    this._category = props.category;
  }

  get id() {
    return this._id;
  }
  get answer() {
    return this._answer;
  }

  get question() {
    return this._question;
  }

  get category() {
    return this._category;
  }

  public updateAnswer(answer: string): Either<NullOrUndefinedError, void> {
    const answerOrError = Answer.create(answer);

    if (answerOrError.isLeft()) {
      return left(answerOrError.value);
    }

    return right();
  }

  public updateQuestion(question: string): Either<NullOrUndefinedError, void> {
    const questionOrError = Question.create(question);

    if (questionOrError.isLeft()) {
      return left(questionOrError.value);
    }

    return right();
  }

  public addCategory(category: Category): Either<Error, void> {
    this._category = category;
    return right();
  }

  static create(
    props: {
      question: string;
      answer: string;
      category: Category;
    },
    id?: number
  ): Either<Error, Faq> {
    const errors = new Notification();

    const args: GuardArgumentCollection = [
      { argument: props.question, argumentName: "questão" },
      { argument: props.answer, argumentName: "resposta" },
      { argument: props.category, argumentName: "categoria" },
    ];

    const guardArgs = againstNullOrUndefinedBulk(args);

    if (guardArgs.isLeft()) {
      return left(new Error(concatenateMessages(guardArgs.value)));
    }

    if (props.category === null || props.category === undefined) {
      errors.addError(new Error("é necessário informar a categoria"));
    }

    const questionOrError = Question.create(props.question);

    if (questionOrError.isLeft()) {
      errors.addError(questionOrError.value);
    }

    const answerOrError = Answer.create(props.answer);

    if (answerOrError.isLeft()) {
      errors.addError(answerOrError.value);
    }

    if (errors.hasErrors()) {
      return left(new Error(errors.messages()));
    }

    return right(
      new Faq(
        {
          answer: answerOrError.value as Answer,
          question: questionOrError.value as Question,
          category: props.category,
        },
        id
      )
    );
  }
}
