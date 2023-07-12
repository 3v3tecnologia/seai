import { Either, left, right } from "../../../shared/Either";
import {
  GuardArgumentCollection,
  againstNullOrUndefinedBulk,
  concatenateMessages,
} from "../../../shared/Guard";
import { Notification } from "../../../shared/notification/notification";
import { NullOrUndefinedError } from "../../../shared/validation/errors/null-or-undefined";
import { Answer } from "./answer";
import { Categories } from "./categories";
import { Category } from "./category";
import { Question } from "./question";

interface FaqProps {
  question: Question;
  answer: Answer;
  order?: number | null;
  categories: Categories;
}

export class Faq {
  private readonly _id?: number | null;
  private _question: Question;
  private _answer: Answer;
  private _order?: number | null;
  private _categories: Categories;

  constructor(props: FaqProps, id?: number) {
    this._id = id || null;
    this._question = props.question;
    this._answer = props.answer;
    this._order = props.order || null;
    this._categories = props.categories;
  }

  get answer() {
    return this._answer;
  }

  get question() {
    return this._question;
  }

  get order() {
    return this._order;
  }

  get categories() {
    return this._categories;
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
    const exists = this._categories.values.some(
      (item) => item.id === category.id
    );
    if (exists) {
      return left(new Error("Categoria já existe"));
    }
    this._categories.values.push(category);
    return right();
  }

  static create(
    props: {
      question: string;
      answer: string;
      order?: number;
      categories: Categories;
    },
    id?: number
  ): Either<Error, Faq> {
    const errors = new Notification();

    const args: GuardArgumentCollection = [
      { argument: props.question, argumentName: "questão" },
      { argument: props.answer, argumentName: "resposta" },
      { argument: props.categories, argumentName: "categorias" },
    ];

    if (props.order) {
      args.push({ argument: props.order, argumentName: "ordem" });
    }

    const guardArgs = againstNullOrUndefinedBulk(args);

    if (guardArgs.isLeft()) {
      return left(new Error(concatenateMessages(guardArgs.value)));
    }

    if (props.categories.values.length === 0) {
      errors.addError(
        new Error("é necessário informar pelo menos uma categoria")
      );
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
          categories: props.categories,
          order: props.order || null,
        },
        id
      )
    );
  }
}
