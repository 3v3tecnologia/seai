import { Either, left, right } from "../../../../shared/Either";
import { NullOrUndefinedError } from "../../../../shared/errors/null-or-undefined";
import { againstNullOrUndefined } from "../../../../shared/Guard";
import { Notification } from "../../../../shared/notification/notification";
import { AgainstNullOrUndefined } from "../../../../shared/utils/against-null-or-undefined";
import { CategoryDescription } from "./category-description";
import { CategoryTitle } from "./category-title";

interface Props {
  title?: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export class Category {
  private _id?: number;
  private _title?: string;
  private _description?: string;
  private _created_at?: string;
  private _updated_at?: string;

  private constructor(id?: number, props?: Props) {
    this._id = id;

    if (props) {
      this._title = props.title;
      this._description = props.description;
      this._created_at = props.created_at;
      this._updated_at = props.updated_at;
    }
  }

  get id(): number | null {
    return this._id || null;
  }

  get title(): string | null {
    return this._title || null;
  }

  get description(): string | null {
    return this._description || null;
  }

  get created_at(): string | null {
    return this._created_at || null;
  }

  get updated_at(): string | null {
    return this._updated_at || null;
  }

  static create(data: {
    id?: number;
    props?: Props;
  }): Either<NullOrUndefinedError | Error, Category> {
    const errors = new Notification();

    if (data.id) {
      const nullOrUndefined = againstNullOrUndefined(data.id, "identificador");

      if (nullOrUndefined.isLeft()) {
        errors.addError(new NullOrUndefinedError(nullOrUndefined.value));
      }
    }

    if (data.props) {
      const titleOrError = CategoryTitle.create(data.props.title as string);

      if (titleOrError.isLeft()) {
        errors.addError(titleOrError.value);
      }

      const descriptionOrError = CategoryDescription.create(
        data.props.description as string
      );

      if (descriptionOrError.isLeft()) {
        errors.addError(descriptionOrError.value);
      }

      if (Reflect.has(data.props, "created_at")) {
        const createdNullOrUndefined = AgainstNullOrUndefined(
          data.props.created_at,
          "data de criação"
        );

        if (createdNullOrUndefined.isLeft()) {
          errors.addError(createdNullOrUndefined.value);
        }
      }

      if (Reflect.has(data.props, "updated_at")) {
        const updatedNullOrUndefined = AgainstNullOrUndefined(
          data.props.updated_at,
          "data de atualização"
        );

        if (updatedNullOrUndefined.isLeft()) {
          errors.addError(updatedNullOrUndefined.value);
        }
      }
    }

    if (errors.hasErrors()) {
      return left(new Error(errors.messages()));
    }

    return right(new Category(data.id, data.props));
  }
}
