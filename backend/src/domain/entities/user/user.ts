import { Either, left, right } from "../../../shared/Either";
import { Email } from "./email";
import {
  UserModulesAccess,
  UserModulesAccessProps,
} from "./user-modules-access";

type UserType = "admin" | "standard";
interface UserProps {
  name?: string;
  login?: string;
  email: Email;
  password?: string | null;
  modulesAccess: UserModulesAccess;
  type: UserType;
}

export class User {
  private readonly _id: number | null;
  public readonly name: string | null;
  public readonly login: string | null;
  public email: Email;
  public password: string | null;
  public readonly type: UserType;
  public readonly modulesAccess: UserModulesAccess;

  private constructor(props: UserProps, id?: number) {
    this._id = id || null;
    this.email = props.email;
    this.type = props.type;
    this.modulesAccess = props.modulesAccess;

    this.name = props.name || null;
    this.login = props.login || null;
    this.password = props.password || null;
  }

  get id(): number | null {
    return this._id;
  }

  static create(
    props: {
      email: string;
      type: UserType;
      modulesAccess: UserModulesAccessProps;
    },
    id?: number
  ): Either<Error, User> {
    const modulesOrError = UserModulesAccess.create(props.modulesAccess);

    if (modulesOrError.isLeft()) {
      return left(modulesOrError.value);
    }

    const emailOrError = Email.create(props.email);

    if (emailOrError.isLeft()) {
      return left(emailOrError.value);
    }

    return right(
      new User(
        {
          email: emailOrError.value as Email,
          modulesAccess: modulesOrError.value as UserModulesAccess,
          type: props.type,
        },
        id
      )
    );
  }

  static updateAccount(props: any): any {}
}
